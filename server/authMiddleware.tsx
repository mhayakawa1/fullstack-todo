import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
const secret = "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";

function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token) {
    const verified = jwt.verify(token.split(" ")[1], secret);
    if (verified) {
      next();
    } else {
      res.status(400).json({ invalidToken: true });
    }
  }
}

export default checkAuthorization;
