import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    AUTH_SET_USER,
    AUTH_FETCH_START,
    AUTH_FETCH_END
} from './ActionType';
import { 
    KEY_ASYNC_STORAGE_USER,
    KEY_REMOTE_LOCATION_API_ORIGIN 
} from '../../Constants/AppConstants';
import { 
    objectToQueryString, 
    buildURLWithQueryString, 
    clearCookies,
    getCookie 
} from '../../Helpers/HTTPHelper';
import { Base64 } from '../../Helpers/Base64Helper';
import { getSetting, saveSetting, deleteSetting } from './SettingAction';

const APP_KEY_ASYNC_STORAGE_USER = KEY_ASYNC_STORAGE_USER;

export const fetchStart = () => {
    return {
        type: AUTH_FETCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: AUTH_FETCH_END,
        payload: null
    }
};

export const authSignIn = ( args ) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => {
            dispatch( fetchStart() );
            let remote_location_api_origin = null;
            let remote_location_api_uri = null;
            let fetchData = {};
            dispatch( getSetting( KEY_REMOTE_LOCATION_API_ORIGIN ) )
            .then( ( _remote_location_api_origin ) => {
                remote_location_api_origin = _remote_location_api_origin;
                remote_location_api_uri = `${remote_location_api_origin}/api`;

                fetchData = {
                    method: "POST",
                    body: objectToQueryString({
                        email: args.email,
                        password: args.password
                    }),
                    headers: { 
                        "Accept": "application/json",
                        //"Content-Type": "application/json",
                        "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
                        "Authorization": "Basic " + Base64.btoa(args.email + ":" + args.password), 
                        "Connection": "close" 
                    },
                    mode: "cors", //no-cors, *cors, same-origin
                    credentials: "include", //include, *same-origin, omit
                    cache: "default", //*default, no-cache, reload, force-cache, only-if-cached
                    //redirect: 'follow', // manual, *follow, error
                    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    Origin: remote_location_api_origin,
                };
            }, (error) => {
                console.log('error', error);
                throw new Error( error );
            } )
            .then( () => {
                return clearCookies()
            } )
            .then( () => {
                return fetch(remote_location_api_uri + "/session", fetchData)
            } )
            .then(async (response) => {
                if( response.status !== 200 ){
                    throw new Error( response.status );
                }
                const JSESSIONID = getCookie(response.headers.get("Set-Cookie"), "JSESSIONID");
                let responseData = await response.json();
                return Object.assign(responseData, {
                    JSESSIONID: JSESSIONID
                });
            },
            (error) => {
                console.log('error', error);
                throw new Error( error );
            })
            .then(async (json) => {
                console.log(json);
                await dispatch( authStoreUser( json ) );
                await dispatch( authSetUser( json ) );
                dispatch( fetchEnd() );
                return resolve(json);
            })
            .catch((error) => {
                dispatch( fetchEnd() );
                return reject( error );
            });
        });

        return promise;
    };
};

export const authSignOut = () => {
    return (dispatch, getState) => {
        const promise = new Promise(async (resolve, reject) => { 
            try{
                await dispatch( authRemoveUser() );
                await dispatch( authSetUser( null ) );
                return resolve( null );
            }catch( error ){
                reject( error );
            }
        });

        return promise;
    };
};

export const authGetUser = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            let user = getState().auth.user;
            console.log("user from State : ", user);
            if( (user) ){
                return resolve( user );
            }else{
                AsyncStorage.getItem( APP_KEY_ASYNC_STORAGE_USER )
                .then((authUserFromStorage) => {
                    user = (authUserFromStorage !== null) ? JSON.parse( authUserFromStorage ) : null;
                    console.log("user from AsyncStorage : ", user);
                    if( (user) ){
                        dispatch( authSetUser( user ) );
                        return resolve( user );
                    }else{
                        throw new Error("authGetUser");
                    }
                })
                .catch((error) => reject( error ))
            }
        });

        return promise;
    };
};

export const authSetUser = ( user ) => {
    return {
        type: AUTH_SET_USER,
        user: user
    }
};

export const authStoreUser = ( user ) => {
    return async (dispatch, getState) => {
        const tempUser = JSON.stringify( user );
        await AsyncStorage.setItem(APP_KEY_ASYNC_STORAGE_USER, tempUser);
    };
};

export const authRemoveUser = () => {
    return async (dispatch, getState) => {
        await AsyncStorage.removeItem(APP_KEY_ASYNC_STORAGE_USER);
    };
};

export const authAutoSignIn = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { });
        return promise;
    };
};

export const checkAuth = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => {
            let remote_location_api_origin = null;
            let remote_location_api_uri = null;
            let fetchData = {};
            let authUser = null;
            dispatch( getSetting( KEY_REMOTE_LOCATION_API_ORIGIN ) )
            .then( ( _remote_location_api_origin ) => {
                remote_location_api_origin = _remote_location_api_origin;
                remote_location_api_uri = `${remote_location_api_origin}/api`;
            }, (error) => {
                console.log('error', error);
                throw new Error( error );
            } )
            .then(() => {
                return dispatch(authGetUser())
            })
            .then((user) => {
                authUser = user;
                fetchData = {
                    method: "GET",
                    headers: { 
                        "Accept": "application/json",
                        "Cookie": ("JSESSIONID=" + authUser.JSESSIONID), 
                        "Connection": "close" 
                    },
                    mode: "cors", //no-cors, *cors, same-origin
                    credentials: "omit", //include, *same-origin, omit
                    cache: "default", //*default, no-cache, reload, force-cache, only-if-cached
                    //redirect: 'follow', // manual, *follow, error
                    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    Origin: remote_location_api_origin,
                };

                const api_url = buildURLWithQueryString(remote_location_api_uri + "/session", {
                    token:  authUser.token
                });
                return fetch(api_url, fetchData);
            })
            .then((response) => {
                if( response.status !== 200 ){
                    throw new Error( response.status );
                }
                return response.json();
            },
            (error) => {
                console.log('error', error);
                throw new Error( error );
            })
            .then((json) => {
                console.log(json);
                return resolve(json);
            })
            .catch((error) => {
                return reject( error );
            });
        });

        return promise;
    };
};