import * as AT  from '../actionTypes';
import {submit} from '../actionCreators/signin';

export default store => {
	return next => {
		return action => {
			next(action);

			let { type, data } = action;
			if (type === AT.SIGNUP_SUCCESS) {
				store.dispatch(submit({
					login: data.login,
					password: data.password
				}));
			}
		}
	}
}