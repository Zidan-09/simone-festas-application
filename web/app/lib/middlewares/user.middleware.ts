import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { UserService } from "../services/user.service";
import { LoginUser, RegisterUser } from "../utils/requests/user.request";
import { ServerResponses } from "../utils/responses/serverResponses";
import { UserResponses } from "../utils/responses/userResponses";
import { getTokenContent } from "../utils/user/getTokenContent";
import { prisma } from "../prisma";

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
  },

  async authUser(token?: RequestCookie) {
    if (!token) throw {
      statusCode: 403,
      message: UserResponses.USER_OPERATION_NOT_ALLOWED
    }

    const userId = getTokenContent(token.value);

    const user = await UserService.get(userId);

    if (!user) throw {
      statusCode: 404,
      message: UserResponses.USER_NOT_FOUND
    }
  },

  async admin(token?: RequestCookie) {
    if (!token) throw {
      statusCode: 403,
      message: UserResponses.USER_UNAUTHORIZED
    };

    const id = getTokenContent(token.value);
    
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id
        }
      });

      if (!user) throw {
        statusCode: 404,
        message: UserResponses.USER_NOT_FOUND
      };

      if (!user.isAdmin) throw {
        statusCode: 403,
        message: UserResponses.USER_FORBIDDEN
      };

      return true;
      
    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw {
        statusCode: 400,
        message: UserResponses.USER_INTERNAL_ERROR
      }
    }
  }
}