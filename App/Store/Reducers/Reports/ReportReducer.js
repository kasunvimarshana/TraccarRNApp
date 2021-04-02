import { 
    SET_REPORT_FROM_DATE_TIME,
    SET_REPORT_TO_DATE_TIME
} from '../../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'fromDateTime': null,
    'toDateTime': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case SET_REPORT_FROM_DATE_TIME: 
            return {
                ...state,
                fromDateTime: action.fromDateTime
            };
            break;
        case SET_REPORT_TO_DATE_TIME: 
            return {
                ...state,
                toDateTime: action.toDateTime
            };
            break;
        default: 
            return state;
    }
};

export default reducer;