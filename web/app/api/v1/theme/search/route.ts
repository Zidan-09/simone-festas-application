import { ThemeController } from "@/app/lib/controllers/themeController";
import { ThemeMiddleware } from "@/app/lib/middlewares/themeMiddleware";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  await ThemeMiddleware.validateThemeSearch(query);

  return await ThemeController.search(query);
});