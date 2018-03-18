'use strict';

import formDataFromObject from 'utils/formDataFromObject';
import * as AT            from '../actionTypes';

const defaultHeaders = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'x-access-token': window.localStorage.getItem('access_token')
};

export default store => next => async action => {
	const { CALL_API, type, ...rest } = action;

	if (!CALL_API) return next({ type, ...rest });

	next({ type, CALL_API, ...rest});

	if (CALL_API.success_type != false && !CALL_API.success_type) {
		if (CALL_API.error_type) {
			return store.dispatch({ ...rest, type: CALL_API.error_type, payload: 'CALL_API must contain "success_action_type"' });
		} else {
			throw new Error('CALL_API must contain "success_action_type" or "false" for skip response');
		}
	} else if (CALL_API.error_type != false && !CALL_API.error_type) {
		throw new Error('CALL_API must contain "success_action_type" or "false" for skip response');
	}

	let headers = Object.assign(defaultHeaders, {'x-access-token': window.localStorage.getItem('access_token')});

	if (CALL_API.headers && 'object' === typeof CALL_API.headers) {
		headers = Object.assign(headers, CALL_API.headers);
	} else if (CALL_API.headers && 'object' !== typeof CALL_API.headers) {
		console.warn('API middleware: headers must be an object, but got ', (typeof CALL_API.headers) + '.', 'Skip headers');
	}

	// TODO: credentials property MUST be one of the strings omit, same-origin or include.
	const request = {
		method: CALL_API.method,
		mode: 'same-origin',
		cache: 'no-cache',
		headers
	};

	if (request.headers['Content-Type'] && ~request.headers['Content-Type'].indexOf('multipart/form-data') && CALL_API.body) {
		if (CALL_API.body instanceof FormData) {
			request.body = CALL_API.body;
		} else {
			request.body = formDataFromObject(CALL_API.body)
		}
	} else if (request.headers['Content-Type'] && (~request.headers['Content-Type'].indexOf('json') || ~request.headers['Content-Type'].indexOf('x-www-form-urlencoded')) && CALL_API.body) {
		if ('object' === typeof CALL_API.body) {
			request.body = JSON.stringify(CALL_API.body);
		} else {
			request.body = CALL_API.body;
		}
	}


	let timeout = 10000, response;

	try {
		response = await Promise.race([
			fetch(CALL_API.endpoint, request), // TODO: логирование для ошибок при запросе
			new Promise((_, reject) => {
				setTimeout(function () {
					reject({message: 'timeout'});
				}, timeout);
			})
		]);
	} catch (err) {
		return store.dispatch({ type: CALL_API.error_type, payload: {message: err.message}, ...rest });
	}

	if (response.status == 204) return store.dispatch({ type: CALL_API.success_type, ...rest });

	let payload;

	let contentType = response.headers.get('Content-Type');

	let fileContentTypes = ['gzip'];
	if (contentType && ~contentType.indexOf('json')) {
		payload = await response.json();
	} else if (contentType && fileContentTypes.some(ct => ~contentType.indexOf(ct))) {
		payload = await response.blob();

		// FileSaver.saveAs(payload, rest.filename ? rest.filename: null);
	} else {
		payload = await response.text();
	}

	if (response.status >= 200 && response.status < 300) {
		if (CALL_API.success_type) store.dispatch({ type: CALL_API.success_type, payload, ...rest });
		return;
	}
	if (response.status == 401) {
		return store.dispatch({ type: AT.AUTH_ERROR, payload, ...rest });
	}
	if (response.status >= 400) {
		if (CALL_API.error_type) {
			return store.dispatch({ type: CALL_API.error_type, payload, ...rest });
		}

	}
}