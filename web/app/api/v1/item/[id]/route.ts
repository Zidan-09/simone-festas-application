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

  return await ItemController.getItem(id);
});

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;

  await ItemMiddleware.validateDeleteItem(id);

  return await ItemController.delete(id);
});

export const PUT = withError(async (req: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;
  
  const formData: FormData = await req.formData();

  await ItemMiddleware.validateEditItem(id);

  return await ItemController.edit(id, formData);
});