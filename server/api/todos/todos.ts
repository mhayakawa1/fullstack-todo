import express, { Request, Response } from "express";
import db from "../../../db.js";
import checkAuthorization from "../../authMiddleware.js";
const todosRouter = express.Router();

todosRouter.get("/", checkAuthorization, (req: Request, res: Response) => {
  if (!req.cookies.accessToken) {
    return res.status(401).json({ message: "Access denied." });
  }

  const query = JSON.parse(JSON.stringify(req.query));
  if (!Object.keys(query).length) {
    return res.status(401).json({ message: "No query." });
  } else {
    const { status, sortBy, sortOrder, page, search } = query;
    const { id } = req.cookies.accessToken;
    const params = [id];
    let sql = "SELECT * FROM todos WHERE userId = ?";

    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      sql += " AND title LIKE ? OR description LIKE ?";
    }
    if (status) {
      params.push(status);
      sql += " AND status = ?";
    }

    const allTodosStatement = db.prepare(sql);
    const length = allTodosStatement.all(...params).length;

    const pageSize = 2;
    const offset = pageSize * (page - 1);
    sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()} LIMIT ${pageSize} OFFSET ${offset}`;

    const paginatedStatement = db.prepare(sql);
    const userTodos = paginatedStatement.all(...params);

    return res.status(200).json({
      items: userTodos,
      page: Number(page),
      limit: pageSize,
      total: length,
    });
  }
});

export default todosRouter;
