import express, { Request, Response } from "express";
import users, { createUser } from "../data/users.js";
import bcrypt from "bcryptjs";
const signupRouter = express.Router();

signupRouter.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
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
    const newUser = createUser(
      uuid,
      name,
      hashedPassword,
      email,
      "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      false
    );
    users.push(newUser);
    res.status(201).json({ errors: [], message: "User registered." });
  }
});

export default signupRouter;
