import { LOCATION_CHANGE } from 'react-router-redux';
import { Map }             from 'immutable';


export const init = Map({ location: Map() });

export default function (state = init, action) {
    const { type, payload } = action;

    switch (type) {
        default:
            return state;

        case LOCATION_CHANGE:
            return state.set('location', payload);
    }
}
