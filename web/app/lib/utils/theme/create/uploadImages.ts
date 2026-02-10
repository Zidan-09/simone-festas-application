import { ImagePayload } from "@/app/lib/services/theme.service";
import { put } from "@vercel/blob";
import { AppError } from "@/app/lib/withError";
import { ServerResponses } from "../../responses/serverResponses";

export const UploadImages = {
  async uploadMainImage(themeId: string, file: File) {
    return await put(
      `themes/${themeId}/main-${crypto.randomUUID()}-${file.name}`,
      file,
      { access: "public" }
    )
  },

  async uploadSecondaryImages(themeId: string, images: ImagePayload[], formData: FormData) {
    return await Promise.all(
      images.map(async (img) => {
        const file = formData.get(img.key!);

        if (!(file instanceof File)) throw new AppError(400, ServerResponses.INVALID_INPUT);
        
        const blob = await put(
          `themes/${themeId}/${crypto.randomUUID()}-${file.name}`,
          file,
          { access: "public" }
        );

        return {
          themeId: themeId,
          url: blob.url
        };
      })
    );
  }
}