import { UserController } from "@/app/lib/controllers/userController";
import type { Register } from "@/app/lib/utils/requests/userRequest";
import { UserResponses } from "@/app/lib/utils/responses/userResponses";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

export async function POST(req: Request) {
  try {
    const body: Register = await req.json();
    const { name, username, address, contact, cpf, email, password } = body;

    const result = await UserController.register(
      name,
      username,
      address,
      contact,
      cpf,
      email,
      password,
    );

    return ApiResponse.server(true, UserResponses.REGISTER, 201, result);

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}