"use client";
import { SignedIn, UserButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Shield, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // After sign out, redirect to sign-in page
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <p>
              Your email address is not authorized to access this application.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Please contact your administrator to request access, or sign in
              with an approved email address.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <SignedIn>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-600">
                Currently signed in as:
              </span>
              <UserButton />
            </div>
          </SignedIn>

          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign out and sign in with other account
          </Button>
        </div>
      </div>
    </div>
  );
}
