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

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
    },
    {
      name: "Ask",
      href: "/ask",
      icon: MessageCircle,
    },
    {
      name: "News",
      href: "/news",
      icon: Newspaper,
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: Wallet,
    },
  ];

  return (
    <div className="hidden md:flex h-screen w-56 flex-col bg-zinc-950/95 border-r border-zinc-800 fixed left-0 top-0">
      {/* Logo/Header */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
          ANNEX
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-zinc-800/70 text-teal-400"
                      : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-5 rounded-full bg-teal-400"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500">
          <p>© 2025 ANNEX</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
