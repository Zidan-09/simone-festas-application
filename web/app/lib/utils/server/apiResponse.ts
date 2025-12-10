import { NextResponse } from "next/server";

export class ApiResponse {
  static server<T>(success: boolean, message: string, status: number, data?: T) {
    return NextResponse.json({
      success,
      message,
      data
    }, {
      status
    })
  };

  static error() {
    return NextResponse.json({
      success: false,
      message: "server_error"
    }, {
      status: 500
    })
  }
}