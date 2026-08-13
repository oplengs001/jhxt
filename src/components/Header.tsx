"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ArrowRight, PhoneCall } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About JHXT", href: "/about" },
    { name: "Service Pillars", href: "/services" },
    { name: "Projects & Proof", href: "/projects" },
    { name: "Managed IT", href: "/managed-services" },
    { name: "Invoices", href: "/invoices" },
    { name: "Contact Us", href: "/contact" },
  ];

  if (pathname.startsWith("/invoices")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060b14]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-blue-950/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0f192e] border border-[#2563eb]/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-[#38bdf8]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2563eb] rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider font-serif text-white flex items-center gap-1">
                JHXT <span className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full inline-block" />
              </span>
              <span className="text-[10px] tracking-widest text-[#94a3b8] uppercase font-mono">
                IT Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#0f192e]/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white hover:opacity-90 transition-all shadow-lg shadow-[#2563eb]/20 hover:scale-105"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0f192e] border border-white/10 text-gray-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1120] border-b border-white/10 px-4 pt-4 pb-6 mt-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname === link.href
                  ? "bg-[#2563eb] text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-semibold text-sm shadow-md"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
