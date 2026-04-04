import express, { Request, Response } from "express";
import db from "../../../db.js";
import { Todo } from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const deleteTodoRouter = express.Router();

deleteTodoRouter.delete(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const { id } = req.params;
    const allTodos = db.prepare("SELECT * FROM todos").all() as Todo[];
    const index = allTodos.findIndex((element: Todo) => element.id === id);
    if (index) {
      db.prepare("DELETE FROM todos WHERE id = ?").run(id);
      allTodos.splice(index, 1);
      return res.status(204);
    }
    return res.status(404).send("Data not found");
  },
);

export default deleteTodoRouter;
