export default function (cookieName, value, options = {}) {
	let expires = options.expires;

	if ('number' === typeof expires && expires) {
		let d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}

	if (expires && expires.toUTCString) options.expires = expires.toUTCString();

	value = encodeURIComponent(value);

	let updatedCookie = cookieName + "=" + value;

	for (let propName in options) {
		updatedCookie += "; " + propName;
		let propValue = options[propName];
		if (propValue !== true) updatedCookie += "=" + propValue;
	}

	document.cookie = updatedCookie;
}