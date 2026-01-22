import { EventController } from "@/app/lib/controllers/event.controller";
import { EventPayload } from "@/app/lib/utils/requests/event.request";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  return await EventController.get(id);
});

export const PUT = withError(async (req: Request) => {
  const body: EventPayload = await req.json();

  return await EventController.edit(body);
});

export const DELETE = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  return await EventController.delete(id);
});