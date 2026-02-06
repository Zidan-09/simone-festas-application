import { cookies } from "next/headers";
import { EventController } from "@/app/lib/controllers/event.controller";
import { EventPayload } from "@/app/lib/utils/requests/event.request";
import { withError } from "@/app/lib/withError";
import { UserMiddleware } from "@/app/lib/middlewares/user.middleware";
import { EventMiddleware } from "@/app/lib/middlewares/event.middleware";

type RouteContext = {
  params: {
    id: string;
  };
};

export const GET = withError(async (_: Request, ctx: RouteContext) => {
  const token = (await cookies()).get("token");
  const params = ctx.params;
  const id = params.id;

  await UserMiddleware.authUser(token);

  return await EventController.get(id);
});

export const PUT = withError(async (req: Request) => {
  const token = (await cookies()).get("token");
  const body: EventPayload = await req.json();

  await UserMiddleware.authUser(token);

  await EventMiddleware.validateEditEvent(body, token!);

  switch (body.eventType) {
    case "ITEMS":
      await EventMiddleware.validateItemReserve(body.items, body.event.eventDate);
      break;

    case "KIT":
      await EventMiddleware.validateKitReserve(body.kitType, body.tables, body.theme, body.event.eventDate);
      break;

    case "TABLE":
      await EventMiddleware.validateTableReserve(body.colorToneId, body.numberOfPeople);
      break;
  };

  return await EventController.edit(body);
});

export const DELETE = withError(async (_: Request, ctx: RouteContext) => {
  const token = (await cookies()).get("token");
  const params = ctx.params;
  const id = params.id;

  await UserMiddleware.authUser(token);

  return await EventController.cancel(id);
});