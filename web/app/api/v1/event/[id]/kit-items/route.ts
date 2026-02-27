import { EventController } from "@/app/lib/controllers/event.controller";
import { EventMiddleware } from "@/app/lib/middlewares/event.middleware";
import { ItemInput } from "@/app/lib/dto/event.request";
import { withError } from "@/app/lib/withError";
import { EventService } from "@/app/lib/services/event.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const PUT = withError(async (req: Request, ctx: RouteContext) => {
  const { id } = await ctx.params;
  const body: ItemInput[] = await req.json();

  await EventMiddleware.validateAssembleEventKit(id, body);

  const event = await EventService.get(id);

  await EventMiddleware.validateStockAvailability(body, event.eventDate?.toISOString() ?? "");

  return await EventController.assembleEventKit(id, body);
});