import { UserController } from "@/app/lib/controllers/userController";
import type { Login } from "@/app/lib/utils/requests/userRequest";
import { UserResponses } from "@/app/lib/utils/responses/userResponses";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

export async function POST(req: Request) {
  try {
    const body: Login = await req.json();

    const { login, password } = body;

    const result = UserController.login(login, password);

    return ApiResponse.server(true, UserResponses.LOGIN, 201, result);

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}