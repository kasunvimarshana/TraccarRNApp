import { 
    SET_SETTING
} from '../Actions/ActionType';

const initialState = { }

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case SET_SETTING: 
            return  {
                ...state,
                [action.key]: action.value
            };
            break;
        default: 
            return state;
    }
};

export default reducer;