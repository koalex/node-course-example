import * as AT from '../actionTypes';

export const init = true; // false - идёт загрузка и показывается прелоадер

export default function (state = init, action) {
	const { type, data } = action;

	switch (type) {
		default:
			return state;

		case AT.BOOTSTRAP:
			return !!data;
	}
}