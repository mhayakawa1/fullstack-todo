import express, { Request, Response } from "express";
import db from "../../../db.js";
import { UserTodos, Todo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const deleteTodoRouter = express.Router();

deleteTodoRouter.delete(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const { id } = req.cookies.accessToken;
    const userTodos = db
      .prepare("SELECT * FROM todos WHERE id = ?")
      .get(id) as UserTodos;
    const items = JSON.parse(userTodos.items.toString());
    const index = items.findIndex((element: Todo) => element.userId === id);
    if (index === -1) {
      return res.status(404).send("Data not found");
    } else if (items) {
      items.splice(index, 1);
      db.prepare("UPDATE todos SET items = :items WHERE id = :id").run({
        items: JSON.stringify(items),
        id: id,
      });
      return res.status(204);
    }
  },
);

export default deleteTodoRouter;
