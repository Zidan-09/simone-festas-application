import { ServiceController } from "@/app/lib/controllers/service.controller";
import { ServiceMiddleware } from "@/app/lib/middlewares/service.middleware";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const formData: FormData = await req.formData();

  await ServiceMiddleware.validateCreateService(formData);

  return await ServiceController.create(formData)
});

export const GET = withError(async (_: Request) => {
  return await ServiceController.getAll();
});