import { ThemeController } from "@/app/lib/controllers/theme.controller";
import { ThemeMiddleware } from "@/app/lib/middlewares/theme.middleware";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;
  
  await ThemeMiddleware.validateDeleteTheme(id);

  return await ThemeController.delete(id);
});

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;

  await ThemeMiddleware.validateGetTheme(id);

  return await ThemeController.getTheme(id);
});

export const PATCH = withError(async (req: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const formData: FormData = await req.json();

  return await ThemeController.edit(id, formData);
});