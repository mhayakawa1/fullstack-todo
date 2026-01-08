import express, { Request, Response } from "express";
import { todos, createTodo } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const addTodoRouter = express.Router();

addTodoRouter.post(
  "/",
  checkAuthorization,
  (req: Request, res: Response) => {
    addTodoRouter.use(express.json());
    const data = req.body;
    if (
      data.id &&
      data.userId &&
      data.title &&
      data.description &&
      data.status &&
      data.dueDate &&
      data.createdAt &&
      data.updatedAt
    ) {
      const newTodo = createTodo(
        data.id,
        data.userId,
        data.title,
        data.description,
        data.status,
        data.dueDate,
        data.createdAt,
        data.updatedAt
      );
      todos.unshift(newTodo);
      res.status(201).json(newTodo);
    } else {
      res.status(400).send("Invalid data");
    }
  }
);

export default addTodoRouter;