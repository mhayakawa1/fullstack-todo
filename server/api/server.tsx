import { Request, Response } from "express";
import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import fs from "fs";
import https from "https";
import helmet from "helmet";
import checkAuthorization from "../authMiddleware";
import "dotenv/config";
import todosRouter from "./todos/todos";
import todoRouter from "./todos/todo";
import addTodoRouter from "./todos/addTodo";
import editTodoRouter from "./todos/editTodo";
import deleteTodoRouter from "./todos/deleteTodo";
import userInfoRouter from "./auth/userInfo";
import signupRouter from "./auth/signup";
import loginRouter from "./auth/login";
import googleRouter from "./auth/google";
import logoutRouter from "./auth/logout";
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

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/api/todos", todosRouter);
app.use("/api/todos", todoRouter);
app.use("/api/todos", addTodoRouter);
app.use("/api/todos", editTodoRouter);
app.use("/api/todos", deleteTodoRouter);

app.use("/api/auth", userInfoRouter);
app.use("/api/auth", signupRouter);
app.use("/api/auth", loginRouter);
app.use("/api/auth", googleRouter);
app.use("/api/auth", logoutRouter);

app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/*path", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "..", "index.html"));
});

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, "..", "localhost+2-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "..", "localhost+2.pem")),
};

const server = https.createServer(serverOptions, app);
server.listen(port, () => {
  //eslint-disable-next-line
  console.log(`Server running at port ${port}`);
});

export default app;
