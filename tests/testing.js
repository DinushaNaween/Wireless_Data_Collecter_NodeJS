var array1 = ["cat", "sum","fun", "run", "hut"];
var array2 = ["bat", "cat","dog","sun", "hut", "gut"];

const missedNodes = [...new Set(array1.filter(element => !array2.includes(element)))];
console.log(missedNodes);