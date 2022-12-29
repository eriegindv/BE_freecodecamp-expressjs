import { Request, Response } from "express";
import path from "path";

const getRoot = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
};

export { getRoot };
