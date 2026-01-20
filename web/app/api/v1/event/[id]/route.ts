import { withError } from "@/app/lib/withError";

export const GET = withError(async (_: Request, ctx: any) => {
  const params = await ctx.params;
  const id = params.id;

  
});