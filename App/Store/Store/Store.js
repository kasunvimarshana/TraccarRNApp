import { 
    createStore, 
    combineReducers,
    compose, 
    applyMiddleware, 
} from 'redux';
import thunk from 'redux-thunk';

import { RESET_STORE } from '../Actions/ActionType';
import UIReducer from '../Reducers/UIReducer';
import AuthReducer from '../Reducers/AuthReducer';
import DeviceReducer from '../Reducers/DeviceReducer';
import GroupReducer from '../Reducers/GroupReducer';
import UserReducer from '../Reducers/UserReducer';
import GeofenceReducer from '../Reducers/GeofenceReducer';
import SettingReducer from '../Reducers/SettingReducer';
//Reports
import ReportReducer from '../Reducers/Reports/ReportReducer';
import PositionReducer from '../Reducers/Reports/PositionReducer';
import ReportSummaryReducer from '../Reducers/Reports/ReportSummaryReducer';
import ReportTripReducer from '../Reducers/Reports/ReportTripReducer';
import EventReducer from '../Reducers/Reports/EventReducer';

var middlewares = [];
middlewares.push(thunk);

/*const rootReducer = combineReducers({
    ui: UIReducer,
    auth: AuthReducer,
    device: DeviceReducer,
    group: GroupReducer,
    user: UserReducer,
    geofence: GeofenceReducer,
    setting: SettingReducer,

    report: ReportReducer,
    position: PositionReducer,
    reportSummary: ReportSummaryReducer,
    reportTrip: ReportTripReducer,
    event: EventReducer
});*/

const appReducer = combineReducers({
    ui: UIReducer,
    auth: AuthReducer,
    device: DeviceReducer,
    group: GroupReducer,
    user: UserReducer,
    geofence: GeofenceReducer,
    setting: SettingReducer,

    report: ReportReducer,
    position: PositionReducer,
    reportSummary: ReportSummaryReducer,
    reportTrip: ReportTripReducer,
    event: EventReducer
});

const rootReducer = (state, action) => {
    if (action.type === "RESET_STORE") {
        state = undefined
    }
    return appReducer(state, action);
}

let composeEnhancers = compose;

if( __DEV__ ){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));
};

export default configureStore;