import { ServiceController } from "@/app/lib/controllers/serviceController";
import { ServiceMiddleware } from "@/app/lib/middlewares/serviceMiddleware";
import { ServiceSearchPayload } from "@/app/lib/services/serviceService";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const queryPayload: ServiceSearchPayload = await req.json();

  await ServiceMiddleware.validateServiceSearch(queryPayload)

  return await ServiceController.search(queryPayload);
});