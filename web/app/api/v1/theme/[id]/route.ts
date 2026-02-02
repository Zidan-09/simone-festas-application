import { ThemeController } from "@/app/lib/controllers/theme.controller";
import { ThemeMiddleware } from "@/app/lib/middlewares/theme.middleware";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: {
    id: string;
  };
};

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const params = ctx.params;
  
  await ThemeMiddleware.validateDeleteTheme(params.id);

  return await ThemeController.delete(params.id);
});

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const params = ctx.params;

  await ThemeMiddleware.validateGetTheme(params.id);

  return await ThemeController.getTheme(params.id);
});

export const PATCH = withError(async (req: Request, ctx: RouteContext) => {
  const params = ctx.params;
  const formData: FormData = await req.json();

  return await ThemeController.edit(params.id, formData);
});