"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Target,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Plus,
  Badge,
  ShieldCheck,
  Truck,
  ClipboardList,
} from "lucide-react";

export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: "ADMIN" | "SALES" } | null>(null);

  // If on login page or client portal page, render children without sidebar
  const isLoginPage = pathname === "/invoices/login";
  const isPortalPage = pathname.startsWith("/invoices/portal");

  useEffect(() => {
    if (isLoginPage || isPortalPage) return;

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/invoices/login");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push("/invoices/login");
      });
  }, [pathname, isLoginPage, isPortalPage, router]);

  if (isLoginPage || isPortalPage) {
    return <div className="min-h-screen bg-[#060b14] text-gray-100">{children}</div>;
  }

  const navItems = [
    { name: "Invoices", href: "/invoices", icon: LayoutDashboard },
    { name: "Clients", href: "/invoices/clients", icon: Users },
    { name: "Warranty & Turnover", href: "/invoices/warranty", icon: ShieldCheck },
    { name: "Delivery Notes", href: "/invoices/delivery-notes", icon: Truck },
    { name: "Purchase Orders", href: "/invoices/purchase-orders", icon: ClipboardList },
    { name: "Sales Leads", href: "/invoices/leads", icon: Target },
    { name: "Saved Items", href: "/invoices/items", icon: Package },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/invoices/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#060b14] text-gray-100 font-sans">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-[#0a1120] border-r border-white/10 flex flex-col z-40 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#06b6d4] flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-serif tracking-wider text-white">
                JHXTES Portal
              </span>
              <span className="text-[9px] tracking-widest text-[#38bdf8] uppercase font-mono">
                CRM & Invoicing Module
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 border-b border-white/5 space-y-2">
          <Link
            href="/invoices/new"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-xs shadow-lg shadow-[#2563eb]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/invoices"
                ? pathname === "/invoices" ||
                  (pathname.startsWith("/invoices/") &&
                    !pathname.startsWith("/invoices/leads") &&
                    !pathname.startsWith("/invoices/clients") &&
                    !pathname.startsWith("/invoices/items") &&
                    !pathname.startsWith("/invoices/login") &&
                    !pathname.startsWith("/invoices/portal") &&
                    !pathname.startsWith("/invoices/new") &&
                    !pathname.startsWith("/invoices/warranty") &&
                    !pathname.startsWith("/invoices/delivery-notes") &&
                    !pathname.startsWith("/invoices/purchase-orders"))
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/30 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          {user && (
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white truncate">{user.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#38bdf8] transition-colors"
            >
              Main Site <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar on mobile */}
        <header className="h-14 bg-[#0a1120] border-b border-white/10 flex items-center justify-between px-4 md:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#38bdf8]" />
            <span className="font-bold text-white text-sm font-serif">JHXTES Portal</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-gray-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
