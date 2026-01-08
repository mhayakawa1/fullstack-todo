import express, { Request, Response } from "express";
import { todos } from "../data/todosData";
import checkAuthorization from "../../authMiddleware";
const deleteTodoRouter = express.Router();

deleteTodoRouter.delete(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((element) => element.id === id);
    if (index === -1) {
      return res.status(404).send("Data not found");
    } else {
      todos.splice(index, 1);
      return res.status(204);
    }
  }
);

export default deleteTodoRouter;