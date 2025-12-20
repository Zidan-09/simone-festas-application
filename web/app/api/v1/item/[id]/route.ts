import { ItemController } from "@/app/lib/controllers/itemController";
import { ItemMiddleware } from "@/app/lib/middlewares/itemMiddleware";
import { EditItem } from "@/app/lib/utils/requests/itemRequest";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  return await ItemController.getItem(id);
});

export const DELETE = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  await ItemMiddleware.validateDeleteItem(id);

  return await ItemController.delete(id);
});

export const PATCH = withError(async (req: Request, ctx: any) => {
  const params = await ctx.params;
  const body: EditItem = await req.json();

  await ItemMiddleware.validateEditItem(params.id, body);

  return await ItemController.edit(params.id, body);
});