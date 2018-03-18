import React     from 'react';
import PropTypes from 'prop-types';
import Route     from 'react-router-dom/Route';
import Redirect  from 'react-router-dom/Redirect';

const RouteWithSubRoutes = (route, context) => {
    let user = ('user' in route ? route.user : context.user);


    return (
        <Route
            location={route.location}
            exact={route.exact || false}
            strict={route.strict || false}
            path={route.path}
            render={props => {
                // pass the sub-routes down to keep nesting
                if (route.private && !user) { // FIXME: move to router ?
                    return <Redirect to={{
                        pathname: '/signin',
                        state: { from: props.location }
                    }}/>
                }
                if (!route.component) return null;
                return (
                    <route.component
                        {...props}
                        user={user}
                        socket={route.socket}
                        routes={route.routes || []}
                    />
                );
            }}
        />
    );
};

RouteWithSubRoutes.contextTypes = {
    user: PropTypes.object
};

export default RouteWithSubRoutes;
