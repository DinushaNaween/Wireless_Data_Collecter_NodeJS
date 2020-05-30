const { createLogger, format, transports } = require('winston');

timeStamp = () => {
  return new Date(Date.now()).toUTCString();
}

const logger = createLogger({
  transports: [
    new transports.File({
      filename: `./logs/log.log`,
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 5
    }),
    new transports.Console()
  ],
  format: format.combine(
    format.splat(),
    format.simple()
  )
});

exports.reqLog = (req, endPoint) => {

  let reqData = JSON.parse(`{
    "ip": "${req.connection.remoteAddress}",
    "host": "${req.headers.host}",
    "path": "${req.originalUrl}",
    "method": "${req.method}"
  }`);

  let message = ` | ${timeStamp()} | ${endPoint} |` 

  logger.info(message, {reqData: reqData});
}

exports.info = (msg) => {

  let message = ` | ${timeStamp()} | ${msg} |`
  logger.info(message);
}

exports.info = (msg, obj) => {

  let message = ` | ${timeStamp()} | ${msg} |`
  logger.info(message, {data: obj});
}

exports.error = (msg) => {

  let message = `| ${timeStamp()} | ${msg} |`
  logger.error(message);
}

exports.error = (msg, obj) => {

  let message = `| ${timeStamp()} | ${msg} |`
  logger.error(message, {data: obj});
}