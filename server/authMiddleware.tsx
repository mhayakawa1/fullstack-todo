import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();
const secret = process.env.CLIENT_SECRET;

interface UserPayload extends JwtPayload {
  id: string | number;
  isGoogleAccount: boolean;
}

async function checkAuthorization(
  req: Request & { user?: object },
  res: Response,
  next: NextFunction,
) {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(403).send({ message: "Invalid access token." });
  }
  const { id, token, isGoogleAccount } = req.cookies.accessToken;
  try {
    if (token && secret) {
      if (isGoogleAccount) {
        const tokenInfo = await client.getTokenInfo(token);
        if (tokenInfo) {
          // eslint-disable-next-line
          const { expiry_date } = tokenInfo;
          // eslint-disable-next-line
          const user = { id: id, iat: "", exp: expiry_date };
          req.user = user;
        }
      } else {
        const user = jwt.verify(token, secret) as UserPayload;
        req.user = user;
      }
      next();
    }
  } catch {
    return res.status(403).send("User not verified.");
  }
}

export default checkAuthorization;
