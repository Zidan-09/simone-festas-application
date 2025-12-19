import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { RegisterUser } from "../utils/requests/userRequest";
import { UserResponses } from "../utils/responses/userResponses";

export const UserService = {
  async register(content: RegisterUser) {
    try {
      const hash = await bcrypt.hash(content.password, 10);
  
      const result = await prisma.user.create({
        data: {
          username: content.username,
          contact: content.contact,
          email: content.email,
          address: content.address,
          passwordHash: hash
        }
      })

    } catch {
      throw {
        statusCode: 400,
        message: UserResponses.USER_CREATED_ERROR
      }
    }
  },

  login() {

  },

  async getByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email
      }
    });
  }
}