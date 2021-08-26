import { isEmpty, getParameterCaseInsensitive } from "./CommonHelper";

/*
var numbers = [4, 2, 5, 1, 3];
numbers.sort(function(a, b) {
    return a - b;
});
*/

//Json Object Comparer Function (ascending)
export const GetSortOrder_JSON_ASC = (prop) => {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}    

//Json Object Comparer Function (descending)
export const GetSortOrder_JSON_DESC = (prop) => {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return -1;    
        } else if (a[prop] < b[prop]) {    
            return 1;    
        }    
        return 0;    
    }    
} 

export const chunk = (arr, size) => {
    arr.reduce((acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc), [])
}

export const nest = (itemsArray, id = null, link = 'parent_id') => {
    return itemsArray.filter((item) => {
        // return item[link] === id;
        return Number( getParameterCaseInsensitive(item, link) ) === Number( id );
    }).map((item) => {
        let children = nest(itemsArray, item.id, link);
        let _temp = { ...item, children: children };
        return _temp;
    });
}

export const get_JSON_Min = (itemsArray, link = 'parent_id') => {
    // console.log("itemsArray", itemsArray);
    // let initialValue = (!isEmpty( itemsArray )) ? Number(itemsArray[0][link]) : 0;
    let initialValue = (!isEmpty( itemsArray )) ? Number(getParameterCaseInsensitive(itemsArray[0], link)) : 0;
    return itemsArray.reduce((accumulator, currentValue, currentIndex, array) => {
        // Number.isNaN( accumulator )
        // let temp_currentValue = Number( currentValue[link] );
        let temp_currentValue = Number(getParameterCaseInsensitive(currentValue, link));
        let temp_accumulator = Number( accumulator );
        // Math.min(temp_currentValue, temp_accumulator);
        return ( temp_currentValue < temp_accumulator ) ? temp_currentValue : temp_accumulator;
    }, initialValue);
}

export const get_JSON_Max = (itemsArray, link = 'parent_id') => {
    // console.log("itemsArray", itemsArray);
    // let initialValue = (!isEmpty( itemsArray )) ? Number(itemsArray[0][link]) : 0;
    let initialValue = (!isEmpty( itemsArray )) ? Number(getParameterCaseInsensitive(itemsArray[0], link)) : 0;
    return itemsArray.reduce((accumulator, currentValue, currentIndex, array) => {
        // Number.isNaN( accumulator )
        // let temp_currentValue = Number( currentValue[link] );
        let temp_currentValue = Number(getParameterCaseInsensitive(currentValue, link));
        let temp_accumulator = Number( accumulator );
        // Math.min(temp_currentValue, temp_accumulator);
        return ( temp_currentValue < temp_accumulator ) ? temp_accumulator : temp_currentValue;
    }, initialValue);
}

export const unique = (value, index, selfArray) => {
    // let _unique = [...new Set(selfArray)];
    return selfArray.indexOf(value) === index;
}