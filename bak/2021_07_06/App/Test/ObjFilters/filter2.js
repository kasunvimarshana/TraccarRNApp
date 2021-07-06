/**
 * const arr1 = [
  { id: "abdc4051", date: "2017-01-24" }, 
  { id: "abdc4052", date: "2017-01-22" },
  { id: "abdc4053", date: "2017-01-22" }
];
const arr2 = [
  { nameId: "abdc4051", name: "ab" },
  { nameId: "abdc4052", name: "abc" }
];
 */

const map = new Map();
arr1.forEach(item => map.set(item.id, item));
arr2.forEach(item => map.set(item.nameId, {...map.get(item.nameId), ...item}));
const mergedArr = Array.from(map.values());