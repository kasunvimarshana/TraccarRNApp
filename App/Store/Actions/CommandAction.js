import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import { 
    COMMAND_DISPATCH_START,
    COMMAND_DISPATCH_END
} from './ActionType';
import { 
    KEY_REMOTE_LOCATION_API_ORIGIN 
} from '../../Constants/AppConstants';
import { 
    objectToQueryString, 
    buildURLWithQueryString
} from '../../Helpers/HTTPHelper';
import { 
    authGetUser, 
    checkAuth
} from './AuthAction';
import { getSetting, saveSetting, deleteSetting } from './SettingAction';

export const fetchStart = () => {
    return {
        type: COMMAND_DISPATCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: COMMAND_DISPATCH_END,
        payload: null
    }
};

export const commandSend = (type, attributes = null, isCheckAuth = false) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            dispatch( fetchStart() );
            let remote_location_api_origin = null;
            let remote_location_api_uri = null;
            let fetchData = {};
            let authUser = null;
            const device = getState().device.selectedDevice || {};
            dispatch( getSetting( KEY_REMOTE_LOCATION_API_ORIGIN ) )
            .then( ( _remote_location_api_origin ) => {
                remote_location_api_origin = _remote_location_api_origin;
                remote_location_api_uri = `${remote_location_api_origin}/api`;
            }, (error) => {
                console.log('error', error);
                throw new Error( error );
            } )
            .then( () => {
                if( isCheckAuth === true ){
                    return dispatch(checkAuth());
                }else{
                    return Promise.resolve( null );
                }
            } )
            .then( () => {
                return dispatch(authGetUser());
            } )
            .then((user) => {
                authUser = user;
                let queryParameters = {
                    token:  authUser.token
                };

                fetchData = {
                    method: "POST",
                    headers: { 
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Cookie": ("JSESSIONID=" + authUser.JSESSIONID)
                    },
                    mode: "cors", //no-cors, *cors, same-origin
                    credentials: "omit", //include, *same-origin, omit
                    cache: "default", //*default, no-cache, reload, force-cache, only-if-cached
                    //redirect: 'follow', // manual, *follow, error
                    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    Origin: remote_location_api_origin,
                };

                Object.assign(fetchData, {
                    body: JSON.stringify({
                        deviceId: device.id,
                        type: type,
                        attributes: attributes,
                        description: null
                    }),
                });

                const api_url = buildURLWithQueryString(remote_location_api_uri + "/commands/send", queryParameters);
                console.log("api_url", api_url);
                return fetch(api_url, fetchData);
            })
            .then((response) => {
                if( response.status !== 200 && response.status !== 202 ){
                    throw new Error( response.status );
                }
                return response.json();
            })
            .then(async (json) => {
                console.log(json);
                dispatch( fetchEnd() );
                return resolve( json );
            })
            .catch((error) => {
                dispatch( fetchEnd() );
                return reject( error );
            }); 
        });

        return promise;
    };
};