// hooks/useAuth.ts
import { useUser } from "@clerk/nextjs";

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return {
    user,
    isLoaded,
    isSignedIn,
    isLoading: !isLoaded,
    userEmail: user?.emailAddresses[0]?.emailAddress,
    userName: user?.fullName || user?.firstName || "User",
    userInitials: user?.firstName?.[0] + (user?.lastName?.[0] || ""),
  };
};
