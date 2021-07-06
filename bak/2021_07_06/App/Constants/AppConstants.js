import Constants from 'expo-constants';
import moment from 'moment';

// http://gps.globemw.net:8082, http://sss1.globemw.net:8082
//export const REMOTE_LOCATION_API_ORIGIN = Constants.manifest.extra.remoteLocationAPIOrigin;
//export const REMOTE_LOCATION_API_URI = `${REMOTE_LOCATION_API_ORIGIN}/api`;
export const LOGO_IMAGE = require('../Assets/images/icon.png');
export const DATE_TIME_DEFAULT_FORMAT = moment.ISO_8601;

// Report Object Type
export const REPORT_OBJECT_TYPE_DEVICE = "REPORT_OBJECT_TYPE_DEVICE";
export const REPORT_OBJECT_TYPE_GROUP = "REPORT_OBJECT_TYPE_GROUP";

// Setting Keys
export const KEY_ASYNC_STORAGE_USER = "KEY_ASYNC_STORAGE_USER"; //@ap:auth:user
export const KEY_REMOTE_LOCATION_API_ORIGIN = "REMOTE_LOCATION_API_ORIGIN";