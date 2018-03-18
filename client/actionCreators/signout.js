import * as AT from '../actionTypes';

export function signout () {
	return {
		type: AT.SIGNOUT,
		CALL_API: {
			endpoint: '/api/v1/signout',
			method: 'POST',
			success_type: AT.SIGNOUT_SUCCESS,
			error_type: AT.SIGNOUT_ERROR
		}
	}
}

export function signoutGlobal () {
	return {
		type: AT.SIGNOUT_GLOBAL,
		CALL_API: {
			endpoint: '/api/v1/signout-global',
			method: 'POST',
			success_type: AT.SIGNOUT_GLOBAL_SUCCESS,
			error_type: AT.SIGNOUT_GLOBAL_ERROR
		}
	}
}
