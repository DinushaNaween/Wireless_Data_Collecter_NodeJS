// const express = require('express');
// const app = express();
// const Logger = require('../middlewares/logger');
// const bodyParser = require('body-parser');
// const logger = new Logger('test');

// app.use(bodyParser.urlencoded({
//   extended: false
// }))

// app.use(bodyParser.json())

// app.post('/test', (req, res) => {

//   // console.log(req.headers);

//   const body = req.body
//   let error = {}
//   // Adding body of the request as log data
//   logger.setReqData(req);
//   logger.info("Request recieved at /test", req.body)
//   // We are expecting name,age and gender in the body of the request

//   if (body.name == null || body.name == "") {
//     logger.error("Name field is empty", body)
//     error["name"] = "name field is empty"
//   }

//   if (body.age == null || body.age == "") {
//     logger.error("Age field is empty")
//     error["age"] = "age field is empty"
//   }

//   if (body.gender == null || body.gender == "") {
//     logger.error("Gender field is empty", body)
//     error["gender"] = "gender field is empty"
//   }

//   if (Object.keys(error).length != 0) {
//     logger.error("Retun error response", {
//       "sucess": false
//     })
//     res.send("Error")
//   } else {
//     logger.info("Retun sucess response", {
//       "sucess": true
//     })
//     res.send("No Error")
//   }
// })

// app.post('/test_2', (req, res) => {

//   const body = req.body
//   let error = {}
//   // Adding body of the request as log data
//   logger.setReqData(req)
//   logger.info("Request recieved at /test", req.body)
//   // We are expecting name,age and gender in the body of the request

//   if (body.name == null || body.name == "") {
//     logger.error("Name field is empty")
//     error["name"] = "name field is empty"
//   }

//   if (body.age == null || body.age == "") {
//     logger.error("Age field is empty")
//     error["age"] = "age field is empty"
//   }

//   if (body.gender == null || body.gender == "") { 
//     logger.error("Gender field is empty")
//     error["gender"] = "gender field is empty"
//   }

//   if (Object.keys(error).length != 0) {
//     logger.error("Retun error response", {
//       "sucess": false
//     })
//     res.send("Error")
//   } else {
//     logger.info("Retun sucess response", {
//       "sucess": true
//     })
//     res.send("No Error")
//   }
// })

// app.listen(4000, () => {
//   logger.info("APP LAUNCHED IN PORT 4000")
// })