const logger = require('./middlewares/logger.middleware');
const app = require('./app')

const PORT = process.env.SERVER_PORT;

app.listen(PORT, (err, result) => {
  if (err) {
    logger.error('error on starting server', err.message);
  } else {
    logger.info(`server started listning on port ${PORT}`);
  }
});   