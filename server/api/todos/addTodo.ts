import express, { Request, Response } from "express";
import db from "../../../db.js";
import { UserTodos, paginate, createTodo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const addTodoRouter = express.Router();

addTodoRouter.post("/", checkAuthorization, (req: Request, res: Response) => {
  addTodoRouter.use(express.json());
  const data = req.body;
  const { id } = req.cookies.accessToken;
  if (
    data.title &&
    data.description &&
    data.status &&
    data.dueDate &&
    data.createdAt &&
    data.updatedAt
  ) {
    const newTodo = createTodo(
      data.id,
      id,
      data.title,
      data.description,
      data.status,
      data.dueDate,
      data.createdAt,
      data.updatedAt,
    );
    const userTodos = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(id) as UserTodos;
    if (userTodos) {
      const items = JSON.parse(userTodos.items.toString());
      items.unshift(newTodo);
      db.prepare("UPDATE todos SET items = :items WHERE id = :id").run({
        items: JSON.stringify(items),
        id: id,
      });
      const { length } = items;
      const paginatedTodos = paginate(items, length);
      res
        .status(201)
        .json({ items: paginatedTodos[0], page: 1, limit: 2, total: length });
    }
  } else {
    res.status(400).send("Invalid data");
  }
});

export default addTodoRouter;
