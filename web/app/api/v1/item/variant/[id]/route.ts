import { ItemController } from "@/app/lib/controllers/itemController";
import { ItemMiddleware } from "@/app/lib/middlewares/itemMiddleware";
import { withError } from "@/app/lib/withError";

export const DELETE = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;

  await ItemMiddleware.validateDeleteVariant(params.id);

  return await ItemController.deleteVariant(params.id);
})