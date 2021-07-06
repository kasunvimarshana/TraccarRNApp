import { NativeModules } from 'react-native';
import querystring from 'querystring';

export const ___objectToQueryString___ = ( obj ) => {
    /*
    //let requestBody = new URLSearchParams();
    let requestBody = [];

    if( obj && Object.keys(obj).length > 0 ){
        Object.entries(obj).forEach(([key, value]) => { 
            //requestBody.append(key, value);
            let encodedKey = encodeURIComponent( key );
            let encodedValue = encodeURIComponent( value );
            requestBody.push(encodedKey + "=" + encodedValue);
        });
    }

    requestBody = requestBody.join("&");

    return requestBody;
    */
    let requestBody = Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    return requestBody;
};

export const objectToQueryString = ( obj ) => {
    let requestBody = querystring.stringify( obj );
    return requestBody;
};

export const buildURLWithQueryString = ( url, obj = {} ) => {
    let tempURL = new URL( url );
    Object.keys(obj).forEach(key => tempURL.searchParams.append(key, obj[key]));
    tempURL = tempURL.toString();
    return tempURL;
};

export const clearCookies = () => {
    const Networking = NativeModules.Networking;
    const promise = new Promise((resolve, reject) => { 
        Networking.clearCookies((cleared) => {
            console.log('Cookies cleared: ' + cleared.toString());
            resolve();
        });
    });
    return promise;
};

export const setCookieParser = ( cookie ) => {
    return String( cookie )
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(String( v[0] ).trim())] = decodeURIComponent(String( v[1] ).trim());
      return acc;
    }, {});
};

export const getCookie = ( cookie, key ) => {
    const cookies = setCookieParser( cookie );
    return (cookies[key]) ? cookies[key] : null;
}