import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { LoginUser, RegisterUser } from "../utils/requests/user.request";
import { UserResponses } from "../utils/responses/userResponses";
import { generateToken } from "../utils/user/generateToken";
import { AppError } from "../withError";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
      throw new AppError(400, UserResponses.USER_CREATED_ERROR);
    }
  },

  async login(content: LoginUser) {
    const saved = await prisma.user.findUnique({
      where: {
        email: content.email
      }
    });

    if (!saved) throw new AppError(404, UserResponses.USER_NOT_FOUND);

    const valid = await bcrypt.compare(content.password, saved.passwordHash);

    if (!valid) throw new AppError(403, UserResponses.USER_INVALID_PASSWORD);

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
  },

  async logout(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
  }
}