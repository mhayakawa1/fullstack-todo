import express, { Request, Response } from "express";
import db from "../../../db.js";
import { User } from "../../../db.js";
import { createCookie } from "../../createCookie.js";
import "dotenv/config";
const googleRouter = express.Router();
const clientId = process.env.CLIENT_ID;
const secret = process.env.CLIENT_SECRET;

googleRouter.post("/google/callback", async (req: Request, res: Response) => {
  const { tokenResponse, userProfile } = req.body;
  if (clientId && secret && tokenResponse && userProfile) {
    try {
      //eslint-disable-next-line
      const { access_token } = tokenResponse;
      const { name, picture, email } = userProfile;
      const users = db.prepare("SELECT * FROM users").all() as User[];
      const preexistingUser = users.find((user) => user.email === email);
      const uuid = crypto.randomUUID();
      let id;
      const json = { errors: [], message: "", id: 0 };
      if (!preexistingUser) {
        const newUser = {
          id: uuid,
          name: name,
          email: email,
          passwordHash: "",
          picture: picture,
          isGoogleAccount: 1,
        };
        const insert = db.prepare(
          "INSERT INTO users (id, name, email, passwordHash, picture, isGoogleAccount) VALUES (:id, :name, :email, :passwordHash, :picture, :isGoogleAccount)",
        );
        const info = insert.run(newUser);
        json.message = "User registered.";
        json.id = Number(info.lastInsertRowid);
      } else {
        id = preexistingUser.id;
      }
      //eslint-disable-next-line
      createCookie(res, id || uuid, access_token, true);
      return res.status(200).json(json);
    } catch {
      return res.status(403).send("Error receiving access token.");
    }
  }
});

export default googleRouter;
