import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { UserService } from "../services/user.service";
import { LoginUser, RegisterUser } from "../utils/requests/user.request";
import { ServerResponses } from "../utils/responses/serverResponses";
import { UserResponses } from "../utils/responses/userResponses";
import { AppError } from "../withError";

export const UserMiddleware = {
  async validateCreateUser(input: RegisterUser) {
    if (
      !input.username ||
      !input.contact ||
      !input.email ||
      !input.address ||
      !input.password
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);

    const existsUser = await UserService.getByEmail(input.email);

    if (existsUser) throw new AppError(409, UserResponses.USER_ALREADY_EXISTS);
  },

  async validateLoginUser(input: LoginUser) {
    if (
      !input.email ||
      !input.password
    ) throw new AppError(400, ServerResponses.INVALID_INPUT);
  },

  async authUser(token?: RequestCookie) {
    if (!token) throw new AppError(403, UserResponses.USER_OPERATION_NOT_ALLOWED);

    const user = await UserService.get(token.value);

    if (!user) throw new AppError(404, UserResponses.USER_NOT_FOUND);
  },

  async admin(token?: RequestCookie) {
    if (!token) throw new AppError(403, UserResponses.USER_UNAUTHORIZED);
    
    try {
      const user = await UserService.get(token.value);

      if (!user) throw new AppError(404, UserResponses.USER_NOT_FOUND);

      if (!user.isAdmin) throw new AppError(403, UserResponses.USER_FORBIDDEN);
      
    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

      throw new AppError(400, UserResponses.USER_INTERNAL_ERROR);
    }
  }
}