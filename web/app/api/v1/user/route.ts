import { cookies } from "next/headers";
import { UserController } from "@/app/lib/controllers/user.controller";
import { AppError, withError } from "@/app/lib/withError";
import { UserResponses } from "@/app/lib/utils/responses/userResponses";

export const GET = withError(async (_: Request) => {
  const token = (await cookies()).get("token");

  if (!token?.value) throw new AppError(403, UserResponses.USER_FORBIDDEN);

  return await UserController.get(token.value);
});