import { prisma } from "../prisma";
import { CreateTheme, EditTheme } from "../utils/requests/themeRequest";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { EditThemeImagesItems } from "../utils/theme/editThemeImagesItems";

export const ThemeService = {
  async create({ theme, images, items }: CreateTheme) {
    try {
      return await prisma.$transaction(async (tx) => {
        const themeCreated = await tx.theme.create({
          data: {
            name: theme.name,
            mainImage: theme.mainImage
          }
        });
  
        const imagesCreated = await tx.themeImage.createMany({
          data: images.map(image => ({
            themeId: themeCreated.id,
            url: image.url
          }))
        });
  
        const itemsCreated = await tx.themeItem.createMany({
          data: items.map(item => ({
            themeId: themeCreated.id,
            itemId: item.item_id,
            quantity: item.quantity
          }))
        });
  
        return {
          theme: themeCreated,
          imagens: imagesCreated,
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
    return await prisma.theme.findUnique({
      where: {
        id: id
      },
      include: {
        images: true,
        items: true
      }
    });
  },

  async getAll() {
    return await prisma.theme.findMany({
      include: {
        images: true,
        items: true
      }
    });
  },

  async search(search: string) {

  },

  async edit(newData: EditTheme) {
    try {
      return await prisma.$transaction(async (tx) => {
        const currentTheme = await tx.theme.findUnique({
          where: {
            id: newData.theme.id
          }
        });

        if (!currentTheme) throw {
          statusCode: 404,
          message: ThemeResponses.THEME_NOT_FOUND
        };

        let themeUpdated = false;
        let imagesUpdated = false;
        let itemsUpdated = false;

        if (
          currentTheme.name != newData.theme.name ||
          currentTheme.mainImage != newData.theme.mainImage
        ) {
          await tx.theme.update({
            where: {
              id: currentTheme.id
            },
            data: {
              name: newData.theme.name,
              mainImage: newData.theme.mainImage
            }
          });

          themeUpdated = true;
        }

        if (newData.images.length > 0) {
          await EditThemeImagesItems.editThemeImages(tx, currentTheme.id, newData.images);

          imagesUpdated = true;
        }

        if (newData.items.length > 0) {
          await EditThemeImagesItems.editThemeItems(tx, currentTheme.id, newData.items);

          itemsUpdated = true;
        }

        return {
          themeID: currentTheme.id,
          updatedTheme: themeUpdated,
          updatedImages: imagesUpdated,
          updatedItems: itemsUpdated
        };
      });
    } catch (err: any) {
      if (err?.statusCode) throw err;
      
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