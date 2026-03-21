import express, { Request, Response } from "express";
import db from "../../../db.js";
import { UserTodos, Todo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
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
      const userTodos = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(id) as UserTodos;
      if (userTodos) {
        const items = JSON.parse(userTodos.items.toString());
        const todo = items.find((element: Todo) => element.id === todoId);
        if (todo) {
          todo.title = data.title;
          todo.description = data.description;
          todo.status = data.status;
          todo.dueDate = data.dueDate;
          todo.updatedAt = data.updatedAt;
          db.prepare("UPDATE todos SET items = :items WHERE id = :id").run({
            items: JSON.stringify(items),
            id: id,
          });
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
