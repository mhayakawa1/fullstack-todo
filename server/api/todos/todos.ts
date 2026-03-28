import express, { Request, Response } from "express";
import db from "../../../db.js";
import { Todo, paginate } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const todosRouter = express.Router();

todosRouter.get("/", checkAuthorization, (req: Request, res: Response) => {
  if (!req.cookies.accessToken) {
    return res.status(401).json({ message: "Access denied." });
  }
  const query = JSON.parse(JSON.stringify(req.query));
  const { status, sortBy, sortOrder, page, search } = query;
  const { id } = req.cookies.accessToken;
  const allTodos = db.prepare("SELECT * FROM todos").all() as Todo[];
  const userTodos = allTodos.filter((element) => element.userId === id);

  if (userTodos.length) {
    let newTodos = [...userTodos];
    if (search) {
      newTodos = newTodos.filter((todo) =>
        `${todo.title} ${todo.description}`.toLowerCase().includes(search),
      );
    }
    if (status === "in_progress") {
      newTodos = [...newTodos.filter((todo) => todo.status === "in_progress")];
    } else if (status === "done") {
      newTodos = [...newTodos.filter((todo) => todo.status === "done")];
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
    const length = newTodos.length;
    if (length) {
      const paginatedTodos = paginate(newTodos, length);
      newTodos = [...paginatedTodos[page - 1]];
    }
    return res.status(200).json({
      items: newTodos,
      page: Number(page),
      limit: 10,
      total: length,
    });
  }
});

export default todosRouter;
