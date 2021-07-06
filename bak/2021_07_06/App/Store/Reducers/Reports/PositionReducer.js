import { 
    SET_REPORT_POSITION_LIST,
    REPORT_POSITION_FETCH_START,
    REPORT_POSITION_FETCH_END
} from '../../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'positionList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case REPORT_POSITION_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case REPORT_POSITION_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_REPORT_POSITION_LIST: 
            return {
                ...state,
                positionList: action.positionList
            };
            break;
        default: 
            return state;
    }
};

export default reducer;