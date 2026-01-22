import { UserController } from "@/app/lib/controllers/user.controller";
import { UserMiddleware } from "@/app/lib/middlewares/user.middleware";
import { RegisterUser } from "@/app/lib/utils/requests/user.request";
import { withError } from "@/app/lib/withError"

export const POST = withError(async (req: Request) => {
  const body: RegisterUser = await req.json();

  await UserMiddleware.validateCreateUser(body);

  return await UserController.register(body);
});