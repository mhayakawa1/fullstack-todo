import express, { Request, Response } from "express";
const logoutRouter = express.Router();

logoutRouter.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.send(204);
});

export default logoutRouter;
