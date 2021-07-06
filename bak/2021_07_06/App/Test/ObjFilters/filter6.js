////////////////////////////////////////////////////////////////////////////////////
let stock = [{ order: "200", type: "production", qty: 200, item: "IT282" },{ order: "200", type: "production", qty: 90, item: "IT283" },{ order: "200", type: "customer", qty: 80, item: "IT102" },{ order: "200", type: "production", qty: 110, item: "IT283" },{ order: "200", type: "customer", qty: 130, item: "IT102" },{ order: "200", type: "production", qty: 45, item: "IT233" },{ order: "200", type: "stock", qty: 30, item: "IT282" },{ order: "210", type: "production", qty: 300, item: "IT282" },{ order: "210", type: "production", qty: 190, item: "IT283" },{ order: "210", type: "customer", qty: 180, item: "IT102" },{ order: "210", type: "production", qty: 210, item: "IT283" },{ order: "210", type: "customer", qty: 230, item: "IT102" },{ order: "210", type: "production", qty: 145, item: "IT233" },{ order: "210", type: "stock", qty: 130, item: "IT282" }];

function groupBy(arr, fields) {
  let field = fields[0]               // one field at a time
  if (!field) return arr              
  let retArr = Object.values(
     arr.reduce((obj, current) => {
        if (!obj[current[field]]) obj[current[field]] = {field: field, value: current[field],rows: []}
        obj[current[field]].rows.push(current)
        return obj
     }, {}))
  
  // recurse for each child's rows if there are remaining fields
  if (fields.length){
      retArr.forEach(obj => {
          obj.count = obj.rows.length
          obj.rows = groupBy(obj.rows, fields.slice(1))
      })
  }
  return retArr
}

let result = groupBy(stock, ["order", "item"]);
console.log(result)
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
// export const chunk = (arr, size) => {
//     Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
//         arr.slice(i * size, i * size + size)
//     )
// }
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
// function groupBy( array , f ){
//     var groups = {};
//     array.forEach( function( o ){
//         var group = JSON.stringify( f(o) );
//         groups[group] = groups[group] || [];
//         groups[group].push( o );  
//     });
//     return Object.keys(groups).map( function( group ){
//         return groups[group]; 
//     })
// }

// var result = groupBy(list, function(item){
//     return [item.lastname, item.age];
// });
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
//https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

  const groupBy = key => array =>
  array.reduce(
    (objectsByKeyValue, obj) => ({
      ...objectsByKeyValue,
      [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
    }),
    {}
  );

  const cars = [
    { brand: 'Audi', color: 'black' },
    { brand: 'Audi', color: 'white' },
    { brand: 'Ferarri', color: 'red' },
    { brand: 'Ford', color: 'white' },
    { brand: 'Peugot', color: 'white' }
  ];
  
  const groupByBrand = groupBy('brand');
  const groupByColor = groupBy('color');
  
  console.log(
    JSON.stringify({
      carsByBrand: groupByBrand(cars),
      carsByColor: groupByColor(cars)
    }, null, 2)
  );
  ////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
//   reduce((accumulator, currentValue, index, array) => { ... }, initialValue)
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
//https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
// Data Set
// One top level comment 
const comments = [{
    id: 1,
    parent_id: null
}, {
    id: 2,
    parent_id: 1
}, {
    id: 3,
    parent_id: 1
}, {
    id: 4,
    parent_id: 2
}, {
    id: 5,
    parent_id: 4
}];

const nest = (items, id = null, link = 'parent_id') =>
  items
    .filter(item => item[link] === id)
    .map(item => ({ ...item, children: nest(items, item.id) }));

console.log(
  nest(comments)
)
////////////////////////////////////////////////////////////////////////////////////