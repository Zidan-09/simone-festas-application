import jwt from "jsonwebtoken";

export function getTokenContent(token: string) {
  const payload = jwt.verify(token, process.env.JWT_SECRET || "TESTE") as jwt.JwtPayload;
  const { id } = payload;

  return id;
};