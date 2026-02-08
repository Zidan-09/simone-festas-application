import { ThemeController } from "@/app/lib/controllers/theme.controller";
import { ThemeMiddleware } from "@/app/lib/middlewares/theme.middleware";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: Promise<{
    category: ThemeCategory;
  }>;
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const { category } = await ctx.params;

  await ThemeMiddleware.validateGetByCategory(category);

  return await ThemeController.getCategoryThemes(category);
});