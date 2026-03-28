import express, { Request, Response } from "express";
import db from "../../../db.js";
import { Todo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const deleteTodoRouter = express.Router();

deleteTodoRouter.delete(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const { id } = req.cookies.accessToken;
    const allTodos = db.prepare("SELECT * FROM todos").all() as Todo[];
    const userTodos = allTodos.filter((element) => element.userId === id);
    const index = userTodos.findIndex((element: Todo) => element.userId === id);
    if (index === -1) {
      return res.status(404).send("Data not found");
    } else if (userTodos) {
      userTodos.splice(index, 1);
      db.prepare("DELETE FROM todos WHERE id = ?").run(id);
      return res.status(204);
    }
  },
);

export default deleteTodoRouter;
