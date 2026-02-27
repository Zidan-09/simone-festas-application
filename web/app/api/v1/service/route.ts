import { ServiceController } from "@/app/lib/controllers/service.controller";
import { ServiceMiddleware } from "@/app/lib/middlewares/service.middleware";
import { KitType } from "@/app/lib/dto/event.request";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const formData: FormData = await req.formData();

  await ServiceMiddleware.validateCreateService(formData);

  return await ServiceController.create(formData)
});

export const GET = withError(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const kitType = searchParams.get("kitType") as KitType;

  return await ServiceController.getAll(kitType);
});