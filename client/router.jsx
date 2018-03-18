import React     from 'react';
import Redirect  from 'react-router-dom/Redirect';
import universal from 'react-universal-component';
import Preloader from './components/PagePreloader';

// for SSR use webpack-flush-chunks -> https://github.com/faceyspacey/webpack-flush-chunks
const Signin = universal(import('./components/Signin/container'), {
	minDelay: 500,
	alwaysDelay: false,
	loading: () => <Preloader />
});

const Signup = universal(import('./components/Signup/container'), {
	minDelay: 500,
	alwaysDelay: false,
	loading: () => <Preloader />
});

const Chat = universal(import('./components/Chat/container'), {
	minDelay: 500,
	alwaysDelay: false,
	loading: () => <Preloader />
});

export default [
	{
		path: '/',
		component: ({ match, location, ...props }) => {
			return <Redirect to={{ pathname: '/chat' }} />
		},
		private: true,
		exact: true
	},
	{
		path: '/chat',
		component: ({ match, location, ...props }) => {
			return <Chat {...props} />
		},
		private: true,
		exact: true
	},
	{
		path: '/signin',
		component: ({ ...props }) => {
			if (props.user) {
				return <Redirect to={{ pathname: '/chat' }} />
			}
			return <Signin {...props} />
		},
		exact: true
	},
	{
		path: '/signup',
		component: ({ ...props }) => {
			if (props.user) {
				return <Redirect to={{ pathname: '/chat' }} />
			}
			return <Signup {...props} />
		},
		exact: true
	}
]