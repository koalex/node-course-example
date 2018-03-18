import React 			from 'react';
import ReactDOM 		from 'react-dom';
import { Provider } 	from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App 			    from './App';
import createStore 		from './store';

let DevTools, store = createStore();

if (__DEVTOOLS__) {
	DevTools = require('./DevTools').default;
}

const render = Component => {
  ReactDOM.render(
	  	<AppContainer warnings={__DEV__}>
			<Provider store={ store } key="provider">
				<div style={{ height: '100%' }}>
					<Component />
					{ !DevTools ? <DevTools /> : null }
				</div>
			</Provider>
		</AppContainer>
    ,
    document.getElementById('root')
  )
};

render(App);

if (module && module.hot) {
	module.hot.accept('./App', () => {
		// let nextApp = require('./App');
		render(App);
	});
}
