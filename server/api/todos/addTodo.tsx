import express, { Request, Response } from "express";
import { todos, createTodo, paginate } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
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
    const index = todos.findIndex((element) => element.userId === id);
    todos[index].items.unshift(newTodo);
    const { length } = todos[index].items;
    const paginatedTodos = paginate(todos[index].items, length);
    res
      .status(201)
      .json({ items: paginatedTodos[0], page: 1, limit: 2, total: length });
  } else {
    res.status(400).send("Invalid data");
  }
});

export default addTodoRouter;
