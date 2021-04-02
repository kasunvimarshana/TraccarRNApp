import { 
    createStore, 
    combineReducers,
    compose, 
    applyMiddleware, 
} from 'redux';
import thunk from 'redux-thunk';

import UIReducer from '../Reducers/UIReducer';
import AuthReducer from '../Reducers/AuthReducer';
import DeviceReducer from '../Reducers/DeviceReducer';
import GroupReducer from '../Reducers/GroupReducer';
import UserReducer from '../Reducers/UserReducer';
import GeofenceReducer from '../Reducers/GeofenceReducer';
//Reports
import ReportReducer from '../Reducers/Reports/ReportReducer';
import PositionReducer from '../Reducers/Reports/PositionReducer';
import ReportSummaryReducer from '../Reducers/Reports/ReportSummaryReducer';

const rootReducer = combineReducers({
    ui: UIReducer,
    auth: AuthReducer,
    device: DeviceReducer,
    group: GroupReducer,
    user: UserReducer,
    geofence: GeofenceReducer,

    report: ReportReducer,
    position: PositionReducer,
    reportSummary: ReportSummaryReducer
});

let composeEnhancers = compose;

if( __DEV__ ){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;