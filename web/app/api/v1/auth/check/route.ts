import { cookies } from "next/headers";
import { withError } from "@/app/lib/withError";
import { UserMiddleware } from "@/app/lib/middlewares/user.middleware";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

export const GET = withError(async (req: Request) => {
  const token = (await cookies()).get("token");

  await UserMiddleware.authUser(token);

  return ApiResponse.success();
});