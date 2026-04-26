import express, { Request, Response } from "express";
import db from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const deleteTodoRouter = express.Router();

deleteTodoRouter.delete(
  "/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const { id } = req.params;
    const statement = db.prepare("DELETE FROM todos WHERE id = ?");
    const info = statement.run(id);
    if (info.changes) {
      return res.status(204).send("Item deleted");
    } else {
      return res.status(404).send("Data not found");
    }
  },
);

export default deleteTodoRouter;
