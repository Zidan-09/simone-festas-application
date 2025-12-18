import { ItemController } from "@/app/lib/controllers/itemController";
import { EditItem } from "@/app/lib/utils/requests/itemRequest";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    return await ItemController.create(body);

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}

export async function GET(_: Request) {
  try {
    return await ItemController.getAll();
    
  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}

export async function PATCH(req: Request) {
  try {
    const body: EditItem = await req.json();

    return await ItemController.edit(body);

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}