import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/quotation-template(.*)",
  "/api/(.*)", // Protect all API routes by default
]);

const isPublicRoute = createRouteMatcher([
  "/unauthorized",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)", // Clerk webhooks (if you use them)
  "/api/health(.*)", // Health check endpoints (if you have them)
]);

export default clerkMiddleware(async (auth, req) => {
  // Get the current user
  const { userId } = await auth();

  // Allow public routes without any checks
  if (isPublicRoute(req)) {
    return;
  }

  // If user is trying to access a protected route
  if (isProtectedRoute(req)) {
    // If not signed in, redirect to sign-in
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Check if user's email is approved
    const approvedEmails =
      process.env.APPROVED_EMAILS?.split(",").map((email) => email.trim()) ||
      [];

    if (approvedEmails.length > 0) {
      try {
        // Get user information to check email
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses?.[0]?.emailAddress;

        if (!userEmail || !approvedEmails.includes(userEmail)) {
          // User's email is not approved, redirect to unauthorized page
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      } catch (error) {
        console.error("Error checking user email:", error);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
