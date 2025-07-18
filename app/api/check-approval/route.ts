import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isEmailApproved } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isApproved = await isEmailApproved(userId);

    // Get user email for display purposes
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress;

    return NextResponse.json({
      isApproved,
      email,
      userId,
    });
  } catch (error) {
    console.error("Error checking user approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
