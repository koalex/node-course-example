import * as AT  from '../../actionTypes';

export default store => {

	return next => {
		return action => {
			const { type, payload } = action;

			if (type === AT.SIGNIN_SUCCESS) window.localStorage.setItem('access_token', payload.access_token);

			return next(action);
		}
	}
}