import { ThemeController } from "@/app/lib/controllers/themeController";
import { ApiResponse } from "@/app/lib/utils/server/apiResponse";

async function POST(req: Request) {
  try {
    const body = req.json();

  } catch (err) {
    console.error(err);
    return ApiResponse.error();
  }
}

async function GET(req: Request) {
  
}

async function PUT(req: Request) {
  
}

async function DELETE(req: Request) {
  
}

export { POST, GET, PUT, DELETE }