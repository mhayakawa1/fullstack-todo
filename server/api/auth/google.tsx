import express, { Request, Response } from "express";
import { addUser, createUser, findUser } from "../data/users";
import { createCookie } from "../../createCookie";
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
      const preexistingUser = findUser(email);
      const uuid = crypto.randomUUID();
      let id;
      if (!preexistingUser) {
        const newUser = createUser(uuid, name, "", email, picture, true);
        addUser(newUser);
      } else {
        id = preexistingUser.id;
      }
      //eslint-disable-next-line
      createCookie(res, id || uuid, access_token, true);
    } catch {
      return res.status(403).send("Error receiving access token.");
    }
  }
});

export default googleRouter;