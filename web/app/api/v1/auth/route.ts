import { cookies } from "next/headers";
import { UserController } from "@/app/lib/controllers/user.controller";
import { UserMiddleware } from "@/app/lib/middlewares/user.middleware";
import { LoginUser } from "@/app/lib/utils/requests/user.request";
import { withError } from "@/app/lib/withError"

export const POST = withError(async (req: Request) => {
  const body: LoginUser = await req.json();

  await UserMiddleware.validateLoginUser(body);

  return await UserController.login(body);
});