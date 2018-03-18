import React                                from 'react';
import PropTypes                            from 'prop-types';
import Route                                from 'react-router-dom/Route';
import Switch                               from 'react-router-dom/Switch';
import { connect }                          from 'react-redux';
import io                                   from 'socket.io-client';
import ConnectedRouter                      from 'react-router-redux/ConnectedRouter';
import routes                               from './router';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Paper                                from 'material-ui/Paper';
import history                              from './middlewares/history';
import RouteWithSubRoutes                   from './components/RouteWithSubRoutes';
import Preloader                            from './components/PagePreloader';
import NotFound                             from './components/404';
/* ACTION CREATORS */
import dispatch                             from './actionCreators/dispatch';
import auth                                 from './actionCreators/auth';

const theme = createMuiTheme({});

const ConnectedSwitch = connect(state => ({
    location: state.get('router').get('location')
}))(Switch);

let socket;
function socketConnect () {
    if (socket /*&& socket.connected*/) return socket;

    socket = io.connect('/', { query: {
        access_token: window.localStorage.getItem('access_token') },
        'transports': ['websocket']
    });

    socket.on('error', err => {
        console.log('SOCKET ERROR =', err);
    });

    return socket;
}

@connect(state => {
    return {
        bootstrap: state.get('bootstrap'),
        router: state.get('router'),
        user: state.get('users').get('user')
    };
}, {
    dispatch
})
export default class Routes extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
        // props.changeLocale(props.locale);
        props.dispatch(auth());
    }

    static propTypes = {
        bootstrap: PropTypes.bool.isRequired,
        router: PropTypes.object.isRequired,
        user: PropTypes.object,
        /* actions */
        dispatch: PropTypes.func.isRequired
    };

    static childContextTypes = {
        user: PropTypes.object
    };

    getChildContext () {
        return {
            user: this.props.user
        };
    }

    render () {
        const { bootstrap, user, dispatch } = this.props;
        if (!bootstrap) {
            return <MuiThemeProvider theme={theme}>
                <Preloader />
            </MuiThemeProvider>
        }

        return (
            <ConnectedRouter history={history}>
                <MuiThemeProvider theme={theme}>
                    <Paper style={{ height: '100%', overflow: 'auto' }}>
                        <div style={{ height: 'calc(100% - 48px)' }}>
                            <ConnectedSwitch>
                                {routes.map((route, i) => (
                                    <RouteWithSubRoutes
                                        key={i}
                                        {...route}
                                        user={user}
                                        dispatch={dispatch}
                                        socket={socketConnect()}
                                    />
                                ))}
                                <Route component={NotFound} />
                            </ConnectedSwitch>
                        </div>
                    </Paper>
                </MuiThemeProvider>
            </ConnectedRouter>
        );
    }
}
