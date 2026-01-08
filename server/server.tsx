import { Request, Response } from "express";
import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import path from "node:path";
import bcrypt from "bcryptjs";
import fs from "fs";
import https from "https";
import helmet from "helmet";
import checkAuthorization from "./authMiddleware";
import "dotenv/config";
const clientId = process.env.CLIENT_ID;
const secret = process.env.CLIENT_SECRET;
const app = express();
const port = 8080;

app.get("/api/data", (req, res) => {
  res.json({ message: "This is a secure API response!" });
});

const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://fullstack-todo-kappa.vercel.app/",
];

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "connect-src": ["'self'", "https://localhost:8080"],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);

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
app.use(cookieParser());

const router = express.Router();
router.use(checkAuthorization);

function createUser(
  id: string,
  name: string,
  password: string,
  email: string,
  picture: string,
  isGoogleAccount: boolean,
) {
  return {
    id: id,
    name: name,
    password: password,
    email: email,
    picture: picture,
    isGoogleAccount: isGoogleAccount,
  };
}

interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  picture: string;
  isGoogleAccount: boolean;
}

const users: User[] = [
  createUser(
    "1",
    "First Last",
    "asdfghjkl",
    "email@email.com",
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    false,
  ),
];

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

app.get("/api/todos", checkAuthorization, (req: Request, res: Response) => {
  const query = JSON.parse(JSON.stringify(req.query));
  const { sortBy } = query;
  let newTodos = [...todos];
  if (sortBy.includes("created")) {
    newTodos = [...todos.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))];
  } else if (sortBy.includes("due")) {
    newTodos = [...todos.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))];
  } else if (sortBy === "incomplete") {
    newTodos = [...newTodos.filter((todo) => todo.status === "incomplete")];
  } else if (sortBy === "complete") {
    newTodos = [...newTodos.filter((todo) => todo.status === "complete")];
  }
  if (sortBy.includes("descending")) {
    newTodos.reverse();
  }
  return res.status(200).json(newTodos);
});

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

app.delete(
  "/api/todos/:id",
  checkAuthorization,
  (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((element) => element.id === id);
    if (index === -1) {
      return res.status(404).send("Data not found");
    } else {
      todos.splice(index, 1);
      return res.status(204).json({ message: "Item deleted." });
    }
  },
);

app.get(
  "/api/userInfo",
  checkAuthorization,
  (req: Request & { user?: object & { id?: string } }, res: Response) => {
    const { user } = req;
    if (user) {
      const { id } = user;
      const userInfo = users.find((element) => element.id == id);
      if (userInfo) {
        res.status(200).json(userInfo);
      }
    } else {
      res.status(404).send("User not found");
    }
  },
);

app.post("/api/auth/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const preexistingUser = users.find((user) => user.email === email);
  if (!preexistingUser) {
    const uuid = crypto.randomUUID();
    const newUser = createUser(
      uuid,
      name,
      hashedPassword,
      email,
      "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      false,
    );
    users.push(newUser);
    res.status(201).json({ message: "User registered." });
  } else {
    res.status(404).json({ message: "Invalid email or password." });
  }
});

function findUser(email: string) {
  return users.find((element) => element.email === email);
}

function createCookie(
  res: Response,
  id: string,
  token: string,
  isGoogleAccount: boolean,
) {
  const tokenInfo = {
    id: id,
    token: token,
    isGoogleAccount: isGoogleAccount,
  };
  res.cookie("accessToken", tokenInfo, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.send(200);
}

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = findUser(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  } else if (secret) {
    const { id } = user;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(201).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id }, secret, { expiresIn: "24h" });
    createCookie(res, id, token, false);
  }
});

app.post("/api/auth/google/callback", async (req: Request, res: Response) => {
  const { tokenResponse, userProfile } = req.body;
  if (clientId && secret && tokenResponse && userProfile) {
    try {
      //eslint-disable-next-line
      const { access_token } = tokenResponse;
      const { name, picture, email } = userProfile;
      const preexistingUser = findUser(email);
      const uuid = crypto.randomUUID();
      let id;
      if (!preexistingUser) {
        const newUser = createUser(uuid, name, "", email, picture, true);
        users.push(newUser);
        //eslint-disable-next-line
      } else {
        id = preexistingUser.id;
      }
      createCookie(res, id || uuid, access_token, true);
    } catch {
      return res.status(403).send("Error receiving access token.");
    }
  }
});

app.post("/api/auth/logout", async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.send(204);
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/*path", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, "localhost+2-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "localhost+2.pem")),
};

const server = https.createServer(serverOptions, app);
server.listen(port, () => {
  //eslint-disable-next-line
  console.log(`Server running at https://localhost:${port}/`);
});

export default app;