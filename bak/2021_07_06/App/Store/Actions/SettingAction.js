import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_SETTING
} from './ActionType';

export const getSetting = ( key ) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            let setting = getState().setting[key];
            console.log("setting from State : ", setting);
            if( (setting) ){
                return resolve( setting );
            }else{
                AsyncStorage.getItem( key )
                .then((settingFromStorage) => {
                    setting = settingFromStorage;
                    console.log("setting from AsyncStorage : ", setting);
                    //if( (setting) ){
                        dispatch( setSetting( {
                            key: key,
                            value: setting
                        } ) );
                        return resolve( setting );
                    //}else{
                    //    throw new Error("getSetting");
                    //}
                })
                .catch((error) => reject( error ))
            }
        });
        return promise;
    };
};

export const setSetting = ( setting ) => {
    return {
        type: SET_SETTING,
        key: setting.key,
        value: setting.value
    }
};

export const storeSetting = ( setting ) => {
    return async (dispatch, getState) => {
        const tempSetting = String( setting.value );
        await AsyncStorage.setItem(setting.key, tempSetting);
    };
};

export const removeSetting = ( key ) => {
    return async (dispatch, getState) => {
        await AsyncStorage.removeItem( key );
    };
};

export const saveSetting = ( setting ) => {
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
                await dispatch( setSetting( setting ) );
                await dispatch( storeSetting( setting ) );
                return resolve( setting );
            }catch( error ){
                reject( error );
            }
        });

        return promise;
    };
};

export const deleteSetting = ( key ) => {
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
                await dispatch( removeSetting( key ) );
                await dispatch( setSetting( {
                    key: key,
                    value: null
                } ) );
                return resolve( null );
            }catch( error ){
                reject( error );
            }
        });

        return promise;
    };
};