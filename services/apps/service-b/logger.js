const pino = require("pino");
const fs = require("fs");
const path = require("path");

const logDir = "/app/logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, "service-b.log");

const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(logFile)
);

module.exports = logger;
