let arr1 = [
    { id: "abdc4051", date: "2017-01-24" },
    { id: "abdc4052", date: "2017-01-22" }
];

let arr2 = [
    { id: "abdc4051", name: "ab" },
    { id: "abdc4052", name: "abc" }
];

const mergeById = (a1, a2) =>
    a1.map(itm => ({
        ...a2.find((item) => (item.id === itm.id) && item),
        ...itm
    }));

console.log(mergeById(arr1, arr2));