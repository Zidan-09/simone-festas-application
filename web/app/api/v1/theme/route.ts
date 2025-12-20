import { ThemeController } from "@/app/lib/controllers/themeController";
import { CreateTheme } from "@/app/lib/utils/requests/themeRequest";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const body: CreateTheme = await req.json();

  return await ThemeController.create(body);
});

export const GET = withError(async (_: Request) => {
  return await ThemeController.getAll();
});