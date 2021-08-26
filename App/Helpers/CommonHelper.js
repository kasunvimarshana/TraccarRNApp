// isEmpty
export const isEmpty = ( value ) => {    
    return (
        // (!value) ||
        // undefined
        (typeof(value) === 'undefined') ||
        // null
        (value === null) ||
        // has length and it's zero
        (value.hasOwnProperty('length') && value.length === 0) ||
        // is an Object and has no keys
        (value.constructor === Object && Object.keys(value).length === 0)
    )
};

// getParameterCaseInsensitive from Object
export const getParameterCaseInsensitive = (object, key) => {
    let tempVal = object[
        Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())
    ];
    // console.log("tempVal", tempVal);
    return tempVal;
}