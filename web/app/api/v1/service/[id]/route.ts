import { ServiceController } from "@/app/lib/controllers/service.controller";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;

  return await ServiceController.getService(id);
});

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;

  return await ServiceController.delete(id);
})

export const PUT = withError(async (req: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;
  
  const formData: FormData = await req.formData();

  return await ServiceController.edit(id, formData);
});