import { 
    SET_REPORT_EVENT_LIST,
    REPORT_EVENT_FETCH_START,
    REPORT_EVENT_FETCH_END
} from '../../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'reportEventList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case REPORT_EVENT_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case REPORT_EVENT_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_REPORT_EVENT_LIST: 
            return {
                ...state,
                reportEventList: action.reportEventList
            };
            break;
        default: 
            return state;
    }
};

export default reducer;