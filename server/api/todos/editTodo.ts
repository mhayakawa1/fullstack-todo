import express, { Request, Response } from "express";
import db from "../../../db.js";
import { Todo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const editTodoRouter = express.Router();

editTodoRouter.patch(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    editTodoRouter.use(express.json());
    const { id } = req.params;
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
      const statement = db.prepare("SELECT * FROM todos WHERE id = ?");
      const todo = statement.get(id) as unknown as Todo;
      if (todo) {
        todo.title = data.title;
        todo.description = data.description;
        todo.status = data.status;
        todo.dueDate = data.dueDate;
        todo.updatedAt = data.updatedAt;
        db.prepare(
          "UPDATE todos SET title = :title, description = :description, status = :status, dueDate = :dueDate, updatedAt = :updatedAt WHERE id = :id",
        ).run({ ...todo });
        res.status(200).json(todo);
      } else {
        res.status(404).send("Todo not found. Edit not saved.");
      }
    } else {
      res.status(400).send("Invalid data. Edit not saved.");
    }
  },
);

export default editTodoRouter;
