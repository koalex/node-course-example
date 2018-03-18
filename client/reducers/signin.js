import { fromJS }         from 'immutable';
import * as AT            from '../actionTypes';


export const init = fromJS({
	disabled: false,
	login: '',
	loginErr: null,
	password: '',
	passwordErr: null,
	showPassword: false
});

export default function (state = init, action) {
	const {type, data, payload, ...rest} = action;
	let nextState;

	switch (type) {
		default:
			return state;

		case AT.SIGNIN:
			return state.set('disabled', true)
				.set('login', data.login)
				.set('password', data.password)
				.set('loginErr', null)
				.set('passwordErr', null);

		case AT.SIGNIN_FORM_CHANGE:
			if ('login' == data && state.get('loginErr')) return state.set('loginErr', null);
			if ('password' == data && state.get('passwordErr')) return state.set('passwordErr', null);
			if ('showPassword' == data) return state.set('showPassword', !state.get('showPassword'));

			return state;

		case AT.SIGNIN_SUCCESS:
			return state.set('disabled', false).set('login', '').set('password', '');

		case AT.SIGNIN_ERROR:
			nextState = state.set('disabled', false);

			if (payload) {
				if (Array.isArray(payload)) {
					payload.forEach(err => {
						if (err.field) {
							nextState = nextState.set(err.field + 'Err', err.message);
						}
					})
				} else if (payload.message && payload.message == 'Missing credentials') {
					if (!nextState.get('login')) nextState = nextState.set('loginErr', 'не заполнено');
					if (!nextState.get('password')) nextState = nextState.set('passwordErr', 'не заполнено');
				}
			}

			return nextState;

	}

	return state;
}