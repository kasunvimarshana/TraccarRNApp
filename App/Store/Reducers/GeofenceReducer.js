import { 
    SET_GEOFENCE_LIST,
    GEOFENCE_FETCH_START,
    GEOFENCE_FETCH_END
} from '../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'geofenceList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case GEOFENCE_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case GEOFENCE_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_GEOFENCE_LIST: 
            return {
                ...state,
                geofenceList: action.geofenceList
            };
            break;
        default: 
            return state;
    }
};

export default reducer;