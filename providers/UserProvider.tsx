"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUser } from "@/actions/user.actions";

type SubscriptionTier = "free" | "basic";

type UserContextType = {
  isAuthenticated: boolean;
  tier: SubscriptionTier;
  createdAt: string | null;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      getUser(user.id).then((data) => {
        if (data) {
          setTier(data.subscriptionTier || "free");
          setCreatedAt(data.createdAt); // Assumes your DB record includes createdAt as a string
        }
      });
    }
  }, [isLoaded, user]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: !!user,
        tier,
        createdAt,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
