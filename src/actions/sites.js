import config from '../config';

export const SITES_REQUEST = 'SITES_REQUEST';
export const SITES_SUCCESS = 'SITES_SUCCESS';
export const SITES_FAILURE = 'SITES_FAILURE';

export const SITE_SELECT = 'SITE_SELECT';

const requestSites = () => ({
    type: SITES_REQUEST,
    isFetching: true,
});

export const receiveSites = items => ({
    type: SITES_SUCCESS,
    isFetching: false,
    items,
});

const sitesError = message => ({
    type: SITES_FAILURE,
    isFetching: false,
    message,
});


export const changeSite = (site) => {
    console.log('used site?!', site);
    return {
        type: SITE_SELECT,
        site,
    };
};


export const getSites = token => (dispatch) => {
    dispatch(requestSites());

    const fetchConf = {
        headers: {
            Authorization: token,
        },
    };

    return fetch(`${config.api.apiRest}/requests/getSites`, fetchConf)
        .then(response => response.json())
        .then((responseJson) => {
            dispatch(receiveSites(responseJson));
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
            dispatch(sitesError(error));
        });
};
