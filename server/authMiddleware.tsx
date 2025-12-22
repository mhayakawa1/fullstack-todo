import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
const secret = process.env.CLIENT_SECRET;

interface UserPayload extends JwtPayload {
  id: string | number;
}

function checkAuthorization(
  req: Request & { user?: object },
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.accessToken;
  const errorResult = () => {
    return res.status(403).send("User not verified.");
  };
  if (!token) {
    errorResult();
  }
  if (token && secret) {
    try {
      const user = jwt.verify(token, secret) as UserPayload;
      req.user = user;
      next();
    } catch {
      errorResult();
    }
  }
}

export default checkAuthorization;
