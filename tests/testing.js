// A simple promise that resolves after a given time
const timeOut = (t) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (t === 2000) {
        reject(`Rejected in ${t}`)
      } else {
        resolve(`Completed in ${t}`)
      }
    }, t)
  })
}

const durations = [1000, 2000, 3000]

const promises = []

durations.map((duration) => {
  promises.push(timeOut(duration)) 
})

// We are passing an array of pending promises to Promise.all
Promise.all(promises)
.then(response => console.log(response)) // Promise.all cannot be resolved, as one of the promises passed got rejected.
.catch(error => console.log(`Error in executing ${error}`)) // Promise.all throws an error.