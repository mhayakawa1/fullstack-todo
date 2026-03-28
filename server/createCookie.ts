import { Response } from "express";

export function createCookie(
  res: Response,
  id: string,
  token: string,
  isGoogleAccount: boolean,
) {
  const tokenInfo = {
    id: id,
    token: token,
    isGoogleAccount: isGoogleAccount,
  };
  res.cookie("accessToken", tokenInfo, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.send(200);
}
