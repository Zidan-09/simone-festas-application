import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data?: T, message = "ok", status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data
      },
      { status }
    );
  }
}