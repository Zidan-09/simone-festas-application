import { NextResponse } from "next/server";
import { ServerResponses } from "./utils/responses/serverResponses";

export function withError(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          message: err.message ?? ServerResponses.INTERNAL_ERROR
        },
        { status: err.statusCode ?? 500 }
      );
    }
  };
}
