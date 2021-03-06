import { DATA_REQUEST, DATA_SUCCESS, DATA_FAILURE } from '../actions/getDataFromMongo';

export default function data(state = {
    isFetching: false,
}, action) {
    switch (action.type) {
        case DATA_REQUEST: {
            return Object.assign({}, state, {
                isFetching: true,
            });
        }
        case DATA_SUCCESS: {
            return Object.assign({}, state, {
                isFetching: false,
                data: action.data,

            });
        }
        case DATA_FAILURE: {
            return Object.assign({}, state, {
                isFetching: false,
                errorMessage: action.message,
            });
        }
        default:
            return state;
    }
}
