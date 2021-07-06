import { RESET_STORE } from './ActionType';

export const resetStore = () => {
    return {
        type: RESET_STORE,
        payload: null
    }
};