import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
    SET_REPORT_EVENT_LIST
} from '../ActionType';
import { 
    REMOTE_LOCATION_API_ORIGIN,
    REMOTE_LOCATION_API_URI, 
    REPORT_OBJECT_TYPE_DEVICE, 
    REPORT_OBJECT_TYPE_GROUP 
} from '../../../Constants/AppConstants';
import { 
    objectToQueryString, 
    buildURLWithQueryString
} from '../../../Helpers/HTTPHelper';
import { 
    authGetUser, 
    checkAuth
} from '../AuthAction';

export const FETCH_TYPE_DEVICE = REPORT_OBJECT_TYPE_DEVICE;
export const FETCH_TYPE_GROUP = REPORT_OBJECT_TYPE_GROUP;

export const fetchEvents = (fetchType, from, to, type = null) => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => { 
            let authUser = null;
            let fetchTypeObject = null;
            dispatch(checkAuth())
            .then(() => {
                return dispatch(authGetUser());
            })
            .then((user) => {
                authUser = user;
                let queryParameters = {
                    token:  authUser.token,
                    from: from,
                    to: to
                };

                switch( fetchType ){
                    case FETCH_TYPE_DEVICE:
                        fetchTypeObject = getState().device.selectedDevice || {};
                        Object.assign(queryParameters, {
                            deviceId: fetchTypeObject.id
                        });
                        break;
                    case FETCH_TYPE_GROUP:
                        fetchTypeObject = getState().group.selectedGroup || {};
                        Object.assign(queryParameters, {
                            groupId: fetchTypeObject.id
                        });
                        break;
                    default:
                        throw new Error( "fetchType" + fetchType );
                }

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

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/reports/events", queryParameters);
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
                resolve( json );
            })
            .catch((error) => reject( error ));
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