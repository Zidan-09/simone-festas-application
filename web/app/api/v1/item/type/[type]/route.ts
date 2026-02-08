import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: Promise<{
    type: ItemTypes;
  }>;
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const { type } = await ctx.params;

  ItemMiddleware.validateGetItemByType(type);

  return ItemController.getTypeItem(type)
});