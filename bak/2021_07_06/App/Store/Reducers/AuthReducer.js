import { 
    AUTH_SET_USER,
    AUTH_FETCH_START,
    AUTH_FETCH_END
} from '../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'user': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case AUTH_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case AUTH_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case AUTH_SET_USER: 
            return {
                ...state,
                user: action.user
            };
            break;
        default: 
            return state;
    }
};

export default reducer;