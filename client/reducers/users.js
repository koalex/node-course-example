import { fromJS } from 'immutable';
import * as AT    from '../actionTypes';

export const init = fromJS({
	user: null,
	users: []
});

export default function (state = init, action) {
	const {type, data, payload, ...rest} = action;

	switch (type) {
		default:
			return state;

		case AT.SIGNOUT_SUCCESS:
		case AT.SIGNOUT_GLOBAL_SUCCESS:
			if (state.get('user')) return state.set('user', null);

			break;

		case AT.AUTH_SUCCESS:
			return state.set('user', fromJS(payload));

			break;

		case AT.AUTH_ERROR:
			if (state.get('user')) return state.set('user', null);

			return state;

			break;
	}
}