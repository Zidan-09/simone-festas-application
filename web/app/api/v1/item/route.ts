import { ItemController } from "@/app/lib/controllers/item.controller";
import { ItemMiddleware } from "@/app/lib/middlewares/item.middleware";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const formData: FormData = await req.formData();

  await ItemMiddleware.validateCreateItem(formData);

  return await ItemController.create(formData);
});

export const GET = withError(async (_: Request) => {
  return await ItemController.getAll();
});

