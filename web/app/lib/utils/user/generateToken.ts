import { sign } from "jsonwebtoken";

export function generateToken(userId: string) {
  const JWT_SECRET = process.env.JWT_SECRET || "TESTE";
  return sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
}
