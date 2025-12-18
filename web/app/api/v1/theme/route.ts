import { ThemeController } from "@/app/lib/controllers/themeController";
import { CreateTheme } from "@/app/lib/utils/requests/themeRequest";
import { withError } from "@/app/lib/withError";

export const POST = withError(async (req: Request) => {
  const body: CreateTheme = await req.json();

  return await ThemeController.create(body);
});

async function GET(req: Request) {
  
}

async function PUT(req: Request) {
  
}

async function DELETE(req: Request) {
  
}