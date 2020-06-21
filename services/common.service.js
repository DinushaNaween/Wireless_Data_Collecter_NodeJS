// This promice-reflect use to map rejects in Promice.all
const promise_handler =  function(promise) {
  return promise
      .then(data => {
        return {data: data, status: "resolved"}
      })
      .catch(error => {
        return {data: error, status: "rejected"}
      });
}

module.exports = {
  promise_handler
}