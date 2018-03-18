import * as AT from '../actionTypes';

export default function () {
	return {
		type: AT.AUTH,
		CALL_API: {
			endpoint: '/api/v1/me',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			success_type: AT.AUTH_SUCCESS,
			error_type: AT.AUTH_ERROR
		}
	}
}