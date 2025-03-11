"use client";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { CiLogout } from "react-icons/ci";
import { Bell, UserIcon, Settings, CreditCard, User } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useCallback } from "react";
import { getUser } from "@/actions/user.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Header = () => {
  const { user, isLoaded } = useUser();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      await getUser(userId); // Removed unused state update
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData(user.id);
    }
  }, [isLoaded, user, fetchUserData]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <header className="border-b border-zinc-800 flex justify-between items-center w-full bg-zinc-950 backdrop-blur-lg py-3 px-4">
      <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
        ANNEX
      </h2>

      <div className="flex items-center gap-6">
        <SignedIn>
          {user && (
            <div className="flex gap-6 items-center">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                <span className="sr-only">View notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 px-3 hover:bg-zinc-900"
                  >
                    <UserIcon className="h-5 w-5 text-zinc-300" />
                    <span className="text-zinc-300">{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300"
                >
                  <div className="px-2 py-1.5 text-sm font-medium">
                    <p className="text-zinc-400">Signed in as</p>
                    <p className="truncate">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                  >
                    <Link href="/account" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                  >
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                  >
                    <Link href="/billing" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <SignOutButton>
                    <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-zinc-800 focus:bg-zinc-800 hover:text-red-400 focus:text-red-400">
                      <CiLogout className="h-4 w-4 mr-2" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </SignedIn>
      </div>
    </header>
  );
};
export default Header;
