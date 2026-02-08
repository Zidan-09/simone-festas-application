import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;

  return await ItemController.getVariantToModal(id);
});

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;

  await ItemMiddleware.validateDeleteVariant(id);

  return await ItemController.deleteVariant(id);
})