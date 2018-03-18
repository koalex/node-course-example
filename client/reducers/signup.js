import { fromJS }         from 'immutable';
import * as AT            from '../actionTypes';

export const init = fromJS({
	disabled: false,
	name: '',
	nameErr: null,
	surname: '',
	surnameErr: null,
	login: '',
	loginErr: null,
	email: '',
	emailErr: null,
	password: '',
	passwordErr: null,
	passwordConfirmation: '',
	passwordConfirmationErr: null
});

export default function (state = init, action) {
	const {type, data, payload, ...rest} = action;
	let nextState;

	switch (type) {
		default:
			return state;

		case AT.SIGNUP:
			return state.set('disabled', true)
				.set('name', data.name)
				.set('nameErr', null)
				.set('surname', data.surname)
				.set('surnameErr', null)
				.set('login', data.login)
				.set('loginErr', null)
				.set('email', data.email)
				.set('emailErr', null)
				.set('password', data.password)
				.set('passwordErr', null)
				.set('passwordConfirmation', data.passwordConfirmation)
				.set('passwordConfirmationErr', null);


		case AT.SIGNUP_FORM_CHANGE:
			if (state.get(data + 'Err')) return state.set(data + 'Err', null);

			return state;

		case AT.SIGNUP_SUCCESS:
			return state.set('disabled', false);

		case AT.SIGNUP_ERROR:
			nextState = state.set('disabled', false);

			if (payload) {
				if (Array.isArray(payload)) {
					payload.forEach(err => {
						if (err.field) {
							nextState = nextState.set(err.field + 'Err', err.message);
						}
					})
				} else if (payload.field && payload.message) {
					nextState = nextState.set(payload.field + 'Err', payload.message);
				}
			}

			return nextState;

	}

	return state;
}