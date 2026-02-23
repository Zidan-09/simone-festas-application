import { EventController } from "@/app/lib/controllers/event.controller";
import { EventMiddleware } from "@/app/lib/middlewares/event.middleware";
import { UserMiddleware } from "@/app/lib/middlewares/user.middleware";
import { EventPayload } from "@/app/lib/utils/requests/event.request";
import { withError } from "@/app/lib/withError";
import { cookies } from "next/headers";

export const POST = withError(async (req: Request) => {
  const token = (await cookies()).get("token");
  const body: EventPayload = await req.json();

  await UserMiddleware.authUser(token);

  await EventMiddleware.validateCreateEvent(body);

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

  return EventController.create(body, token!);
});

export const GET = withError(async (req: Request) => {
  const token = (await cookies()).get("token");
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");
  console.log(token);

  await UserMiddleware.authUser(token);
  
  if (scope === "me") return EventController.getMine(token!);

  await UserMiddleware.admin(token);

  return EventController.getAll();
});