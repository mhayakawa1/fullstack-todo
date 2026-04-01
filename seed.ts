import Database from "better-sqlite3";
import path from "path";
import { User } from "./db";

const dbPath = path.resolve(import.meta.dirname, "data.db");
const db = new Database(dbPath);

const defaultUser: User[] = [
  {
    id: "userId1",
    name: "First Last",
    email: "email@email.com",
    passwordHash:
      "$2a$12$gW5TayKOvi5rE9ll6LSE4eGnxrdXkacc6R8dQFPqPQ40/TRXaZTfO",
    picture: "",
    isGoogleAccount: 0,
  },
];

const defaultTodos = [
  {
    id: "1234",
    userId: "userId1",
    title: "Chores",
    description: "Laundry, dishes",
    status: "in_progress",
    dueDate: "2025-11-24T00:46:52.757Z",
    createdAt: "2025-11-24T00:46:52.757Z",
    updatedAt: "2025-11-24T00:46:52.757Z",
  },
  {
    id: "5678",
    userId: "userId1",
    title: "Shopping",
    description: "Bread, milk, apples",
    status: "done",
    dueDate: "2025-11-24T00:46:52.757Z",
    createdAt: "2025-11-24T00:46:52.757Z",
    updatedAt: "2025-11-24T00:46:52.757Z",
  },
];

const insertUser = db.prepare(
  "INSERT OR IGNORE INTO users (id, name, email, passwordHash, picture, isGoogleAccount) VALUES (:id, :name, :email, :passwordHash, :picture, :isGoogleAccount)",
);
const insertTodos = db.prepare(
  "INSERT OR IGNORE INTO todos (id, userId, title, description, status, dueDate, createdAt, updatedAt) VALUES (:id, :userId, :title, :description, :status, :dueDate, :createdAt, :updatedAt)",
);

const seed = db.transaction((users, todos) => {
  for (const user of users) {
    insertUser.run(user);
  }
  for (const todo of todos) {
    insertTodos.run(todo);
  }
});
seed(defaultUser, defaultTodos);
