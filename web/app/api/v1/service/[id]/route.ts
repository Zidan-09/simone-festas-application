import { ServiceController } from "@/app/lib/controllers/service.controller";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: {
    id: string;
  };
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const params = ctx.params;
  const id = params.id;

  return await ServiceController.getService(id);
});

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const params = ctx.params;
  const id = params.id;

  return await ServiceController.delete(id);
})

export const PUT = withError(async (req: Request, ctx: RouteContext) => {
  const params = ctx.params;
  const id = params.id;
  
  const body = await req.json();

  return await ServiceController.edit(id, body);
});