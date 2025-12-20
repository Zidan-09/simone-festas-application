import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { LoginUser, RegisterUser } from "../utils/requests/userRequest";
import { UserResponses } from "../utils/responses/userResponses";
import { generateToken } from "../utils/user/generateToken";

export const UserService = {
  async register(content: RegisterUser) {
    try {
      const hash = await bcrypt.hash(content.password, 10);
  
      return await prisma.user.create({
        data: {
          username: content.username,
          contact: content.contact,
          email: content.email,
          address: content.address,
          passwordHash: hash
        }
      });

    } catch {
      throw {
        statusCode: 400,
        message: UserResponses.USER_CREATED_ERROR
      }
    }
  },

  async login(content: LoginUser) {
    const saved = await prisma.user.findUnique({
      where: {
        email: content.email
      }
    });

    if (!saved) throw {
      statusCode: 404,
      message: UserResponses.USER_NOT_FOUND
    }

    const valid = await bcrypt.compare(content.password, saved.passwordHash);

    if (!valid) throw {
      statusCode: 403,
      message: UserResponses.USER_INVALID_PASSWORD
    }

    return generateToken(saved.id);
  },

  async getByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email
      }
    });
  },

  async get(id: string) {
    return await prisma.user.findUnique({
      where: {
        id: id
      }
    });
  }
}