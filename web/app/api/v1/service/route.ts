import { ServiceController } from "@/app/lib/controllers/serviceController";
import { ServiceMiddleware } from "@/app/lib/middlewares/serviceMiddleware";
import { CreateService } from "@/app/lib/utils/requests/serviceRequest";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const body: CreateService = await req.json();

  await ServiceMiddleware.validateCreateService(body);

  return await ServiceController.create(body)
});