const debounce = (func, delay = 1000) => {
	let timeoutId;
	return (...args) => {
		// ...args is spread operator for arguments instead of listing each one.
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args); //applies all arguments as separate arguments to the orginal function.
		}, delay);
	};
};
