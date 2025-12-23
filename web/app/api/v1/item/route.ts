import { ItemController } from "@/app/lib/controllers/itemController";
import { ItemMiddleware } from "@/app/lib/middlewares/itemMiddleware";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  console.log("Entrou na rota");
  const formData: FormData = await req.formData();
  console.log("Coletou o input:", formData);

  await ItemMiddleware.validateCreateItem(formData);
  console.log("Passou no middleware");

  return await ItemController.create(formData);
});

export const GET = withError(async (_: Request) => {
  return await ItemController.getAll();
});

