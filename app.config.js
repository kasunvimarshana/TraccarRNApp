"use strict";

//const APP_NAME = 'com.globemw.gps';
//export default {
//    name: APP_NAME,
//    version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
//    // All values in extra will be passed to your app.
//    extra: { }
//};

//import Constants from 'expo-constants';
//console.log( Constants.manifest.extra );

export default ({ config }) => {
    //console.log( config.name ); // prints 'App Name
    return {
        ...config,
    };
};