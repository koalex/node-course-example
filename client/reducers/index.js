import { Record }                                   from 'immutable';
import bootstrap, { init as bootstrapInitialState } from './bootstrap';
import router, { init as routerInitialState }       from './router';
import signin, { init as signinInitialState }       from './signin';
import signup, { init as signupInitialState }       from './signup';
import users, { init as usersInitialState }         from './users';

const stateRecord = Record({
	bootstrap: bootstrapInitialState,
	router: routerInitialState,
	signin: signinInitialState,
	signup: signupInitialState,
	users: usersInitialState
});

export const init = new stateRecord();

export default function () {
	return {
		initialState: init,
		reducers: { bootstrap, router, signin, signup, users },
		middlewares: []/*.concat(middlewares)*/
	};
}
