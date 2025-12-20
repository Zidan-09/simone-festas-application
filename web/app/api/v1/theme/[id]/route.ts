import { ThemeController } from "@/app/lib/controllers/themeController";
import { ThemeMiddleware } from "@/app/lib/middlewares/themeMiddleware";
import { EditTheme } from "@/app/lib/utils/requests/themeRequest";
import { withError } from "@/app/lib/withError";

export const DELETE = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  
  await ThemeMiddleware.validateDeleteTheme(params.id);

  return await ThemeController.delete(params.id);
});

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;

  await ThemeMiddleware.validateGetTheme(params.id);

  return await ThemeController.getTheme(params.id);
});

export const PATCH = withError(async (req: Request, ctx: any) => {
  const params = await ctx.params;
  const body: EditTheme = await req.json();

  return await ThemeController.edit(params.id, body);
});