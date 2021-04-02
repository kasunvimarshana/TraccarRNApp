import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    AUTH_SET_USER,
    AUTH_FETCH_START,
    AUTH_FETCH_END
} from './ActionType';
import { 
    REMOTE_LOCATION_API_ORIGIN,
    REMOTE_LOCATION_API_URI 
} from '../../Constants/AppConstants';
import { 
    objectToQueryString, 
    buildURLWithQueryString, 
    clearCookies,
    getCookie 
} from '../../Helpers/HTTPHelper';
import { Base64 } from '../../Helpers/Base64Helper';

const APP_KEY_ASYNC_STORAGE_USER = "APP_KEY_ASYNC_STORAGE_USER"; //@ap:auth:user

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
        const fetchData = {
            method: "POST",
            body: objectToQueryString({
                email: args.email,
                password: args.password
            }),
            headers: { 
                "Accept": "application/json",
                //"Content-Type": "application/json",
                "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
                "Authorization": "Basic " + Base64.btoa(args.email + ":" + args.password) 
            },
            mode: "cors", //no-cors, *cors, same-origin
            credentials: "include", //include, *same-origin, omit
            cache: "default", //*default, no-cache, reload, force-cache, only-if-cached
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            Origin: REMOTE_LOCATION_API_ORIGIN,
        };

        const promise = new Promise((resolve, reject) => {
            dispatch( fetchStart() );
            clearCookies()
            .then( () => {
                return fetch(REMOTE_LOCATION_API_URI + "/session", fetchData)
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
                return reject( error )
            });
        });

        return promise;
    };
};



// export const authSignOut = () => {
//     return (dispatch, getState) => {
//         const promise = new Promise((resolve, reject) => { 
//             let authUser = null;
//             dispatch(checkAuth())
//             .then(() => {
//                 return dispatch(authGetUser());
//             })
//             .then((user) => {
//                 authUser = user;
//                 const fetchData = {
//                     method: "DELETE",
//                     headers: { 
//                         "Accept": "*/*",
//                         "Cookie": ("JSESSIONID=" + authUser.JSESSIONID)
//                     },
//                     mode: "cors", //no-cors, *cors, same-origin
//                     credentials: "omit", //include, *same-origin, omit
//                     cache: "default", //*default, no-cache, reload, force-cache, only-if-cached
//                     //redirect: 'follow', // manual, *follow, error
//                     //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//                     Origin: REMOTE_LOCATION_API_ORIGIN,
//                 };

//                 const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/session", {
//                     token:  authUser.token
//                 });
//                 return fetch(api_url, fetchData);
//             })
//             .then(async (response) => {
//                 if( response.status !== 204 ){
//                     throw new Error( response.status );
//                 }
//                 await dispatch( authRemoveUser() );
//                 await dispatch( authSetUser( null ) );
//                 return resolve( response.status );
//             })
//             .catch((error) => reject( error ));
//         });

//         return promise;
//     };
// };


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
            let authUser = null;
            dispatch(authGetUser())
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

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/session", {
                    token:  authUser.token
                });
                return fetch(api_url, fetchData);
            })
            .then((response) => {
                if( response.status !== 200 ){
                    throw new Error( response.status );
                }
                return response.json();
            })
            .then((json) => {
                console.log(json);
                return resolve(json);
            })
            .catch((error) => reject( error ));
        });
        return promise;
    };
};