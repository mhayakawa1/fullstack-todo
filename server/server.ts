import { Request, Response } from "express";
//eslint-disable-next-line
console.error("express imports");
import { fileURLToPath } from "url";
//eslint-disable-next-line
console.error("url import");
import "dotenv/config";
//eslint-disable-next-line
console.error("dotenv import");
export default async function handler(req: Request, res: Response) {
  try {
    const { default: bodyParser } = await import("body-parser");
    const { default: express } = await import("express");
    const { default: cookieParser } = await import("cookie-parser");
    const { default: cors } = await import("cors");
    const { default: path } = await import("node:path");
    const { default: fs } = await import("fs");
    const { default: https } = await import("https");
    const { default: helmet } = await import("helmet");
    const { default: checkAuthorization } = await import("./authMiddleware.js");
    const { default: todoRouter } = await import("./api/todos/todo.js");
    const { default: todosRouter } = await import("./api/todos/todos.js");
    const { default: addTodoRouter } = await import("./api/todos/addTodo.js");
    const { default: editTodoRouter } = await import("./api/todos/editTodo.js");
    const { default: deleteTodoRouter } = await import(
      "./api/todos/deleteTodo.js"
    );
    const { default: userInfoRouter } = await import("./api/auth/userInfo.js");
    const { default: signupRouter } = await import("./api/auth/signup.js");
    const { default: loginRouter } = await import("./api/auth/login.js");
    const { default: googleRouter } = await import("./api/auth/google.js");
    const { default: logoutRouter } = await import("./api/auth/logout.js");
    //eslint-disable-next-line
    console.error("imports successful");
    const app = express();
    const port = 10000;

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
        })
      );
    }

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
    app.get("/*path", (req: Request, res: Response) => {
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

    return app(req, res);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    const errorStack = err instanceof Error ? err.stack : "";
    //eslint-disable-next-line
    console.error("ERROR:", errorMessage);
    res.status(500).json({
      error: "Critical Server Startup Error",
      message: errorMessage,
      stack: errorStack,
    });
  }
}
