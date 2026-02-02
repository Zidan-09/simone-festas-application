import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: {
    id: string;
  };
};

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const params = ctx.params;

  await ItemMiddleware.validateDeleteVariant(params.id);

  return await ItemController.deleteVariant(params.id);
})