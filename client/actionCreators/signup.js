import * as AT from '../actionTypes';

export function submit (data) {
	const { name, surname, login, email, password, passwordConfirmation } = data;

	return {
		type: AT.SIGNUP,
		data: { name, surname, login, email, password, passwordConfirmation },
		CALL_API: {
			endpoint: '/api/v1/signup',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: { name, surname, login, email, password, passwordConfirmation },
			success_type: AT.SIGNUP_SUCCESS,
			error_type: AT.SIGNUP_ERROR
		}
	}
}

export function formChange (data) {
	return {
		type: AT.SIGNUP_FORM_CHANGE,
		data
	}
}
