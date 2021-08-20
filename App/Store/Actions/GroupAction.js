import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_GROUP_LIST,
    SET_SELECTED_GROUP,
    GROUP_FETCH_START,
    GROUP_FETCH_END
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
        type: GROUP_FETCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: GROUP_FETCH_END,
        payload: null
    }
};

export const fetchGroups = (isCheckAuth = false) => {
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

                const api_url = buildURLWithQueryString(remote_location_api_uri + "/groups", {
                    token:  authUser.token,
                    userId: authUser.id,
                    all:  (authUser.administrator) ? true : false
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
                await dispatch( setGroupList( json ) );
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

export const setGroupList = ( groupList ) => {
    return {
        type: SET_GROUP_LIST,
        deviceList: groupList
    }
};

export const selectGroup = ( id ) => {
    return (dispatch, getState) => {
        let selectedGroup = null;
        const groupList = getState().group.groupList;
        if( (Array.isArray( groupList )) ){
            /*selectedGroup = groupList.filter((item) => { 
                return item.id === id; 
            });*/
            selectedGroup = groupList.find(function(item) {
                return item.id === id;
            });
        }
        dispatch(setSelectedGroup(selectedGroup));
    }
}

export const setSelectedGroup = ( selectedGroup ) => {
    return {
        type: SET_SELECTED_GROUP,
        selectedGroup: selectedGroup
    }
};