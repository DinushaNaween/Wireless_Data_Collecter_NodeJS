function groupArrayOfObjects(list, key) {
  return list.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var people = [
    {sex:"Male", name:"Jeff"},
    {sex:"Female", name:"Megan"},
    {sex:"Male", name:"Taylor"},
    {sex:"Female", name:"Madison"}
];
var groupedPeople=groupArrayOfObjects(people,"sex");

let all = [];
all.push(groupedPeople.Male);
all.push(groupedPeople.Female)

console.log(all);