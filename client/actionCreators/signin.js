import * as AT from '../actionTypes';

export function submit (data) {
	const { login, password } = data;

	return {
		type: AT.SIGNIN,
		data: {
			login,
			password
		},
		CALL_API: {
			endpoint: '/api/v1/signin',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: {
				login,
				password
			},
			success_type: AT.SIGNIN_SUCCESS,
			error_type: AT.SIGNIN_ERROR
		}
	}
}

export function formChange (data) {
	return {
		type: AT.SIGNIN_FORM_CHANGE,
		data
	}
}