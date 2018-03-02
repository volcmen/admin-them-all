import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { connect, Provider as ReduxProvider } from 'react-redux';
import jwt from 'jsonwebtoken';
import { authUser } from '../actions/user';
import config from '../config';

import Bundle from '../core/Bundle';

/* eslint-disable */
import loadErrorPage from 'bundle-loader?lazy!../pages/error/ErrorPage';
/* eslint-enable */

import LayoutComponent from '../components/Layout/Layout';
import LoginComponent from '../pages/login/Login';


const ErrorPageBundle = Bundle.generateBundle(loadErrorPage);


const ContextType = {
    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    insertCss: PropTypes.func.isRequired,
    // Universal HTTP client
    fetch: PropTypes.func.isRequired,
    // Integrate Redux
    // http://redux.js.org/docs/basics/UsageWithReact.html
    ...ReduxProvider.childContextTypes,
};

const isAuthenticated = (token) => {
    if (!token) return false;
    console.log('admin auth token?', token);
    return jwt.verify(token, config.auth.jwt.secret, (err, decoded) => {
        if (err) return false;
        console.log('decoded', decoded);
        return true;
    });
};

const adminAuth = (token) => {
    if (!token) return false;
    console.log('admin auth token?', token);
    return jwt.verify(token, config.auth.jwt.secret, (err, decoded) => {
        if (err) return false;
        console.log('decoded', decoded);
        return decoded.accType === 'Admin';
    });
};


const PrivateRouteAdmin = ({component, authToken, ...rest}) => ( // eslint-disable-line
    <Route
        {...rest}
        render={props => (
            adminAuth(authToken) ? (
                React.createElement(component, props)
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: {from: props.location}, // eslint-disable-line
                    }}
                />
            )
        )}
    />
);

const PrivateRoute = ({component, authToken, ...rest}) => ( // eslint-disable-line
    <Route
        {...rest}
        render={props => (
            isAuthenticated(authToken) ? (
                React.createElement(component, props)
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: {from: props.location}, // eslint-disable-line
                    }}
                />
            )
        )}
    />
);

class App extends React.PureComponent {
    static propTypes = {
        context: PropTypes.shape(ContextType),
        store: PropTypes.any, // eslint-disable-line
        isAuthenticated: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired,
        authToken: PropTypes.string,
    };

    static defaultProps = {
        context: null,
        authToken: null,
    };


    static contextTypes = {
        router: PropTypes.any,
        store: PropTypes.any,
    };

    static childContextTypes = ContextType;

    getChildContext() {
        // fixme. find better solution?
        return this.props.context || this.context.router.staticContext;
    }

    componentWillMount() {
        return this.props.dispatch(authUser(this.props.authToken, this.props.isAuthenticated));
    }


    render() {
        return (
            <Switch>
                <Route path="/" exact render={() => <Redirect to="/app" />} />
                <PrivateRoute authToken={this.props.authToken} path="/app" component={LayoutComponent} />
                <Route path="/login" exact component={LoginComponent} />
                <Route component={ErrorPageBundle} />
            </Switch>
        );
    }
}

const mapStateToProps = store => ({
    isAuthenticated: store.auth.isAuthenticated,
    accountType: store.auth.accountType,
    Token: store.auth.id_token,
});

export default withRouter(connect(mapStateToProps)(App));
