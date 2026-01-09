import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const todoRouter = express.Router();

todoRouter.get("/:id", checkAuthorization, (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.find((element) => element.id == id);
  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

export default todoRouter;
