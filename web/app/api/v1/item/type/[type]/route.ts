import { ItemController } from "@/app/lib/controllers/itemController";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;

  return ItemController.getTypeItem(params.type)
})