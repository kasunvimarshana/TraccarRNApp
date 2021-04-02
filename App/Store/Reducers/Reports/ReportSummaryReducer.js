import { 
    SET_REPORT_REPORT_SUMMARY_LIST,
    REPORT_REPORT_SUMMARY_FETCH_START,
    REPORT_REPORT_SUMMARY_FETCH_END
} from '../../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'reportSummaryList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case REPORT_REPORT_SUMMARY_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case REPORT_REPORT_SUMMARY_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_REPORT_REPORT_SUMMARY_LIST: 
            return {
                ...state,
                reportSummaryList: action.reportSummaryList
            };
            break;
        default: 
            return state;
    }
};

export default reducer;