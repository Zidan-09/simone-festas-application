import { JwtPayload, verify } from "jsonwebtoken"
import { UserResponses } from "../utils/responses/userResponses";
import { AppError } from "../withError";

export const AuthMiddleware = {
  async validateToken(token: string) {
    const JWT_SECRET = process.env.JWT_SECRET || "TESTE";

    const result = verify(token, JWT_SECRET) as JwtPayload;
    
    if (!result.id) throw new AppError(401, UserResponses.USER_TOKEN_INVALID);
  }
}