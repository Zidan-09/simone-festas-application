import { KitController } from "@/app/lib/controllers/kit.controller";
import { KitType } from "@/app/lib/utils/requests/event.request";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const kitType = searchParams.get("kitType");

  return await KitController.getThemeAndTables(kitType as KitType);
});