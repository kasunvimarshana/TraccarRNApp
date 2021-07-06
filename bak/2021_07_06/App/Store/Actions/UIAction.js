import { 
    UI_START_PROCESS, 
    UI_STOP_PROCESS 
} from './ActionType';

export const startProcessing = () => {
    return {
        type: UI_START_PROCESS
    }
};

export const stopProcessing = () => {
    return {
        type: UI_STOP_PROCESS
    }
};