import jwt from 'jsonwebtoken';
import config from '../config';
import history from '../history';
import { changeSite } from './sites';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';


const requestLogin = creds => ({
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds,
});

export const receiveLogin = user => ({
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    accountType: user.accountType,
    user: user.user,
    theme: user.theme,
});

const loginError = message => ({
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message,
});

const requestLogout = () => ({
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true,
});

export const receiveLogout = () => ({
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
});

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout());
    localStorage.clear();
    document.cookie = 'id_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    dispatch(receiveLogout());
    return history.push('/');
};

export const authUser = (token, isAuthenticated) => (dispatch) => {
    if (!isAuthenticated) dispatch(requestLogin(token));
    return jwt.verify(token, config.auth.jwt.secret, (err, decoded) => {
        if (err) return dispatch(receiveLogout());
        if (decoded.lastUsedSite)
            dispatch(changeSite(decoded.lastUsedSite));


        dispatch(receiveLogin({
            user: decoded.user,
            accountType: decoded.accType,
            theme: decoded.theme,
        }));
    });
};

export const loginUser = (creds) => {
    const fetchConf = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${creds.login.toLowerCase()}&password=${creds.password}`,
    };

    return (dispatch) => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin(creds));

        return fetch(`${config.api.apiRest}/entry/login`, fetchConf)
            .then(response =>
                response.json().then(user => ({ user, response }))).then(({ user, response }) => {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(loginError(user.message));
                    return Promise.reject(user);
                }
                localStorage.setItem('id_token', user.id_token);
                document.cookie = `id_token=${user.id_token}`;

                console.log('Usuer!!!', user);
                if (user.lastUsedSite)
                    dispatch(changeSite(user.lastUsedSite));


                dispatch(receiveLogin(user));
                return 0;
            }).catch(err => console.error('Error: ', err));
    };
};
