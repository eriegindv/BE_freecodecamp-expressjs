import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

const fsPromises = fs.promises;

const logEvents = async (message: string, logName: string) => {
  const dateTime = new Date();
  const logItem = `${dateTime}\t${"uuid"}\t${message}\n`;

  try {
    const logsLocation = path.join(__dirname, "..", "..", "logs");

    if (!fs.existsSync(logsLocation)) {
      await fsPromises.mkdir(logsLocation);
    }

    await fsPromises.appendFile(path.join(logsLocation, logName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: Request, _: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

export { logger, logEvents };
