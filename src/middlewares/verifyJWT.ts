import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      if (decoded) {
        const decodedType = decoded as jwt.JwtPayload;
        req.user = decodedType.UserInfo.username;
        req.roles = decodedType.UserInfo.roles;
        next();
      }
    }
  );
};

export { verifyJWT };
