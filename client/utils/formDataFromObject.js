function formDataFromObject (obj, fd) {
	if ('object' != typeof obj || null === obj) {
		throw new Error('expected object, but got ' + (null === obj ? 'null' : typeof obj));
	} else {
		let formData = fd || new FormData();

		for (let prop in obj) {
			if (!(obj.hasOwnProperty(prop))) continue;

			if (obj[prop] instanceof File || 'object' != typeof obj[prop] || null === obj[prop]) {
				formData.append(prop, obj[prop]);
			} else if ('object' === typeof obj[prop]) {
				formDataFromObject(obj[prop], fd);
			}
		}

		return formData;
	}
}

export default formDataFromObject