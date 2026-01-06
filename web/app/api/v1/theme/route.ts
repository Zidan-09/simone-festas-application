import { ThemeController } from "@/app/lib/controllers/themeController";
import { ThemeMiddleware } from "@/app/lib/middlewares/themeMiddleware";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const formData: FormData = await req.formData();

  await ThemeMiddleware.validateCreateTheme(formData);

  return await ThemeController.create(formData);
});

export const GET = withError(async (_: Request) => {
  return await ThemeController.getAll();
});