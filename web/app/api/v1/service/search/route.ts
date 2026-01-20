import { ServiceController } from "@/app/lib/controllers/service.controller";
import { ServiceMiddleware } from "@/app/lib/middlewares/service.middleware";
import { ServiceSearchPayload } from "@/app/lib/services/service.service";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const queryPayload: ServiceSearchPayload = await req.json();

  await ServiceMiddleware.validateServiceSearch(queryPayload)

  return await ServiceController.search(queryPayload);
});