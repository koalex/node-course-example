/** ✰✰✰ Konstantin Aleksandrov ✰✰✰ https://github.com/koalex ✰✰✰ **/

import { createStore, compose, applyMiddleware } from 'redux';
import { combineReducers }                       from 'redux-immutable';
import { routerMiddleware }                      from 'react-router-redux'
import createReducer                             from '../reducers';
import api                                       from '../middlewares/api';
import history                                   from '../middlewares/history';
import signin                                    from '../middlewares/signin';
import signup                                    from '../middlewares/signup';


let DevTools;

const middlewares = [];

export default function (preloadedState) {
        const data = createReducer();

        if (Array.isArray(data.middlewares)) {
            data.middlewares.forEach(mw => {
                middlewares.push(mw);
            });
        }

        middlewares.push(signin);
        middlewares.push(signup);
        middlewares.push(routerMiddleware(history));

        middlewares.push(api);

        let enhancer = applyMiddleware(...middlewares);

        if (__DEVTOOLS__) {
            DevTools = require('../DevTools').default;
            enhancer = compose(enhancer, DevTools.instrument()); // этот MW всегда надо подключать последним !!!
        }

        const store = createStore(
            combineReducers(data.reducers),
            data.initialState,
            enhancer
        );

        store.asyncReducers = {};

        if (__DEV__) {
            if (module && module.hot) {
                // Enable Webpack hot module replacement for reducers
                module.hot.accept('../reducers', () => { // TODO: путь до редусеров в модулях
                    const nextRootReducer = require('../reducers/index').default;
                    let data = nextRootReducer();
                    store.replaceReducer(combineReducers(data.reducers));
                });
            }

            window.store = store;
        }

        return store;
}
