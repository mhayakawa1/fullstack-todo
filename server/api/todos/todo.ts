import express, { Request, Response } from "express";
import db from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const todoRouter = express.Router();

todoRouter.get("/:id", checkAuthorization, (req: Request, res: Response) => {
  const statement = db.prepare("SELECT * FROM todos WHERE id = ?");
  const todo = statement.get(req.params.id);
  if (todo) {
    res.status(200).json(todo);
  } else {
    return res.status(404).json({ error: "Todo not found" });
  }
});

export default todoRouter;
