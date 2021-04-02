import { 
    UI_START_PROCESS, 
    UI_STOP_PROCESS
} from '../Actions/ActionType';

const initialState = {
    'isProcessing': false
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case UI_START_PROCESS: 
            return {
                ...state,
                isProcessing: true
            };
            break;
        case UI_STOP_PROCESS: 
            return {
                ...state,
                isProcessing: false
            };
            break;
        default: 
            return state;
    }
};

export default reducer;