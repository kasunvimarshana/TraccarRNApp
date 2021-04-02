import { 
    SET_GROUP_LIST,
    SET_SELECTED_GROUP,
    GROUP_FETCH_START,
    GROUP_FETCH_END
} from '../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'selectedGroup': null,
    'groupList': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case GROUP_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case GROUP_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_GROUP_LIST: 
            return {
                ...state,
                groupList: action.deviceList
            };
            break;
        case SET_SELECTED_GROUP: 
            return {
                ...state,
                selectedGroup: action.selectedGroup
            };
            break;
        default: 
            return state;
    }
};

export default reducer;