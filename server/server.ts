// import { Request, Response } from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import fs from "fs";
import https from "https";
import helmet from "helmet";
import checkAuthorization from "./authMiddleware.js";
import "dotenv/config";
import todosRouter from "./api/todos/todos.js";
import todoRouter from "./api/todos/todo.js";
import addTodoRouter from "./api/todos/addTodo.js";
import editTodoRouter from "./api/todos/editTodo.js";
import deleteTodoRouter from "./api/todos/deleteTodo.js";
import userInfoRouter from "./api/auth/userInfo.js";
import signupRouter from "./api/auth/signup.js";
import loginRouter from "./api/auth/login.js";
import googleRouter from "./api/auth/google.js";
import logoutRouter from "./api/auth/logout.js";
const app = express();
const port = 10000;

async function startServer() {
  //eslint-disable-next-line
  console.error("function handler");
  try {
    app.get("/ping", (req, res) => res.send("pong"));

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.get("/api/data", (req, res) => {
      res.json({ message: "This is a secure API response!" });
    });

    const allowedOrigins = [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://fullstack-todo-kappa.vercel.app/",
      "https://fullstack-todo-1-hung.onrender.com",
    ];

    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (!process.env.RENDER) {
      app.use(
        helmet({
          contentSecurityPolicy: {
            directives: {
              "connect-src": [
                "'self'",
                "https://fullstack-todo-6g45.onrender.com",
              ],
            },
          },
          crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        }),
      );
    }

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
    //eslint-disable-next-line
    console.error("paths added");

    app.use(express.static(path.join(__dirname, "public")));
    app.get("/*path", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    let server;
    if (process.env.RENDER) {
      server = https.createServer(app);
    } else {
      const serverOptions = {
        key: fs.readFileSync(path.join(__dirname, "localhost+2-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "localhost+2.pem")),
      };
      server = https.createServer(serverOptions, app);
    }

    server.listen(port, "0.0.0.0", () => {
      //eslint-disable-next-line
      console.log(`Server running at https://localhost:${port}/`);
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    const errorStack =
      err instanceof Error ? err.stack : "Unknown serror stack";

    //eslint-disable-next-line
    console.error("ERROR:", errorMessage, errorStack);
  }
}

startServer().catch((err) => {
  //eslint-disable-next-line
  console.error("Unhandles promise:", err);
});
