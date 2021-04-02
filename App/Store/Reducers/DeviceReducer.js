import { 
    SET_DEVICE_LIST,
    SET_SELECTED_DEVICE,
    DEVICE_FETCH_START,
    DEVICE_FETCH_END,
    SET_SELECTED_DEVICE_POSITION
} from '../Actions/ActionType';

const initialState = {
    'isFetching': false,
    'selectedDevice': null,
    'deviceList': null,
    'devicePosition': null
}

const reducer = (state = initialState, action) => {
    switch( action.type ){
        case DEVICE_FETCH_START: 
            return  {
                ...state,
                isFetching: true
            };
            break;
        case DEVICE_FETCH_END: 
            return  {
                ...state,
                isFetching: false
            };
            break;
        case SET_DEVICE_LIST: 
            return {
                ...state,
                deviceList: action.deviceList
            };
            break;
        case SET_SELECTED_DEVICE: 
            return {
                ...state,
                selectedDevice: action.selectedDevice
            };
            break;
        case SET_SELECTED_DEVICE_POSITION:
            return {
                ...state,
                devicePosition: action.devicePosition
            }
            break;
        default: 
            return state;
    }
};

export default reducer;