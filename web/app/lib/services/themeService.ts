import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import { ThemeCategory } from "@prisma/client";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { EditThemeImagesItems } from "../utils/theme/editThemeImagesItems";
import { ServerResponses } from "../utils/responses/serverResponses";

type ImagesPayload = {
  id?: string;
  image: string;
  isNewImage: boolean;
}

type ItemsPayload = {
  id: string;
  quantity: number;
}

export const ThemeService = {
  async create(formData: FormData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name"));
        const category = String(formData.get("category")) as ThemeCategory;
        const mainImage = formData.get("mainImage");

        if (!(mainImage instanceof File)) throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        };

        const blob = await put(
          `themes/${name}/${Date.now()}-${mainImage.name}`,
          mainImage,
          { access: "public" }
        )

        const themeCreated = await tx.theme.create({
          data: {
            name: name,
            mainImage: blob.url,
            category: category
          }
        });

        const images = JSON.parse(
          formData.get("images") as string
        ) as ImagesPayload[];

        const themeImages = await Promise.all(
          images.map(async (image) => {
            const rawImage = formData.get(image.image);

            if (!(rawImage instanceof File)) throw {
              statusCode: 400,
              message: ServerResponses.INVALID_INPUT
            };

            const blob = await put(
              `themes/${name}/${Date.now()}-${rawImage.name}`,
              rawImage,
              { access: "public" }
            );

            return {
              themeId: themeCreated.id,
              url: blob.url
            };
          })
        );

        await tx.themeImage.createMany({
          data: themeImages
        })

        const items = JSON.parse(
          formData.get("items") as string
        ) as ItemsPayload[];
  
        const itemsCreated = await tx.themeItem.createMany({
          data: items.map(item => ({
            themeId: themeCreated.id,
            itemId: item.id,
            quantity: item.quantity
          }))
        });
  
        return {
          theme: themeCreated,
          imagens: themeImages,
          items: itemsCreated
        }
      });

    } catch {
      throw {
        statusCode: 400,
        message: ThemeResponses.THEME_CREATED_ERROR
      }
    }
  },

  async getByName(name: string) {
    return await prisma.theme.findMany({
      where: {
        name: name
      },
      include: {
        images: true,
        items: true
      }
    });
  },

  async get(id: string) {
    const result = await prisma.theme.findUnique({
      where: {
        id: id
      },
      include: {
        images: true,
        items: true
      }
    });

    if (!result) throw {
      statusCode: 404,
      message: ThemeResponses.THEME_NOT_FOUND
    }
  },

  async getAll() {
    return await prisma.theme.findMany({
      include: {
        images: true,
        items: true
      }
    });
  },

  async getType(category: ThemeCategory) {
    return await prisma.theme.findMany({
      where: {
        category: category
      },
      include: {
        images: true,
        items: true
      }
    });
  },

  async search(query: string) {
    return await prisma.theme.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        }
      },
      include: {
        images: true,
        items: true
      }
    });
  },

  async edit(id: string, formData: FormData) {
    
  },

  async delete(id: string) {
    try {
      return await prisma.theme.delete({
        where: {
          id: id
        }
      });

    } catch {
      throw {
        statusCode: 400,
        message: ThemeResponses.THEME_DELETED_ERROR
      };
    };
  }
}