import { NextFunction, Request, Response } from "express";
import { logEvents } from "./logEvents";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  res.status(500).send(err.message);
  next(err);
};

export { errorHandler };
