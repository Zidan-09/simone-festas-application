import { UserController } from "@/app/lib/controllers/userController";
import { RegisterUser } from "@/app/lib/utils/requests/userRequest";
import { withError } from "@/app/lib/withError"

export const POST = withError(async (req: Request) => {
  const body: RegisterUser = await req.json();

  return await UserController.register(body);
});