import { cookies } from "next/headers";
import { withError } from "@/app/lib/withError";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";
import { UserMiddleware } from "@/app/lib/middlewares/user.middleware";

export const GET = withError(async (_: Request) => {
  const token = (await cookies()).get("token");

  await UserMiddleware.admin(token);

  return ApiResponse.success();
});