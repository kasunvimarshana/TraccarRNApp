import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_USER_LIST,
    SET_SELECTED_USER,
    USER_FETCH_START,
    USER_FETCH_END
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
        type: USER_FETCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: USER_FETCH_END,
        payload: null
    }
};

export const fetchUsers = (isCheckAuth = false) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            dispatch( fetchStart() );
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
                fetchData = {
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
                    Origin: remote_location_api_origin,
                };

                const api_url = buildURLWithQueryString(remote_location_api_uri + "/users", {
                    token:  authUser.token,
                    userId: authUser.id,
                    all:  (authUser.administrator) ? true : false
                });
                console.log("api_url", api_url);
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
                await dispatch( setUserList( json ) );
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

export const setUserList = ( userList ) => {
    return {
        type: SET_USER_LIST,
        deviceList: userList
    }
};

export const selectUser = ( id ) => {
    return (dispatch, getState) => {
        let selectedUser = null;
        const userList = getState().user.userList;
        if( (Array.isArray( userList )) ){
            /*selectedUser = userList.filter((item) => { 
                return item.id === id; 
            });*/
            selectedUser = userList.find(function(item) {
                return item.id === id;
            });
        }
        dispatch(setSelectedUser(selectedUser));
    }
}

export const setSelectedUser = ( selectedUser ) => {
    return {
        type: SET_SELECTED_USER,
        selectedDevice: selectedUser
    }
};