import { ServiceController } from "@/app/lib/controllers/service.controller";
import { ServiceMiddleware } from "@/app/lib/middlewares/service.middleware";
import { CreateService } from "@/app/lib/utils/requests/serviceRequest";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const body: CreateService = await req.json();

  await ServiceMiddleware.validateCreateService(body);

  return await ServiceController.create(body)
});

export const GET = withError(async (_: Request) => {
  return await ServiceController.getAll();
});