import { EventController } from "@/app/lib/controllers/event.controller";
import { EventMiddleware } from "@/app/lib/middlewares/event.middleware";
import { EventPayload } from "@/app/lib/utils/requests/event.request";
import { withError } from "@/app/lib/withError";
import { cookies } from "next/headers";

export const POST = withError(async (req: Request) => {
  const token = (await cookies()).get("token");
  const body: EventPayload = await req.json();

  await EventMiddleware.validateCreateEvent(body, token);

  return EventController.create(body, token!);
});

export const GET = withError(async (_: Request) => {
  return EventController.getAll();
});