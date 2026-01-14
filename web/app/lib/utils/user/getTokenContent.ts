import jwt from "jsonwebtoken";

export function getTokenContent(token: string) {
  const payload = jwt.decode(token) as jwt.JwtPayload;
  const { id } = payload;

  return id;
};