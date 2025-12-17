import { ItemController } from "@/app/lib/controllers/itemController";
import { CreateItem } from "@/app/lib/utils/requests/itemRequest";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, type, price }: CreateItem = body;

  try {
    return await ItemController.create(name, description, type, price);

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