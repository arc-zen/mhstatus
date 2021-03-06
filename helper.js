//https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
export function timeDifference(current, previous) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;
	var elapsed = current - previous;
	if (elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + " seconds ago";
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + " minutes ago";
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + " hours ago";
	} else if (elapsed < msPerMonth) {
		return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
	} else if (elapsed < msPerYear) {
		return "approximately " + Math.round(elapsed / msPerMonth) + " months ago";
	} else {
		return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
	}
}
export function unixTimeDifference(c, p) {
	return c - p;
}
export function random_array_element(a) {
	const r = Math.floor(Math.random() * a.length);
	const c = a[r];
	return c;
}
export function random_chalk_color() {
	const e = ["red", "green", "yellow", "blue", "magenta", "cyan"];
	const r = Math.floor(Math.random() * e.length);
	const c = e[r];
	return c;
}
export function random_integer(mn, mx) {
	const r = Math.floor(Math.random() * (mx - mn + 1)) + mn;
	return r;
}
export function delay(n) {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n);
	});
}
export function syncSetTimeout(func, ms, callback) {
	(function sync(done) {
		if (!done) {
			setTimeout(function () {
				func.apply(func);
				sync(true);
			}, ms);
			return;
		}
		callback.apply(callback);
	})();
}
