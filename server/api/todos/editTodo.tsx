import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const editTodoRouter = express.Router();

editTodoRouter.patch(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    editTodoRouter.use(express.json());
    const id = JSON.parse(JSON.stringify(req.params)).id;
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
      const todo = todos.find((element) => element.id == id);
      if (todo) {
        todo.id = data.id;
        todo.title = data.title;
        todo.description = data.description;
        todo.status = data.status;
        todo.dueDate = data.dueDate;
        todo.createdAt = data.createdAt;
        todo.updatedAt = data.updatedAt;
        res.status(200).json(todo);
      } else {
        res.status(404).send("Todo not found");
      }
    } else {
      res.status(400).send("Invalid data");
    }
  },
);

export default editTodoRouter;
