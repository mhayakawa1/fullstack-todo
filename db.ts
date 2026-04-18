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

export default db;
