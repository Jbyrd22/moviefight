
const autoCompleteConfig = {
	renderOption(movie) {
		const imageSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
                <img src="${imageSrc}" />
                ${movie.Title} - (${movie.Year})
            `;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params : {
				apikey : APIKEY,
				s      : searchTerm
			}
		});

		//keeps error from happening if user doesn't type in valid movie.
		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	}
};

createAutocomplete({
	...autoCompleteConfig,
	root           : document.querySelector('.left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('.left-summary'), 'left');
	}
});
createAutocomplete({
	...autoCompleteConfig,
	root           : document.querySelector('.right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('.right-summary'), 'right');
	}
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, element, side) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params : {
			apikey : APIKEY,
			i      : movie.imdbID
		}
	});
	console.log(response.data);
	element.innerHTML = movieTemplate(response.data);

	if (side === 'left') {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('.left-summary .notification');
	const rightSideStats = document.querySelectorAll('.right-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		//to call a dataset property of an element use '.dataset.#name-of-data-attribute'
		const leftStatValue = parseFloat(leftStat.dataset.value);
		const rightStatValue = parseFloat(rightStat.dataset.value);

		if (rightStatValue > leftStatValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};

const movieTemplate = (movieDetail) => {
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metaScore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetail.Title}</h1>
					<h4>${movieDetail.Genre}</h4>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>
		<article data-value="${awards}" class="notification is-primary">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value="${dollars}" class="notification is-primary">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value="${metaScore}" class="notification is-primary">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Meta Score</p>
		</article>
		<article data-value="${imdbRating}" class="notification is-primary">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value="${imdbVotes}" class="notification is-primary">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};
