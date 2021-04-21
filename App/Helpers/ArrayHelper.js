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
    return itemsArray
    .filter((item) => item[link] === id)
    .map((item) => ({ ...item, children: nest(itemsArray, item.id) }));
}