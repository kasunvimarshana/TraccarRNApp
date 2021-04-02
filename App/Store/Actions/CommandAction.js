import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import { 
    COMMAND_DISPATCH_START,
    COMMAND_DISPATCH_END
} from './ActionType';
import { 
    REMOTE_LOCATION_API_ORIGIN,
    REMOTE_LOCATION_API_URI
} from '../../Constants/AppConstants';
import { 
    objectToQueryString, 
    buildURLWithQueryString
} from '../../Helpers/HTTPHelper';
import { 
    authGetUser, 
    checkAuth
} from './AuthAction';

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

export const commandSend = (type, attributes = null) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            dispatch( fetchStart() );
            let authUser = null;
            const device = getState().device.selectedDevice || {};
            dispatch(checkAuth())
            .then(() => {
                return dispatch(authGetUser());
            })
            .then((user) => {
                authUser = user;
                let queryParameters = {
                    token:  authUser.token
                };

                const fetchData = {
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
                    Origin: REMOTE_LOCATION_API_ORIGIN,
                };

                Object.assign(fetchData, {
                    body: JSON.stringify({
                        deviceId: device.id,
                        type: type,
                        attributes: attributes,
                        description: null
                    }),
                });

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/commands/send", queryParameters);
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