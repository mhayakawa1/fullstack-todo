import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
const secret = process.env.CLIENT_SECRET;

function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token && secret) {
    const verified = jwt.verify(token.split(" ")[1], secret);
    if (verified) {
      next();
    } else {
      res.status(400).json({ invalidToken: true });
    }
  }
}

export default checkAuthorization;
