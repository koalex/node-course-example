import * as AT  from '../actionTypes';
import auth from '../actionCreators/auth'

export default store => {
	return next => {
		return action => {
			next(action);
			const { type, payload } = action;

			if (type === AT.SIGNIN_SUCCESS) {
				window.localStorage.setItem('access_token', payload.access_token);
				store.dispatch(auth());
			}
		}
	}
}