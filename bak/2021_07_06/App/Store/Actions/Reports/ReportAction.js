import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_REPORT_FROM_DATE_TIME,
    SET_REPORT_TO_DATE_TIME
} from '../ActionType';

export const setFromDateTime = ( fromDateTime ) => {
    return {
        type: SET_REPORT_FROM_DATE_TIME,
        fromDateTime: fromDateTime
    }
};

export const setToDateTime = ( toDateTime ) => {
    return {
        type: SET_REPORT_TO_DATE_TIME,
        toDateTime: toDateTime
    }
};