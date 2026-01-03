import { ThemeController } from "@/app/lib/controllers/themeController";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const formData: FormData = await req.json();

  return await ThemeController.create(formData);
});

export const GET = withError(async (_: Request) => {
  return await ThemeController.getAll();
});