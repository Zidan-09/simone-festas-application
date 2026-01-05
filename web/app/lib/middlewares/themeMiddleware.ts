import { prisma } from "../prisma";
import { ServerResponses } from "../utils/responses/serverResponses";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { ThemeCategory } from "../utils/theme/themeCategory";
import { ImagePayload, ThemeService } from "../services/themeService";
import { ItemResponses } from "../utils/responses/itemResponses";

export const ThemeMiddleware = {
  async validateCreateTheme(formData: FormData) {
    const name = String(formData.get("name") || "").trim().normalize("NFC").toLowerCase();

    if (!name) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }

    const category = String(formData.get("category"));

    if (!Object.values(ThemeCategory).includes(category as ThemeCategory)) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    const mainImage = formData.get("mainImageFile");

    if (!(mainImage instanceof File)) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    };

    let images: ImagePayload[] = [];
    let items: string[] = [];

    try {
      images = JSON.parse(String(formData.get("images") || "[]"));
      items = JSON.parse(String(formData.get("items") || "[]"));
    } catch {
      throw {
        statusCode: 400,
        message: ServerResponses.INVALID_INPUT
      };
    }

    for (const img of images) {
      if (img.isNewImage) {
        const file = formData.get(img.key!);

        if (!(file instanceof File)) throw {
          statusCode: 400,
          message: ServerResponses.INVALID_INPUT
        };
      }
    }

    if (new Set(items).size !== items.length) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }

    if (items.length) {
      const foundItems = await prisma.item.findMany({
        where: {
          id: { in: items }
        },
        select: { id: true }
      });

      if (foundItems.length !== items.length) throw {
        statusCode: 404,
        message: ItemResponses.ITEM_NOT_FOUND
      };
    }
  },

  async validateGetTheme(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  },

  async validateEditTheme(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }

    await ThemeService.get(id);
  },

  async validateDeleteTheme(id: string) {
    if (!id) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  },

  async validateGetByCategory(category: ThemeCategory) {
    const ThemeTypes = Object.values(ThemeCategory);

    if (!ThemeTypes.includes(category)) throw {
      statusCode: 400,
      message: ThemeResponses.THEME_INVALID_TYPE
    }
  },

  async validateThemeSearch(query: string) {
    if (!query.trim()) throw {
      statusCode: 400,
      message: ServerResponses.INVALID_INPUT
    }
  }
}