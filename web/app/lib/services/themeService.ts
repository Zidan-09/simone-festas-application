import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import { Theme, ThemeCategory } from "@prisma/client";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { EditThemeImagesItems } from "../utils/theme/edit/editThemeImagesItems";

export type ImagePayload = {
  id?: string;
  key: string | null;
  image: string | File;
  isNewImage: boolean;
};

type EditThemeResult = {
  themeId: string;
  updatedTheme: boolean;
  updatedImages: boolean;
  updatedItems: boolean;
};

export const ThemeService = {
  async create(formData: FormData) {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name") || "").trim().normalize("NFC").toLowerCase();
        const category = formData.get("category") as ThemeCategory;

        const theme = await tx.theme.create({
          data: {
            name,
            category,
            mainImage: ""
          }
        });

        const file = formData.get("mainImageFile");

        if (!(file instanceof File)) throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        };

        const blob = await put(
          `themes/${theme.id}/main-${crypto.randomUUID()}-${file.name}`,
          file,
          { access: "public" }
        );

        await tx.theme.update({
          where: { id: theme.id },
          data: { mainImage: blob.url}
        });

        const images = JSON.parse(
          String(formData.get("images") || "[]")
        ) as ImagePayload[];

        const galleryData = await Promise.all(
          images.map(async (img) => {
            const file = formData.get(img.key!);

            if (!(file instanceof File)) throw {
              statusCode: 400,
              message: ServerResponses.INVALID_INPUT
            };
            
            const blob = await put(
              `themes/${theme.id}/${crypto.randomUUID()}-${file.name}`,
              file,
              { access: "public" }
            );

            return {
              themeId: theme.id,
              url: blob.url
            };
          })
        );

        if (galleryData.length) await tx.themeImage.createMany({
          data: galleryData
        });
        
        const items = JSON.parse(
          String(formData.get("items") || "[]")
        ) as string[];

        if (items.length) await tx.themeItem.createMany({
          data: items.map(itemId => ({
            themeId: theme.id,
            itemId
          }))
        });
        
        return theme;
      });

    } catch (err: any) {
      console.error(err);
      if (err?.statusCode) throw err;

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

  async get(id: string): Promise<Theme> {
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

    return result;
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

  async edit(id: string, formData: FormData): Promise<EditThemeResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name") || "").trim().normalize("NFC").toLowerCase();
        const category = formData.get("category") as ThemeCategory;

        const currentTheme = await tx.theme.findUnique({
          where: { id }
        });

        if (!currentTheme) throw {
          statusCode: 404,
          message: ThemeResponses.THEME_NOT_FOUND
        };

        const mainImagePayload = JSON.parse(
          String(formData.get("mainImage"))
        );

        let mainImageUrl: string;

        if (mainImagePayload?.isNew) {
          const file = formData.get("mainImageFile");

          if (!(file instanceof File)) throw {
            statusCode: 400,
            message: ServerResponses.INVALID_INPUT
          };

          const blob = await put(
            `themes/${currentTheme.id}/main-${crypto.randomUUID()}-${file.name}`,
            file,
            { access: "public" }
          );

          mainImageUrl = blob.url;

        } else {
          mainImageUrl = mainImagePayload;
        }

        let updatedTheme: boolean = false;
        let updatedImages: boolean = false;
        let updatedItems: boolean = false;

        if (
          currentTheme.name !== name ||
          currentTheme.category !== category
        ) {
          await tx.theme.update({
            where: { id: currentTheme.id },
            data: {
              name,
              category,
              mainImage: mainImageUrl
            }
          });

          updatedTheme = true;
        };

        const images = JSON.parse(
          String(formData.get("images"))
        ) as ImagePayload[];

        const items = JSON.parse(
          String(formData.get("items"))
        ) as string[];

        updatedImages = await EditThemeImagesItems.editThemeImages(tx, currentTheme.id, images);
        updatedItems = await EditThemeImagesItems.editThemeItems(tx, currentTheme.id, items);

        return {
          themeId: currentTheme.id,
          updatedTheme,
          updatedImages,
          updatedItems
        }
      });

    } catch (err: any) {
      if (err?.statusCode) throw err;

      console.error(err);

      throw {
        statusCode: 400,
        message: ThemeResponses.THEME_UPDATED_ERROR
      }
    }
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