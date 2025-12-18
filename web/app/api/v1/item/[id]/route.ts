import { ItemController } from "@/app/lib/controllers/itemController";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

export async function GET(_:Request, ctx: any) {
  try {
    const params = await ctx.params;
    const id = params.id;

    return await ItemController.getItem(id);

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}

export async function DELETE(_: Request, ctx: any) {
  try {
    const params = await ctx.params;
    const id = params.id;
    
    return await ItemController.delete(id);

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}