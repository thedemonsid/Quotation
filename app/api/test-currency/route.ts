import { NextResponse } from "next/server";
import { currencyService } from "@/lib/currency";

export async function GET() {
  try {
    const result = await currencyService.getExchangeRate();

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
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
