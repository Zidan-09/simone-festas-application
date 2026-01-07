import { ItemController } from "@/app/lib/controllers/itemController";
import { ItemMiddleware } from "@/app/lib/middlewares/itemMiddleware";
import { ItemSearchPayload } from "@/app/lib/services/itemService";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const queryPayload: ItemSearchPayload = await req.json();

  await ItemMiddleware.validateItemSearch(queryPayload);

  return await ItemController.search(queryPayload);
});