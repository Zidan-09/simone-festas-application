import { ServiceController } from "@/app/lib/controllers/serviceController";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  return await ServiceController.getService(id);
});

export const DELETE = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  return await ServiceController.delete(id);
})

export const PUT = withError(async (req: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;
  
  const body = await req.json();

  return await ServiceController.edit(id, body);
});