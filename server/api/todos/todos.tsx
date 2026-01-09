import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const todosRouter = express.Router();

todosRouter.get("/", checkAuthorization, (req: Request, res: Response) => {
  const query = JSON.parse(JSON.stringify(req.query));
  const { sortBy } = query;
  let newTodos = [...todos];
  if (sortBy.includes("created")) {
    newTodos = [...todos.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))];
  } else if (sortBy.includes("due")) {
    newTodos = [...todos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))];
  } else if (sortBy === "incomplete") {
    newTodos = [...newTodos.filter((todo) => todo.status === "incomplete")];
  } else if (sortBy === "complete") {
    newTodos = [...newTodos.filter((todo) => todo.status === "complete")];
  }
  if (sortBy.includes("descending")) {
    newTodos.reverse();
  }
  return res.status(200).json(newTodos);
});

export default todosRouter;
