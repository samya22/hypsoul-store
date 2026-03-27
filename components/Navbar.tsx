"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [cartOpen, setCartOpen] = useCartDrawer();
  const { user, fetchUser, logout } = useAuthStore();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-bg-primary/98 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading font-black text-xl md:text-2xl tracking-tight text-white hover:text-accent transition-colors"
          >
            HYPSOUL<span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${
                    pathname === href
                      ? "text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* User icon */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  if (!user) {
                    router.push("/login");
                  } else {
                    setUserMenuOpen(!userMenuOpen);
                  }
                }}
                className="p-2.5 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
                aria-label="Account"
              >
                <UserIcon />
              </button>

              {/* Dropdown */}
              {user && userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-border rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-text-muted text-xs truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-white/5 text-sm transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Account
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-white hover:bg-white/5 text-sm transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-red-400 hover:bg-red-400/5 text-sm transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Cart"
            >
              <BagIcon />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Menu"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-20 border-b border-border" : "max-h-0"
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-3">
            <form
              action="/shop"
              method="GET"
              className="flex items-center gap-3 bg-white/5 border border-border rounded-lg px-4 py-2.5"
            >
              <SearchIcon className="text-text-secondary shrink-0" />
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sneakers, brands, styles..."
                autoFocus={searchOpen}
                className="flex-1 bg-transparent text-white placeholder-text-muted text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-text-secondary hover:text-white"
                >
                  <XIcon size={16} />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ${
            menuOpen ? "max-h-64 border-b border-border" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-5 py-4 gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block py-3 text-sm font-medium uppercase tracking-widest border-b border-border/50 transition-colors ${
                    pathname === href
                      ? "text-white"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link href="/account" className="block py-3 text-sm font-medium uppercase tracking-widest border-b border-border/50 text-text-secondary hover:text-white transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="block w-full text-left py-3 text-sm font-medium uppercase tracking-widest text-text-secondary hover:text-red-400 transition-colors">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="block py-3 text-sm font-medium uppercase tracking-widest border-b border-border/50 text-text-secondary hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

// Cart drawer hook
import { create } from "zustand";

interface DrawerStore {
  open: boolean;
  setOpen: (v: boolean) => void;
}
export const useCartDrawerStore = create<DrawerStore>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));

function useCartDrawer(): [boolean, (v: boolean) => void] {
  const { open, setOpen } = useCartDrawerStore();
  return [open, setOpen];
}

// Icons
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
