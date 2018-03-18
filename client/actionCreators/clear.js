import * as AT from '../actionTypes';

export default function (fieldStr) {
	return {
		type: AT.CLEAR,
		data: {
			field: fieldStr
		}
	}
}