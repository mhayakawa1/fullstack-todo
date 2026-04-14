import express, { Request, Response } from "express";
import db from "../../../db.js";
import { Todo, createTodo } from "../../../db.js";
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
    const allTodos = db.prepare("SELECT * FROM todos").all() as Todo[];
    const userTodos = allTodos.filter((element) => element.userId === id);
    if (userTodos) {
      db.prepare(
        "INSERT INTO todos (id, userId, title, description, status, dueDate, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)",
      ).run(
        data.id,
        id,
        data.title,
        data.description,
        data.status,
        data.dueDate,
        data.createdAt,
        data.updatedAt,
      );
      res.status(201).json({ todo: newTodo });
    }
  } else {
    res.status(400).send("Invalid data");
  }
});

export default addTodoRouter;
