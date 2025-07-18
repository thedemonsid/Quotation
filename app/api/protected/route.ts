import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Example of authenticated API route
  return NextResponse.json({
    message: "This is a protected API route",
    userId,
    timestamp: new Date().toISOString(),
  });
}
