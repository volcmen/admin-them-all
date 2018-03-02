import { combineReducers } from 'redux';
import auth from './auth';
import alerts from './alerts';
import navigation from './navigation';
import dataMD from './getDataFromMongo';
import sites from './sites';

export default combineReducers({
    auth,
    alerts,
    navigation,
    dataMD,
    sites,
});
