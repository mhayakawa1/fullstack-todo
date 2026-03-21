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
  for (let i = 0; i < length; i += 2) {
    const chunk = todosList.slice(i, i + 2);
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

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS todos (
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
];

const defaultTodos = [
  {
    id: "userId1",
    items:
    //eslint-disable-next-line
      '[{"id":"1234","userId":"userId1","title":"Grocery Shopping","description":"Bread, milk, apples","status":"incomplete","dueDate": "2025-11-24T00:46:52.757Z","createdAt": "2025-11-24T00:55:10.616Z","updatedAt":"2025-11-24T00:55:10.616Z"},{"id":"5678","userId":"userId1","title":"Chores","description":"Laundry, dishes","status":"incomplete","dueDate":"2025-11-24T00:46:52.757Z","createdAt":"2025-11-24T00:55:10.616Z","updatedAt":"2025-11-24T00:55:10.616Z"}]',
  },
];

const insertUser = db.prepare(
  "INSERT OR IGNORE INTO users (id, name, email, passwordHash, picture, isGoogleAccount) VALUES (:id, :name, :email, :passwordHash, :picture, :isGoogleAccount)",
);
const insertTodos = db.prepare(
  "INSERT OR IGNORE INTO todos (id, items) VALUES (:id, :items)",
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
