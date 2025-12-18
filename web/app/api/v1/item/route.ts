import { ItemController } from "@/app/lib/controllers/itemController";
import { ItemMiddleware } from "@/app/lib/middlewares/itemMiddleware";
import { CreateItem, EditItem } from "@/app/lib/utils/requests/itemRequest";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const body: CreateItem = await req.json();

  await ItemMiddleware.validateCreateItem(body);

  return await ItemController.create(body);
});

export const GET = withError(async (_: Request) => {
  return await ItemController.getAll();
});

export const PATCH = withError(async (req: Request) => {
  const body: EditItem = await req.json();

  await ItemMiddleware.validateEditItem(body);

  return await ItemController.edit(body);
});