import { JwtPayload, verify } from "jsonwebtoken"
import { UserResponses } from "../utils/responses/userResponses";

export const AuthMiddleware = {
  async validateToken(token: string) {
    const JWT_SECRET = process.env.JWT_SECRET || "TESTE";

    const result = verify(token, JWT_SECRET) as JwtPayload;
    
    if (!result.id) throw {
      statusCode: 401,
      message: UserResponses.USER_TOKEN_INVALID
    }
  }
}