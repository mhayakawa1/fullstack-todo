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
const insert = db.prepare(
  "INSERT OR IGNORE INTO users (id, name, email, passwordHash, picture, isGoogleAccount) VALUES (:id, :name, :email, :passwordHash, :picture, :isGoogleAccount)",
);

const seedUsers = db.transaction((users) => {
  for (const user of users) {
    insert.run(user);
  }
});
seedUsers(defaultUsers);

db.prepare("DELETE FROM users").run();

export default db;
