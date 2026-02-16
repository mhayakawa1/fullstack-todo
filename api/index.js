export default async function handler(req, res) {
  try {
    const { default: bodyParser } = await import("body-parser");
    const { default: express } = await import("express");
    const { default: cookieParser } = await import("cookie-parser");
    const { default: cors } = await import("cors");
    const { default: path } = await import("node:path");
    const { default: fs } = await import("fs");
    const { default: https } = await import("https");
    const { default: helmet } = await import("helmet");
    const { default: checkAuthorization } = await import("./_authMiddleware");
    const { default: todoRouter } = await import("./todos/_todo");
    const { default: todosRouter } = await import("./todos/_todos");
    const { default: addTodoRouter } = await import("./todos/_addTodo");
    const { default: editTodoRouter } = await import("./todos/_editTodo");
    const { default: deleteTodoRouter } = await import("./todos/_deleteTodo");
    const { default: userInfoRouter } = await import("./todos/_userInfo");
    const { default: signupRouter } = await import("./todos/_signup");
    const { default: loginRouter } = await import("./todos/_login");
    const { default: googleRouter } = await import("./todos/_google");
    const { default: logoutRouter } = await import("./todos/_logout");
    const app = express();
    const port = 8080;

    app.get("/api/data", (req, res) => {
      reson({ message: "This is a secure API response!" });
    });

    const allowedOrigins = [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://fullstack-todo-kappa.vercel.app/",
    ];

    app.use(bodyParseron());
    app.use(expresson());
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
      origin: function (origin, callback) {
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
  } catch (err) {
    //eslint-disable-next-line
    console.error("ERROR:", err.message);
    res.status(500).json({
      error: "Critical Server Startup Error",
      message: err.message,
      path: err.path || "Check your  extensions",
    });
  }
}
