import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const deleteTodoRouter = express.Router();

deleteTodoRouter.delete(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const { id } = req.cookies.accessToken;
    const todoId = JSON.parse(JSON.stringify(req.params)).id;
    const index = todos.findIndex((element) => element.userId === id);
    const newTodos = todos.find((element) => element.userId === id);

    if (index === -1) {
      return res.status(404).send("Data not found");
    } else if (newTodos) {
      const todoIndex = todos[index].items.findIndex(
        (todo) => todo.id === todoId,
      );
      todos[index].items.splice(todoIndex, 1);
      return res.status(204);
    }
  },
);

export default deleteTodoRouter;
