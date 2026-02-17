import { Request, Response } from "express";
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
    const { default: checkAuthorization } = await import(
      "../server/_authMiddleware.js"
    );
    const { default: todoRouter } = await import("../server/todos/_todo.js");
    const { default: todosRouter } = await import("../server/todos/_todos.js");
    const { default: addTodoRouter } = await import(
      "../server/todos/_addTodo.js"
    );
    const { default: editTodoRouter } = await import(
      "../server/todos/_editTodo.js"
    );
    const { default: deleteTodoRouter } = await import(
      "../server/todos/_deleteTodo.js"
    );
    const { default: userInfoRouter } = await import(
      "../server/auth/_userInfo.js"
    );
    const { default: signupRouter } = await import("../server/auth/_signup.js");
    const { default: loginRouter } = await import("../server/auth/_login.js");
    const { default: googleRouter } = await import("../server/auth/_google.js");
    const { default: logoutRouter } = await import("../server/auth/_logout.js");
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
            "connect-src": [
              "'self'",
              "https://fullstack-todo-server-git-deploy-server-makihayas-projects.vercel.app/",
            ],
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
    app.get("/*path", (req, res) => {
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
