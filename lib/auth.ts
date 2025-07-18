// lib/auth.ts
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Check if a user's email is in the approved list
 */
export async function isEmailApproved(userId: string): Promise<boolean> {
  try {
    const approvedEmails =
      process.env.APPROVED_EMAILS?.split(",").map((email) => email.trim()) ||
      [];

    // If no approved emails are configured, allow all users
    if (approvedEmails.length === 0) {
      return true;
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;

    return userEmail ? approvedEmails.includes(userEmail) : false;
  } catch (error) {
    console.error("Error checking email approval:", error);
    return false;
  }
}

/**
 * Get the list of approved emails from environment
 */
export function getApprovedEmails(): string[] {
  return (
    process.env.APPROVED_EMAILS?.split(",").map((email) => email.trim()) || []
  );
}

/**
 * Client-side hook to check if current user is approved
 */
export async function checkCurrentUserApproval(): Promise<{
  isApproved: boolean;
  email?: string;
}> {
  try {
    const response = await fetch("/api/check-approval");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking user approval:", error);
    return { isApproved: false };
  }
}
