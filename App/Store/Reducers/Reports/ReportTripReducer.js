import { 
    SET_REPORT_REPORT_TRIP_LIST,
    REPORT_REPORT_TRIP_FETCH_START,
    REPORT_REPORT_TRIP_FETCH_END
} from '../../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'reportTripList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case REPORT_REPORT_TRIP_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case REPORT_REPORT_TRIP_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_REPORT_REPORT_TRIP_LIST: 
            return {
                ...state,
                reportTripList: action.reportTripList
            };
            break;
        default: 
            return state;
    }
};

export default reducer;