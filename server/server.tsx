import { Request, Response } from "express";
import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "node:path";
import bcrypt from "bcryptjs";
import checkAuthorization from "./authMiddleware";
const secret = process.env.CLIENT_SECRET;
const app = express();
const port = 8080;

const allowedOrigins = [
  "http://localhost:3000",
  "https://fullstack-todo-kappa.vercel.app/",
];

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
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

const router = express.Router();
router.use(checkAuthorization);

function createTodo(
  id: number | string,
  userId: string,
  title: string,
  description: string,
  status: string,
  dueDate: string,
  createdAt: string,
  updatedAt: string,
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
    "complete",
    "2025-11-18T00:05:56.330Z",
    "2025-11-18T00:05:56.330Z",
    "2025-11-18T00:05:56.330Z",
  ),
  createTodo(
    2,
    "userId1",
    "Make Dinner",
    "Pasta, salad, tea",
    "incomplete",
    "2025-11-22T01:43:16.000Z",
    "2025-11-22T01:45:00.889Z",
    "2025-11-22T01:45:00.889Z",
  ),
  createTodo(
    3,
    "userId1",
    "Chores",
    "Laundry, dishes",
    "incomplete",
    "2025-11-24T00:46:52.757Z",
    "2025-11-24T00:55:10.616Z",
    "2025-11-24T00:55:10.616Z",
  ),
];

function sort(value: string) {
  let newTodos = [...todos];
  if (value === "complete") {
    newTodos = [...todos.filter((todo) => todo.status === "complete")];
  } else if (value === "incomplete") {
    newTodos = [...todos.filter((todo) => !(todo.status === "complete"))];
  } else if (value.includes("created")) {
    newTodos = [...todos.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))];
  } else if (value.includes("due")) {
    newTodos = [...todos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))];
  }
  if (value.includes("descending")) {
    newTodos.reverse();
  }
  return newTodos;
}

app.get("/api/todos", checkAuthorization, (req: Request, res: Response) => {
  res.status(200).json(todos);
});

const sortValues = [
  "complete",
  "incomplete",
  "date-created-ascending",
  "date-created-descending",
  "due-date-ascending",
  "due-date-descending",
];

function sortedRoutes() {
  const routes = [];
  for (let i = 0; i < sortValues.length; i++) {
    routes.push(
      app.get(`/api/todos/${sortValues[i]}`, (req: Request, res: Response) => {
        res.status(200).json(sort(sortValues[i]));
      }),
    );
  }
  return routes;
}
sortedRoutes();

app.get("/api/todos/:id", checkAuthorization, (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.find((element) => element.id == id);
  if (todo) {
    res.status(200).json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.post("/api/todos", checkAuthorization, (req: Request, res: Response) => {
  app.use(express.json());
  const data = req.body;
  if (
    data.id &&
    data.userId &&
    data.title &&
    data.description &&
    data.status &&
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
      data.updatedAt,
    );
    todos.unshift(newTodo);
    res.status(201).json(newTodo);
  } else {
    res.status(400).send("Invalid data");
  }
});

app.patch(
  "/api/todos/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    app.use(express.json());
    const id = JSON.parse(JSON.stringify(req.params)).id;
    const data = req.body;
    if (
      data.id &&
      data.userId &&
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
  },
);

app.delete(
  "/api/todos/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((element) => element.id === id);
    if (index === -1) {
      return res.status(404).send("Data not found");
    }
    todos.splice(index, 1);
    res.status(204).send("Data deleted successfully");
  },
);

function createUser(
  id: number | string,
  userId: string,
  name: string,
  password: string,
  email: string,
  picture: string,
) {
  return {
    id: id,
    userId: userId,
    name: name,
    password: password,
    email: email,
    picture: picture,
  };
}

interface User {
  id: number | string;
  userId: string;
  name: string;
  password: string;
  email: string;
  picture: string;
}

const users: User[] = [];

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = createUser(
    "4",
    "userId",
    name,
    hashedPassword,
    email,
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
  );
  users.push(newUser);
  res.status(201).json({ message: "User registered." });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((element) => element.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  } else if (secret) {
    const { name } = user;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ name }, secret, { expiresIn: "1h" });
    res.json({ token: token });
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/*path", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
