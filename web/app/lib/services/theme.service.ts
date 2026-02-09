import { prisma } from "../prisma";
import { put } from "@vercel/blob";
import { Prisma, ThemeCategory } from "@prisma/client";
import { ThemeResponses } from "../utils/responses/themeResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { EditThemeImagesItems } from "../utils/theme/edit/editThemeImagesItems";
import { normalizeKeywords } from "../utils/server/normalizeKeywords";
import { expandKeyword } from "../utils/server/expandKeyword";
import { onlyFinalKeywords } from "../utils/server/onlyFinalKeywords";
import { AppError } from "../withError";
import { UploadImages } from "../utils/theme/create/uploadImages";

type ThemeWithImages = Prisma.ThemeGetPayload<{
  include: { images: true }
}>;

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
};

export type ThemeSearchPayload = {
  keyWords: string;
  filter?: ThemeCategory[];
};

export const ThemeService = {
  async create(formData: FormData) {
    try {
      const themeId = crypto.randomUUID();

      const name = String(formData.get("name") || "").trim().normalize("NFC").toLowerCase();
      const category = formData.get("category") as ThemeCategory;
      const keyWords = JSON.parse(
        String(formData.get("keyWords"))
      ) as string[];

      const file = formData.get("mainImageFile");
      if (!(file instanceof File)) throw new AppError(400, ServerResponses.INVALID_INPUT);

      const blob = await UploadImages.uploadMainImage(themeId, file);

      const images = JSON.parse(
        String(formData.get("images") || "[]")
      ) as ImagePayload[];

      const galleryData = await UploadImages.uploadSecondaryImages(themeId, images, formData);

      return await prisma.$transaction(async (tx) => {
        const theme = await tx.theme.create({
          data: {
            id: themeId,
            name,
            category,
            mainImage: blob.url,
            keyWords: Array.from(
              new Set(keyWords.flatMap(normalizeKeywords).flatMap(expandKeyword))
            )
          }
        });

        if (galleryData.length) await tx.themeImage.createMany({
          data: galleryData
        });
        
        return theme;
      });

    } catch (err: unknown) {
      console.error(err);

      if (err instanceof AppError && err.statusCode) throw err;

      throw new AppError(400, ThemeResponses.THEME_CREATED_ERROR);
    }
  },

  async getByName(name: string) {
    const themes = await prisma.theme.findMany({
      where: {
        name: name
      },
      include: {
        images: true
      }
    });

    return themes.map(theme => ({
      ...theme,
      keyWords: onlyFinalKeywords(theme.keyWords)
    }));
  },

  async get(id: string): Promise<ThemeWithImages> {
    const result = await prisma.theme.findUnique({
      where: {
        id: id
      },
      include: {
        images: true
      }
    });

    if (!result) throw new AppError(404, ThemeResponses.THEME_NOT_FOUND);

    return {
      ...result,
      keyWords: onlyFinalKeywords(result.keyWords)
    };
  },

  async getAll() {
    const themes = await prisma.theme.findMany({
      include: {
        images: true
      }
    });

    return themes.map(theme => ({
      ...theme,
      keyWords: onlyFinalKeywords(theme.keyWords)
    }));
  },

  async getType(category: ThemeCategory): Promise<ThemeWithImages[]> {
    const themes = await prisma.theme.findMany({
      where: {
        category: category
      },
      include: {
        images: true
      }
    });

    return themes.map(theme => ({
      ...theme,
      keyWords: onlyFinalKeywords(theme.keyWords)
    }));
  },

  async search(payload: ThemeSearchPayload) {
    const keySearch = {
      keyWords: {
        hasSome: normalizeKeywords(payload.keyWords)
      }
    };

    const result = await prisma.theme.findMany({
      where: payload.filter && payload.filter.length > 0 ? {
        AND: [
          keySearch,
          {
            category: {
              in: payload.filter
            }
          }
        ]
      } : keySearch,
      include: {
        images: true
      }
    });

    return result.map(theme => ({
      ...theme,
      keyWords: onlyFinalKeywords(theme.keyWords)
    }));
  },

  async edit(id: string, formData: FormData): Promise<EditThemeResult> {
    try {
      return await prisma.$transaction(async (tx) => {
        const name = String(formData.get("name") || "").trim().normalize("NFC").toLowerCase();
        const category = formData.get("category") as ThemeCategory;

        const currentTheme = await tx.theme.findUnique({
          where: { id }
        });

        if (!currentTheme) throw new AppError(404, ThemeResponses.THEME_NOT_FOUND);

        const mainImagePayload = JSON.parse(
          String(formData.get("mainImage"))
        );

        let mainImageUrl: string;

        if (mainImagePayload?.isNew) {
          const file = formData.get("mainImageFile");

          if (!(file instanceof File)) throw new AppError(400, ServerResponses.INVALID_INPUT);

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

        updatedImages = await EditThemeImagesItems.editThemeImages(tx, currentTheme.id, images);

        return {
          themeId: currentTheme.id,
          updatedTheme,
          updatedImages
        }
      });

    } catch (err: unknown) {
      console.error(err);

      if (err instanceof AppError && err.statusCode) throw err;


      throw new AppError(400, ThemeResponses.THEME_UPDATED_ERROR);
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
      throw new AppError(400, ThemeResponses.THEME_DELETED_ERROR);
    };
  }
}