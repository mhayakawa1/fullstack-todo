import express, { Request, Response } from "express";
import db from "../../../db.js";
import { Todo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const todoRouter = express.Router();

todoRouter.get("/:id", checkAuthorization, (req: Request, res: Response) => {
  const { id } = req.cookies.accessToken;
  const allTodos = db.prepare("SELECT * FROM todos").all() as Todo[];
  const userTodos = allTodos.filter((element) => element.userId === id);
  const notFound = () => {
    return res.status(404).send({ message: "Todo not found." });
  };
  if (userTodos) {
    const todoId = req.params.id;
    const todo = userTodos.find((element: Todo) => element.id == todoId);
    if (todo) {
      res.status(200).json(todo);
    } else {
      notFound();
    }
  } else {
    notFound();
  }
});

export default todoRouter;
