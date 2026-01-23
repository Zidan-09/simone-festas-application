import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const type = params.type;

  ItemMiddleware.validateGetItemByType(type);

  return ItemController.getTypeItem(type)
})