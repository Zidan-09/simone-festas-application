import { UserService } from "../services/user.service";
import { LoginUser, RegisterUser } from "../utils/requests/user.request";
import { ServerResponses } from "../utils/responses/serverResponses";
import { UserResponses } from "../utils/responses/userResponses";

export const UserMiddleware = {
  async validateCreateUser(input: RegisterUser) {
    if (
      !input.username ||
      !input.contact ||
      !input.email ||
      !input.address ||
      !input.password
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }

    const existsUser = await UserService.getByEmail(input.email);

    if (existsUser) throw {
      statusCode: 409,
      message: UserResponses.USER_ALREADY_EXISTS
    }
  },

  async validateLoginUser(input: LoginUser) {
    if (
      !input.email ||
      !input.password
    ) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  }
}