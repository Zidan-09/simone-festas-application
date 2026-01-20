import { cookies } from "next/headers";
import { UserController } from "@/app/lib/controllers/user.controller";
import { withError } from "@/app/lib/withError";

export const GET = withError(async (req: Request) => {
  const token = (await cookies()).get("token");

  return UserController.check(token);
});