import * as AT  from '../actionTypes';

export default store => {
	return next => {
		return action => {
			next(action);

			let { type } = action;
			if (type === AT.AUTH && store.getState().get('bootstrap')) {
				store.dispatch({ type: AT.BOOTSTRAP, data: false });
			} else if ((type === AT.AUTH_SUCCESS || type === AT.AUTH_ERROR) && !store.getState().get('bootstrap')) {
				store.dispatch({ type: AT.BOOTSTRAP, data: true });
			}
		}
	}
}
