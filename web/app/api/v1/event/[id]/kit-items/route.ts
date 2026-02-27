import { EventController } from "@/app/lib/controllers/event.controller";
import { EventMiddleware } from "@/app/lib/middlewares/event.middleware";
import { ItemInput } from "@/app/lib/utils/requests/event.request";
import { withError } from "@/app/lib/withError";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const PUT = withError(async (req: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const body: ItemInput[] = await req.json();

  await EventMiddleware.validateAssembleEventKit(id, body);

  return await EventController.assembleEventKit(id, body);
});