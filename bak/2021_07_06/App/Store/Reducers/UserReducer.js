import { 
    SET_USER_LIST,
    SET_SELECTED_USER,
    USER_FETCH_START,
    USER_FETCH_END
} from '../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'selectedUser': null,
    'userList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case USER_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case USER_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_USER_LIST: 
            return {
                ...state,
                userList: action.userList
            };
            break;
        case SET_SELECTED_USER: 
            return {
                ...state,
                selectedUser: action.selectedUser
            };
            break;
        default: 
            return state;
    }
};

export default reducer;