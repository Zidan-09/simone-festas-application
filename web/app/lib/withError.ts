import { NextResponse } from "next/server";
import { ServerResponses } from "./utils/responses/serverResponses";

type RouteHandler<C = unknown> = (
  req: Request,
  ctx: C
) => Promise<Response>;

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
  }
}

export function withError<C>(
  handler: RouteHandler<C>
): RouteHandler<C> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);

    } catch (err: unknown) {
      
      if (err instanceof AppError) return NextResponse.json(
        {
          success: false,
          message: err.message
        },
        { status: err.statusCode }
      );

      return NextResponse.json(
        {
          success: false,
          message: ServerResponses.INTERNAL_ERROR
        },
        { status: 500 }
      );
    }
  };
}