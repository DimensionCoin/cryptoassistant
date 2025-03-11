"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  MessageCircle,
  Newspaper,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

const BottomBar = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // This ensures animations only start after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      position: 1,
    },
    { name: "Search", href: "/search", icon: Search, position: 2 },
    {
      name: "Ask",
      href: "/ask",
      icon: MessageCircle,
      position: 3,
      isCenter: true,
    },
    { name: "News", href: "/news", icon: Newspaper, position: 4 },
    { name: "Wallet", href: "/wallet", icon: Wallet, position: 5 },
  ];

  const isActiveAsk = pathname === "/ask";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Main bottom bar */}
      <div className="relative h-16">
        {/* Background bar with frosted glass effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-800">
          <nav className="grid grid-cols-5 h-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              if (item.isCenter) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-center"
                  >
                    {/* Empty space for the floating button */}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "text-teal-400 scale-110"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Ask button - elevated above the bar */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/3 z-10">
          {/* Animated rings and glow effects when active */}
          {isActiveAsk && mounted && (
            <>
              {/* Multiple animated rings with different delays */}
              <div className="absolute inset-0 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] bg-teal-500 opacity-10 h-full w-full"></div>
              <div className="absolute inset-0 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s] bg-cyan-500 opacity-10 h-full w-full"></div>
              <div className="absolute inset-0 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s] bg-teal-400 opacity-10 h-full w-full"></div>

              {/* Rotating gradient border */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-violet-500 opacity-70 blur-sm animate-[spin_16s_linear_infinite]"></div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 via-teal-500 to-cyan-400 opacity-70 blur-sm animate-[spin_16s_linear_infinite_reverse]"></div>

              {/* Floating particles */}
              <div className="absolute -inset-8 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-teal-400 opacity-80"
                    style={{
                      left: `${30 + i * 8}%`,
                      top: `${70 - i * 12}%`,
                      animation: `float 16s ease-in-out infinite ${i * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
            </>
          )}

          <Link
            href="/ask"
            className={`relative flex items-center justify-center h-14 w-14 rounded-full ${
              isActiveAsk
                ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
            } transition-all duration-300 hover:scale-110`}
            aria-label="Ask"
          >
            <MessageCircle className="h-7 w-7 text-white" strokeWidth={2.5} />

            {/* Inner glow effect */}
            {isActiveAsk && (
              <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
            )}
          </Link>
        </div>
      </div>

      {/* Custom keyframes for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default BottomBar;
