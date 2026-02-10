import { UserController } from "@/app/lib/controllers/user.controller";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (_: Request) => {
  return await UserController.logout();
});