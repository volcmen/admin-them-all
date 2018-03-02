import config from '../config';

export const DATA_REQUEST = 'DATA_REQUEST';
export const DATA_SUCCESS = 'DATA_SUCCESS';
export const DATA_FAILURE = 'DATA_FAILURE';

const requestData = () => ({
    type: DATA_REQUEST,
    isFetching: true,
});

const receiveData = data => ({
    type: DATA_SUCCESS,
    isFetching: false,
    data,
});

const dataError = message => ({
    type: DATA_FAILURE,
    isFetching: false,
    message,
});

export const getData = (token, whatData, link) => (dispatch) => {
    dispatch(requestData());

    const fetchConf = {
        headers: {
            Authorization: token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Link: link,
        },
    };

    return fetch(`${config.api.apiRest}/requests/${whatData}`, fetchConf)
        .then(response => response.json())
        .then((responseJson) => {
            dispatch(receiveData(responseJson));
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
            dispatch(dataError(error));
        });
};
