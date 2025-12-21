import { ThemeController } from "@/app/lib/controllers/themeController";
import { ThemeMiddleware } from "@/app/lib/middlewares/themeMiddleware";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;

  await ThemeMiddleware.validateGetByCategory(params.category);

  return await ThemeController.getCategoryThemes(params.category);
});