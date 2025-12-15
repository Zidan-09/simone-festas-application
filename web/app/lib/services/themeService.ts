import { prisma } from "../prisma";

const ThemeService = {
  async create(name: string, mainImage: string) {
    await prisma.theme.create({
      data: {
        name: name,
        mainImage: mainImage
      }
    })
  }
}