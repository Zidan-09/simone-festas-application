import { UserService } from "../services/userService";
import { LoginUser, RegisterUser } from "../utils/requests/userRequest";
import { UserResponses } from "../utils/responses/userResponses";
import { ApiResponse } from "../utils/server/apiResponse";

export const UserController = {
  async register(content: RegisterUser) {
    const result = await UserService.register(content);

    return ApiResponse.success(result, UserResponses.USER_CREATED, 201);
  },

  async login(content: LoginUser) {
    const result = await UserService.login(content);

    return ApiResponse.success(result, UserResponses.USER_LOGIN_SUCCESS);
  }
}