import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const todosRouter = express.Router();

todosRouter.get("/", checkAuthorization, (req: Request, res: Response) => {
  const query = JSON.parse(JSON.stringify(req.query));
  const { status, sortBy, sortOrder } = query;
  const { id } = req.cookies.accessToken;
  const userTodos = todos.find((element) => element.userId === id);

  if (userTodos) {
    let newTodos = [...userTodos.items];
    if (status === "incomplete") {
      newTodos = [...newTodos.filter((todo) => todo.status === "incomplete")];
    } else if (status === "complete") {
      newTodos = [...newTodos.filter((todo) => todo.status === "complete")];
    }
    if (sortBy === "createdAt") {
      newTodos = [
        ...newTodos.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)),
      ];
    } else if (sortBy === "dueDate") {
      newTodos = [...newTodos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))];
    }
    if (sortOrder === "desc") {
      newTodos.reverse();
    }
    return res
      .status(200)
      .json({ items: newTodos, page: 1, limit: 5, total: newTodos.length });
  } else {
    todos.push({
      userId: id,
      items: [],
    });
  }
});

export default todosRouter;
