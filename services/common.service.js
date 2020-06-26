// This promice-reflect use to map rejects in Promice.all
const promiseHandler =  function(promise) {
  return promise
      .then(data => {
        return {data: data, status: "resolved"}
      })
      .catch(error => {
        return {data: error, status: "rejected"}
      });
}

const stringToIntArray = function(string) {
  return intArray = (Array.from(string.split(','))).map((i) => Number(i));
}

const stringToIntArrayBulk = function(dataArray, stringName) {

  for (let i = 0; i < dataArray.length; i++) {
    const element = dataArray[i];
    let tempArray = (Array.from(element[stringName].split(','))).map((i) => Number(i));
    element[stringName] = tempArray;
  }

  return dataArray;
}

module.exports = {
  promiseHandler,
  stringToIntArray,
  stringToIntArrayBulk
}