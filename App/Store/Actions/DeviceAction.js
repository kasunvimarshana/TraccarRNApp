import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_DEVICE_LIST,
    SET_SELECTED_DEVICE,
    DEVICE_FETCH_START,
    DEVICE_FETCH_END,
    SET_SELECTED_DEVICE_POSITION,
    DEVICE_POSITION_FETCH_START,
    DEVICE_POSITION_FETCH_END,
    DEVICE_UPDATE_START,
    DEVICE_UPDATE_END
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
import { fetchPosition } from './PositionAction';
import { getSetting, saveSetting, deleteSetting } from './SettingAction';

export const fetchStart = () => {
    return {
        type: DEVICE_FETCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: DEVICE_FETCH_END,
        payload: null
    }
};

export const fetchDevices = (isCheckAuth = false) => {
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

                const api_url = buildURLWithQueryString(remote_location_api_uri + "/devices", {
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
                await dispatch( setDeviceList( json ) );
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

export const setDeviceList = ( deviceList ) => {
    return {
        type: SET_DEVICE_LIST,
        deviceList: deviceList
    }
};

export const selectDevice = ( id ) => {
    return (dispatch, getState) => {
        let selectedDevice = null;
        const deviceList = getState().device.deviceList;
        if( (Array.isArray( deviceList )) ){
            /*selectedDevice = deviceList.filter((item) => { 
                return item.id === id; 
            });*/
            selectedDevice = deviceList.find(function(item) {
                return item.id === id;
            });
        }
        dispatch(setSelectedDevice(selectedDevice));
    }
}

export const setSelectedDevice = ( selectedDevice ) => {
    return {
        type: SET_SELECTED_DEVICE,
        selectedDevice: selectedDevice
    }
};

export const devicePositionFetchStart = () => {
    return {
        type: DEVICE_POSITION_FETCH_START,
        payload: null
    }
};

export const devicePositionFetchEnd = () => {
    return {
        type: DEVICE_POSITION_FETCH_END,
        payload: null
    }
};

export const setSelectedDevicePosition = ( position ) => {
    return {
        type: SET_SELECTED_DEVICE_POSITION,
        devicePosition: position
    }
};

export const fetchSelectedDevicePosition = (isCheckAuth = false) => {
    return (dispatch, getState) => {
        //const currentDateTime = moment();
        const promise = new Promise((resolve, reject) => { 
            dispatch( devicePositionFetchStart() );
            let remote_location_api_origin = null;
            let remote_location_api_uri = null;
            let fetchData = {};
            let authUser = null;
            let selectedDevice = null;
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

                selectedDevice = getState().device.selectedDevice || {};
                Object.assign(queryParameters, {
                    id: selectedDevice.id,
                    uniqueId: selectedDevice.uniqueId
                });

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

                const api_url = buildURLWithQueryString(remote_location_api_uri + "/devices", queryParameters);
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
                if( json && Object.keys(json).length > 0 ){
                    let tempDevice = json.shift();
                    console.log("tempDevice", tempDevice);
                    return dispatch( fetchPosition( tempDevice.positionId ) );
                }else{
                    throw new Error( json );
                }
            })
            .then(async (json) => {
                console.log(json);
                await dispatch( setSelectedDevicePosition( json ) );
                dispatch( devicePositionFetchEnd() );
                return resolve( json );
            })
            .catch((error) => {
                dispatch( devicePositionFetchEnd() );
                return reject( error )
            }); 
        });

        return promise;
    };
};

export const deviceUpdateStart = () => {
    return {
        type: DEVICE_UPDATE_START,
        payload: null
    }
};

export const deviceUpdateEnd = () => {
    return {
        type: DEVICE_UPDATE_END,
        payload: null
    }
};

export const updateSelectedDevice = (attributes = {}, extraPathString = null, isCheckAuth = false) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            dispatch( deviceUpdateStart() );
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
                    method: "PUT",
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

                let tempRequestBody = {
                    deviceId: device.id
                };
                Object.assign(tempRequestBody, attributes);

                Object.assign(fetchData, {
                    body: JSON.stringify( tempRequestBody ),
                });
                let temp_url = (remote_location_api_uri + "/devices/" + (device.id));
                if( extraPathString !== null ){
                    temp_url = (( temp_url ) + "/" + extraPathString);
                }
                const api_url = buildURLWithQueryString(temp_url, queryParameters);
                return fetch(api_url, fetchData);
            })
            .then((response) => {
                if( response.status === 200 ){
                    return response.json();
                }else if( response.status === 204 ){
                    return {response: response}
                }else if( response.status !== 200 && response.status !== 204 ){
                    throw new Error( response.status );
                }
            })
            .then(async (json) => {
                console.log(json);
                dispatch( deviceUpdateEnd() );
                return resolve( json );
            })
            .catch((error) => {
                dispatch( deviceUpdateEnd() );
                return reject( error );
            });
        });

        return promise;
    };
};