import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../../../db.js";
import { User } from "../../../db.js";
const signupRouter = express.Router();

signupRouter.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = db.prepare("SELECT * FROM users").all() as User[];
  const preexistingUser = users.find((user) => user.email === email);
  const passwordValid = password.length >= 8;

  if (preexistingUser || !passwordValid) {
    const errors = [];
    if (preexistingUser) {
      errors.push({ field: "email", message: "Invalid email" });
    }
    if (!passwordValid) {
      errors.push({
        field: "password",
        message: "Must be at least 8 characters",
      });
    }
    return res.status(400).json({
      errors: errors,
    });
  } else if (!preexistingUser && passwordValid) {
    const uuid = crypto.randomUUID();
    try {
      const newUser = {
        id: uuid,
        name: name,
        email: email,
        passwordHash: hashedPassword,
        picture: "",
        isGoogleAccount: 0,
      };
      const insert = db.prepare(
        "INSERT INTO users (id, name, email, passwordHash, picture, isGoogleAccount) VALUES (:id, :name, :email, :passwordHash, :picture, :isGoogleAccount)",
      );
      const info = insert.run(newUser);
      return res.status(201).json({
        errors: [],
        message: "User registered.",
        id: info.lastInsertRowid,
      });
    } catch (err) {
      return res.status(400).json({
        errors: [err],
      });
    }
  }
});

export default signupRouter;
