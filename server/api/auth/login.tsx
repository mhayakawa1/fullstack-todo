import express, { Request, Response } from "express";
import { createCookie } from "../../createCookie";
import { findUser } from "../data/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const secret = process.env.CLIENT_SECRET;
const loginRouter = express.Router();

loginRouter.post("/login", async (req: Request, res: Response) => {
   const { email, password } = req.body;
   const user = findUser(email);
   if (!user) {
     return res.status(400).json({ message: "Invalid credentials" });
   } else if (secret) {
     const { id } = user;
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
       return res.status(201).json({ message: "Invalid credentials" });
     }
     const token = jwt.sign({ id }, secret, { expiresIn: "24h" });
     createCookie(res, id, token, false);
   }
});

export default loginRouter;