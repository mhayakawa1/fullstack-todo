import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const todoRouter = express.Router();

todoRouter.get("/:id", checkAuthorization, (req: Request, res: Response) => {
  const { id } = req.cookies.accessToken;
  const userTodos = todos.find((element) => element.userId == id);
  const notFound = () => {
    return res.status(404).send({ message: "Todo not found." });
  };
  if (userTodos) {
    const todoId = req.params.id;
    const todo = userTodos.items.find((element) => element.id == todoId);
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
