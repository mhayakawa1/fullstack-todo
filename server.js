const express = require("express");
const app = express();
const path = require("node:path");
const port = 3000;
app.listen(port, () => {
  //eslint-disable-next-line
  console.log(`Server is running on port ${port}`);
});

// app.use(express.static(__dirname + "./index.html"));
// const path = require("path");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

function createTodo(
  userId,
  title,
  description,
  status,
  dueDate,
  createdAt,
  updatedAt,
) {
  return {
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
    "2025-11-18T00:05:56.330Z",
  ),
  createTodo(
    2,
    "userId1",
    "Make Dinner",
    "Pasta, salad, tea",
    false,
    "2025-11-22T01:43:16.000Z",
    "2025-11-22T01:45:00.889Z",
    "2025-11-22T01:45:00.889Z",
  ),
  createTodo(
    "userId1",
    "Chores",
    "Laundry, dishes",
    false,
    "2025-11-24T00:46:52.757Z",
    "2025-11-24T00:55:10.616Z",
    "2025-11-24T00:55:10.616Z",
  ),
];

app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((p) => p.id == id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

app.post("/todos", (req, res) => {
  app.use(express.json());
  const data = req.body;
  if (
    data.userId &&
    data.title &&
    data.description &&
    data.status &&
    data.dueDate &&
    data.createdAt &&
    data.updatedAt
  ) {
    const newId = todos.length + 1;
    const newTodo = new Todo(
      newId,
      data.userId,
      data.title,
      data.description,
      data.status,
      data.dueDate,
      data.createdAt,
      data.updatedAt,
    );
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } else {
    res.status(400).send("Invalid data");
  }
});
app.put("/todos/:id", (req, res) => {
  app.use(express.json());
  const id = req.params.id;
  const data = req.body;

  if (
    data.userId &&
    data.title &&
    data.description &&
    data.status &&
    data.dueDate &&
    data.createdAt &&
    data.updatedAt
  ) {
    const newId = todos.length + 1;
    const newTodo = new Todo(
      newId,
      data.userId,
      data.title,
      data.description,
      data.status,
      data.dueDate,
      data.createdAt,
      data.updatedAt,
    );
  } else {
    res.status(400).send("Invalid data");
  }
});

app.put("/todos/:id", (req, res) => {
  app.use(express.json());
  const id = req.params.id;
  const data = req.body;

  if (
    data.userId &&
    data.title &&
    data.description &&
    data.status &&
    data.dueDate &&
    data.createdAt &&
    data.updatedAt
  ) {
    const todo = todos.find((p) => p.id == id);
    if (todo) {
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

app.use(express.static(path.join(__dirname, "public")));
app.get("/*path", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
