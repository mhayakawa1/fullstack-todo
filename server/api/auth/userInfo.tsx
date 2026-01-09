import express, { Request, Response } from "express";
import users from "../data/users";
const userInfoRouter = express.Router();
import checkAuthorization from "../../authMiddleware";

userInfoRouter.get(
  "/userInfo",
  checkAuthorization,
  (req: Request & { user?: object & { id?: string } }, res: Response) => {
    const { user } = req;
    if (user) {
      const { id } = user;
      const userInfo = users.find((element) => element.id == id);
      if (userInfo) {
        res.status(200).json(userInfo);
      }
    } else {
      res.status(404).send("User not found");
    }
  },
);

export default userInfoRouter;
