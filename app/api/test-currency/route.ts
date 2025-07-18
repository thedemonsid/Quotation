import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { currencyService } from "@/lib/currency";

export async function GET() {
  // Check authentication
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await currencyService.getExchangeRate();

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      requestedBy: userId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
