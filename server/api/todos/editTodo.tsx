import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const editTodoRouter = express.Router();

editTodoRouter.patch(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    editTodoRouter.use(express.json());
    const { id } = req.cookies.accessToken;
    const todoId = JSON.parse(JSON.stringify(req.params)).id;
    const data = req.body;
    if (
      data.id &&
      data.title &&
      data.description &&
      data.status &&
      data.dueDate &&
      data.createdAt &&
      data.updatedAt
    ) {
      const userTodos = todos.find((element) => element.userId == id);
      if (userTodos) {
        const todo = userTodos.items.find((element) => element.id === todoId);
        if (todo) {
          todo.title = data.title;
          todo.description = data.description;
          todo.status = data.status;
          todo.dueDate = data.dueDate;
          todo.updatedAt = data.updatedAt;
          res.status(200).json(todo);
        }
      } else {
        res.status(404).send("Todo not found");
      }
    } else {
      res.status(400).send("Invalid data");
    }
  },
);

export default editTodoRouter;
