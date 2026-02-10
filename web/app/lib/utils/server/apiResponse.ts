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
  };

  static token(token: string, message = "ok", status = 200) {
    const res = NextResponse.json({
      success: true,
      message
    }, {
      status
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return res;
  }
}