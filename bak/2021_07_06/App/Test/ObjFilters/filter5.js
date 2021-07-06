var newArray = array1.map(x=>Object.assign(x, array2.find(y=>y.id==x.id)));

////////////////////////////////////////////////////////////////////////////////

const result = arr1.map(item => {
    const obj = arr2.find(o => o.id === item.id);
    return { ...item, ...obj };
  });

console.log(result);

////////////////////////////////////////////////////////////////////////////////

arr1.map(item => ({
    ...item,
    ...arr2.find(({ id }) => id === item.id),
}));

////////////////////////////////////////////////////////////////////////////////

const map = new Map();
arr1.forEach(item => map.set(item.id, item));
arr2.forEach(item => map.set(item.nameId, {...map.get(item.nameId), ...item}));
const mergedArr = Array.from(map.values());

////////////////////////////////////////////////////////////////////////////////

const obj1 = {
    value1: 45,
    value2: 33,
    value3: 41,
    value4: 4,
    value5: 65,
    value6: 5,
    value7: 15,
 };
 const obj2 = {
    value1: 34,
    value3: 71,
    value5: 17,
    value7: 1,
    value9: 9,
    value11: 11,
 };
 const mergeObjects = (obj1, obj2) => {
    for(key in obj1){
       if(obj2[key]){
          obj1[key] += obj2[key];
       };
    };
    return;
 };
 mergeObjects(obj1, obj2);
 console.log(obj1);

 ////////////////////////////////////////////////////////////////////////////////

 function mergeArrayObjects(arr1,arr2){
    return arr1.map((item,i)=>{
       if(item.id === arr2[i].id){
           //merging two objects
         return Object.assign({},item,arr2[i])
       }
    })
  }
  
  console.log(mergeArrayObjects(arr1,arr2));
  
  /* output
       [
        {id: 1, name: "sai", age: 23},
        {id: 2, name: "King", age: 24}
       ]
  */

////////////////////////////////////////////////////////////////////////////////

// {name: string, genre: string}[]
const bands = [
    {
      name: 'Ratm',
      genre: 'rock'
    },
    {
      name: 'Bruno',
      genre: 'Pop'
    }
  ];
  
  // {ratm: string, bruno: string}
  const artists = bands.reduce(
    (obj, item) => {
      obj[item.name] = item.genre;
      return obj;
    },
    {});
  
  console.log(artists);
  
  // {Ratm: "rock", Bruno: "Pop"}