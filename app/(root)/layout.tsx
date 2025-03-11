import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import Sidebar from "@/components/shared/Sidebar";
import BottomBar from "@/components/shared/BottomBar";
import Header from "@/components/shared/Header";
import { UserProvider } from "@/providers/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Make more confident choices",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <UserProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-zinc-100`}
          >
            <Toaster position="top-right" reverseOrder={false} />

            <div className="flex flex-col min-h-screen">
              {/* Header always at the top */}
              <Header />

              {/* Main area */}
              <div className="flex flex-1 w-full">
                {/* Sidebar visible on md and larger screens */}
                <aside className="hidden md:block">
                  <Sidebar />
                </aside>

                {/* Main Content Area with left margin on md+ screens */}
                <main className="flex-1 w-full md:ml-56 overflow-auto p-3">
                  {children}
                </main>
              </div>

              {/* Bottom Bar visible on mobile screens */}
              <div className="md:hidden w-full border-t border-zinc-800 bg-zinc-900">
                <BottomBar />
              </div>
            </div>
          </body>
        </html>
      </UserProvider>
    </ClerkProvider>
  );
}
