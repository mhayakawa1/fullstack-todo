import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import path from "node:path";
const app = express();
const port = 8080;
const allowedOrigins = [
  "http://localhost:3000",
  "https://fullstack-todo-kappa.vercel.app/",
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.listen(port, () => {
  //eslint-disable-next-line
  console.log(`Server is running on port ${port}`);
});

function createTodo(
  id: number | string,
  userId: string,
  title: string,
  description: string,
  status: boolean,
  dueDate: string,
  createdAt: string,
  updatedAt: string
) {
  return {
    id: id,
    userId: userId,
    title: title,
    description: description,
    status: status,
    dueDate: dueDate,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
}
const todos = [
  createTodo(
    1,
    "userId1",
    "Grocery Shopping",
    "Bread, eggs, milk, tomatoes, lettuce",
    true,
    "2025-11-18T00:05:56.330Z",
    "2025-11-18T00:05:56.330Z",
    "2025-11-18T00:05:56.330Z"
  ),
  createTodo(
    2,
    "userId1",
    "Make Dinner",
    "Pasta, salad, tea",
    false,
    "2025-11-22T01:43:16.000Z",
    "2025-11-22T01:45:00.889Z",
    "2025-11-22T01:45:00.889Z"
  ),
  createTodo(
    3,
    "userId1",
    "Chores",
    "Laundry, dishes",
    false,
    "2025-11-24T00:46:52.757Z",
    "2025-11-24T00:55:10.616Z",
    "2025-11-24T00:55:10.616Z"
  ),
];

app.get("/api/todos", (req: Request, res: Response) => {
  res.status(200).json(todos);
});

app.get("/api/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.find((element) => element.id == id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.post("/api/todos", (req: Request, res: Response) => {
  app.use(express.json());
  const data = req.body;
  if (
    data.id &&
    data.userId &&
    data.title &&
    data.description &&
    typeof data.status === "boolean" &&
    data.dueDate &&
    data.createdAt &&
    data.updatedAt
  ) {
    const newTodo = createTodo(
      data.id,
      data.userId,
      data.title,
      data.description,
      data.status,
      data.dueDate,
      data.createdAt,
      data.updatedAt
    );
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } else {
    res.status(400).send("Invalid data");
  }
});

app.patch("/api/todos/:id", (req: Request, res: Response) => {
  app.use(express.json());
  const id = JSON.parse(JSON.stringify(req.params)).id;
  const data = req.body;
  if (
    data.id &&
    data.userId &&
    data.title &&
    data.description &&
    typeof data.status === "boolean" &&
    data.dueDate &&
    data.createdAt &&
    data.updatedAt
  ) {
    const todo = todos.find((element) => element.id == id);
    if (todo) {
      todo.id = data.id;
      todo.userId = data.userId;
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
});

app.delete("/api/todos/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((element) => element.id === id);
  if (index === -1) {
    return res.status(404).send("Data not found");
  }
  todos.splice(index, 1);

  res.json({ message: "Data deleted successfully" });
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/*path", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
