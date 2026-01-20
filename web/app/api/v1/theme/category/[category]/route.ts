import { ThemeController } from "@/app/lib/controllers/theme.controller";
import { ThemeMiddleware } from "@/app/lib/middlewares/theme.middleware";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;

  await ThemeMiddleware.validateGetByCategory(params.category);

  return await ThemeController.getCategoryThemes(params.category);
});