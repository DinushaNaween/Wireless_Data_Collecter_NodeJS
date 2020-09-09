// require('dotenv').config();
// require('./config/global.config');

const express = require('express');
const bodyParser = require('body-parser');
// const logger = require('./middlewares/logger.middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS'){ 
      res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE')
      return res.status(200).json({});
  }
  next();
});

app.use(
  cors({
    origin: `http://localhost:${PORT}`,
    credentials: true
  })
)

app.get('/', (req, res) => {
  console.log('Welcome to Data Collector...');
  res.json({ message: 'Welcome to Data Collector...' });
});

// require('./routes/role.routes')(app); 
// require('./routes/privilege.routes')(app);
// require('./routes/rolePrivilege.routes')(app);
// require('./routes/user.routes')(app);
// require('./routes/collection.routes')(app);
// require('./routes/unit.routes')(app);
// require('./routes/parentNode.routes')(app);
// require('./routes/node.routes')(app);
// require('./routes/sensor.routes')(app);
// require('./routes/dataTable.routes')(app);
// require('./routes/table.routes')(app);
// require('./routes/data.routes')(app);
// require('./routes/dataValidation.routes')(app);
// require('./routes/dataAck.routes')(app);

module.exports = app;