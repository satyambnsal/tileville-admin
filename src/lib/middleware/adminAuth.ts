import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

export function adminAuth(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest) => {
    const adminToken = request.headers.get("x-admin-token");

    if (!adminToken || adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request);
  };
}
