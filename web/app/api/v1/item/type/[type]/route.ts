import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: {
    type: ItemTypes;
  };
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const params = ctx.params;
  const type = params.type;

  ItemMiddleware.validateGetItemByType(type);

  return ItemController.getTypeItem(type)
})