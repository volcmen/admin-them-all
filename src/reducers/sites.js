import { SITES_REQUEST, SITES_SUCCESS, SITES_FAILURE, SITE_SELECT } from '../actions/sites';

export default function sites(state = {
    isFetching: false,
}, action) {
    switch (action.type) {
        case SITES_REQUEST: {
            return Object.assign({}, state, {
                isFetching: true,
            });
        }
        case SITES_SUCCESS: {
            return Object.assign({}, state, {
                isFetching: false,
                items: action.items,

            });
        }
        case SITES_FAILURE: {
            return Object.assign({}, state, {
                isFetching: false,
                errorMessage: action.message,
            });
        }
        case SITE_SELECT: {
            return Object.assign({}, state, {
                site: action.site,
            });
        }
        default:
            return state;
    }
}
