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
import { fetchPosition } from './PositionAction';

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

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/devices", {
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
            let authUser = null;
            let selectedDevice = null;
            let promiseObj = Promise.resolve( null );
            if( isCheckAuth === true ){
                promiseObj = dispatch(checkAuth());
            }
            promiseObj.then(() => {
                return dispatch(authGetUser());
            })
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

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/devices", queryParameters);
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
            let authUser = null;
            const device = getState().device.selectedDevice || {};
            let promiseObj = Promise.resolve( null );
            if( isCheckAuth === true ){
                promiseObj = dispatch(checkAuth());
            }
            promiseObj.then(() => {
                return dispatch(authGetUser());
            })
            .then((user) => {
                authUser = user;
                let queryParameters = {
                    token:  authUser.token
                };

                const fetchData = {
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
                    Origin: REMOTE_LOCATION_API_ORIGIN,
                };

                let tempRequestBody = {
                    deviceId: device.id
                };
                Object.assign(tempRequestBody, attributes);

                Object.assign(fetchData, {
                    body: JSON.stringify( tempRequestBody ),
                });
                let temp_url = (REMOTE_LOCATION_API_URI + "/devices/" + (device.id));
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