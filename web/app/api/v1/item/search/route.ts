import { ItemController } from "@/app/lib/controllers/itemController";
import { ItemMiddleware } from "@/app/lib/middlewares/itemMiddleware";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  await ItemMiddleware.validateItemSearch(query);

  return await ItemController.search(query);
});