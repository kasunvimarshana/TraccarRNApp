import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import { 
    SET_REPORT_REPORT_SUMMARY_LIST,
    REPORT_REPORT_SUMMARY_FETCH_START,
    REPORT_REPORT_SUMMARY_FETCH_END
} from '../ActionType';
import { 
    REMOTE_LOCATION_API_ORIGIN,
    REMOTE_LOCATION_API_URI, 
    REPORT_OBJECT_TYPE_DEVICE, 
    REPORT_OBJECT_TYPE_GROUP, 
    DATE_TIME_DEFAULT_FORMAT 
} from '../../../Constants/AppConstants';
import { 
    objectToQueryString, 
    buildURLWithQueryString
} from '../../../Helpers/HTTPHelper';
import { 
    authGetUser, 
    checkAuth
} from '../AuthAction';

export const fetchStart = () => {
    return {
        type: REPORT_REPORT_SUMMARY_FETCH_START,
        payload: null
    }
};

export const fetchEnd = () => {
    return {
        type: REPORT_REPORT_SUMMARY_FETCH_END,
        payload: null
    }
};

export const FETCH_TYPE_DEVICE = REPORT_OBJECT_TYPE_DEVICE;
export const FETCH_TYPE_GROUP = REPORT_OBJECT_TYPE_GROUP;

export const fetchSummary = (fetchType, from = null, to = null, isCheckAuth = false) => {
    return (dispatch, getState) => {
        const currentDateTime = moment();
        let fromDateTime = from || getState().report.fromDateTime;
        let toDateTime = to || getState().report.toDateTime;
        fromDateTime = moment(fromDateTime, [ DATE_TIME_DEFAULT_FORMAT ], true);
        toDateTime = moment(toDateTime, [ DATE_TIME_DEFAULT_FORMAT ], true);
        fromDateTime = (fromDateTime.isValid()) ? fromDateTime : currentDateTime.clone().startOf('date');
        toDateTime = (toDateTime.isValid()) ? toDateTime : currentDateTime.clone().endOf('date');
        fromDateTime = fromDateTime.toISOString( false );
        toDateTime = toDateTime.toISOString( false );

        const promise = new Promise((resolve, reject) => { 
            dispatch( fetchStart() );
            let authUser = null;
            let fetchTypeObject = null;
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
                    token:  authUser.token,
                    from: fromDateTime,
                    to: toDateTime
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

                const api_url = buildURLWithQueryString(REMOTE_LOCATION_API_URI + "/reports/summary", queryParameters);
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
                await dispatch( setReportSummaryList( json ) );
                dispatch( fetchEnd() );
                return resolve( json );
            })
            .catch((error) => {
                dispatch( fetchEnd() );
                return reject( error )
            });
        });

        return promise;
    };
};

export const setReportSummaryList = ( reportSummaryList ) => {
    return {
        type: SET_REPORT_REPORT_SUMMARY_LIST,
        reportSummaryList: reportSummaryList
    }
};