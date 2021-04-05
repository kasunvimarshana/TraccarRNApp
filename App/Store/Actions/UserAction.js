import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_USER_LIST,
    SET_SELECTED_USER,
    USER_FETCH_START,
    USER_FETCH_END
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

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/users", {
                    token:  authUser.token,
                    userId: authUser.id,
                    all:  true
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