import { ThemeController } from "@/app/lib/controllers/theme.controller";
import { ThemeMiddleware } from "@/app/lib/middlewares/theme.middleware";
import { ThemeSearchPayload } from "@/app/lib/services/theme.service";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const query: ThemeSearchPayload = await req.json();

  await ThemeMiddleware.validateThemeSearch(query);

  return await ThemeController.search(query);
});