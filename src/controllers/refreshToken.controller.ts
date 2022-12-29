import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "~/models";

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
    (err: any, decoded: any) => {
      if (!decoded || typeof decoded === "string") return;
      if (err || foundUser.username !== decoded.username || !foundUser.roles)
        return res.sendStatus(403);

      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        { UserInfo: { username: decoded.username, roles } },
        process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  );
};

export { handleRefreshToken };
