import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { ItemSearchPayload } from "@/app/lib/services/item.service";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const queryPayload: ItemSearchPayload = await req.json();

  await ItemMiddleware.validateItemSearch(queryPayload);

  return await ItemController.search(queryPayload);
});