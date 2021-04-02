import moment from 'moment';

// http://gps.globemw.net:8082, http://sss1.globemw.net:8082

export const REMOTE_LOCATION_API_ORIGIN = "http://sss1.globemw.net:8082";
export const REMOTE_LOCATION_API_URI = `${REMOTE_LOCATION_API_ORIGIN}/api`;
export const LOGO_IMAGE = require('../Assets/images/icon.png');
export const DATE_TIME_DEFAULT_FORMAT = moment.ISO_8601;

// Report Object Type
export const REPORT_OBJECT_TYPE_DEVICE = "REPORT_OBJECT_TYPE_DEVICE";
export const REPORT_OBJECT_TYPE_GROUP = "REPORT_OBJECT_TYPE_GROUP";