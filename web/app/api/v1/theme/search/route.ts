import { ThemeController } from "@/app/lib/controllers/themeController";
import { ThemeMiddleware } from "@/app/lib/middlewares/themeMiddleware";
import { ThemeSearchPayload } from "@/app/lib/services/themeService";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const query: ThemeSearchPayload = await req.json();

  await ThemeMiddleware.validateThemeSearch(query);

  return await ThemeController.search(query);
});