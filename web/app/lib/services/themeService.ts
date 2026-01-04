import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import { ThemeCategory } from "@prisma/client";
import { ThemeResponses } from "../utils/responses/themeResponses";

type ImagePayload = {
  id: string;
  key: string | null;
  url: string;
  isNewImage: boolean;
};

export const ThemeService = {
  async create(formData: FormData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name") || "").trim();
        const category = formData.get("category") as ThemeCategory;

        const mainImagePayload = JSON.parse(
          String(formData.get("mainImage"))
        );

        let mainImageUrl: string;

        if (mainImagePayload?.isNew) {
          const file = formData.get("mainImageFile");

          if (!(file instanceof File)) {
            throw new Error("Imagem principal inválida");
          }

          const blob = await put(
            `themes/${name}/${Date.now()}-${file.name}`,
            file,
            { access: "public" }
          );

          mainImageUrl = blob.url;

        } else {
          mainImageUrl = mainImagePayload;
        }

        const theme = await tx.theme.create({
          data: {
            name,
            category,
            mainImage: mainImageUrl
          }
        });

        const images = JSON.parse(
          String(formData.get("images") || "[]")
        ) as ImagePayload[];

        const galleryData = await Promise.all(
          images.map(async (img) => {
            if (img.isNewImage) {
              const file = formData.get(img.key!);

              if (!(file instanceof File)) {
                throw new Error("Imagem inválida");
              }

              const blob = await put(
                `themes/${name}/${Date.now()}-${file.name}`,
                file,
                { access: "public" }
              );

              return {
                themeId: theme.id,
                url: blob.url
              };
            }

            return {
              themeId: theme.id,
              url: img.url
            };
          })
        );

        if (galleryData.length) {
          await tx.themeImage.createMany({
            data: galleryData
          });
        }

        const items = JSON.parse(
          String(formData.get("items") || "[]")
        ) as string[];

        if (items.length) {
          await tx.themeItem.createMany({
            data: items.map(itemId => ({
              themeId: theme.id,
              itemId
            }))
          });
        }

        return theme;

      });

    } catch (err) {
      console.error(err);
      throw {
        statusCode: 400,
        message: ThemeResponses.THEME_CREATED_ERROR
      };
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