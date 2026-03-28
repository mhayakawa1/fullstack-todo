import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(import.meta.dirname, "data.db");
const db = new Database(dbPath);

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  picture: string;
  isGoogleAccount: number;
}

export interface Todo {
  id: string | number;
  userId: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TodosArray = Todo[];

export interface UserTodos {
  id: string;
  items: TodosArray;
}

export function createTodo(
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

export function paginate(todosList: TodosArray, length: number) {
  const paginatedTodos = [];
  for (let i = 0; i < length; i += 10) {
    const chunk = todosList.slice(i, i + 10);
    paginatedTodos.push(chunk);
  }
  return paginatedTodos;
}

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        picture TEXT NOT NULL,
        isGoogleAccount NUMBER NOT NULL
    );
`,
).run();

const now = JSON.stringify(new Date());
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo' CHECK (STATUS IN ('todo','in_progress','done')),
      dueDate TEXT DEFAULT ${now},
      createdAt TEXT NOT NULL DEFAULT ${now},
      updatedAt TEXT NOT NULL DEFAULT ${now}
    );
  `,
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS todos1 (
        id TEXT PRIMARY KEY,
        items TEXT NOT NULL
    );
  `,
).run();

const defaultUsers: User[] = [
  {
    id: "userId1",
    name: "First Last",
    email: "email@email.com",
    passwordHash:
      "$2a$12$gW5TayKOvi5rE9ll6LSE4eGnxrdXkacc6R8dQFPqPQ40/TRXaZTfO",
    picture: "",
    isGoogleAccount: 0,
  },
  {
    id: "userId2",
    name: "First Last",
    email: "gmail@gmail.com",
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
db.prepare("DELETE FROM users").run();

const seedUsers = db.transaction((users, todos) => {
  for (const user of users) {
    insertUser.run(user);
  }
  for (const todo of todos) {
    insertTodos.run(todo);
  }
});
seedUsers(defaultUsers, defaultTodos);
export default db;
