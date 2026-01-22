import { UserService } from "../services/user.service";
import { LoginUser, RegisterUser } from "../utils/requests/user.request";
import { UserResponses } from "../utils/responses/userResponses";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ApiResponse } from "../utils/server/apiResponse";

export const UserController = {
  async register(content: RegisterUser) {
    const result = await UserService.register(content);

    return ApiResponse.success(result, UserResponses.USER_CREATED, 201);
  },

  async login(content: LoginUser) {
    const result = await UserService.login(content);

    return ApiResponse.token(result, UserResponses.USER_LOGIN_SUCCESS);
  },

  check(token?: RequestCookie) {
    if (!token) throw {
      statusCode: 403,
      message: UserResponses.USER_UNAUTHORIZED
    };
    
    return ApiResponse.success();
  },

  async admin(token?: RequestCookie) {
    if (!token) throw {
      statusCode: 403,
      message: UserResponses.USER_UNAUTHORIZED
    };

    const result = await UserService.checkAdmin(token);

    return ApiResponse.success(result);
  }
}