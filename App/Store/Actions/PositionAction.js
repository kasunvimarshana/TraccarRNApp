import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    POSITION_FETCH_START,
    POSITION_FETCH_END
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
        type: POSITION_FETCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: POSITION_FETCH_END,
        payload: null
    }
};

export const fetchPosition = ( id, isCheckAuth = false ) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            dispatch( fetchStart() );
            let authUser = null;
            let promiseObj = Promise.resolve( null );
            if( isCheckAuth === true ){
                promiseObj = dispatch(checkAuth());
            }
            promiseObj.then(() => {
                return dispatch(authGetUser());
            })
            .then((user) => {
                authUser = user;
                const fetchData = {
                    method: "GET",
                    headers: { 
                        "Accept": "application/json",
                        "Cookie": ("JSESSIONID=" + authUser.JSESSIONID)
                    },
                    mode: "cors", //no-cors, *cors, same-origin
                    credentials: "omit", //include, *same-origin, omit
                    cache: "default", //*default, no-cache, reload, force-cache, only-if-cached
                    //redirect: 'follow', // manual, *follow, error
                    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    Origin: REMOTE_LOCATION_API_ORIGIN,
                };

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/positions", {
                    token:  authUser.token,
                    id: id
                });
                return fetch(api_url, fetchData);
            })
            .then((response) => {
                if( response.status !== 200 ){
                    throw new Error( response.status );
                }
                return response.json();
            })
            .then(async (json) => {
                console.log(json);
                dispatch( fetchEnd() );
                let tempPosition = null;
                if( json && Object.keys(json).length > 0 ){
                    tempPosition = json.shift();
                    return resolve( tempPosition );
                }else{
                    throw new Error( tempPosition );
                }
            })
            .catch((error) => {
                dispatch( fetchEnd() );
                return reject( error );
            });
        });

        return promise;
    };
};