"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Menu, MessageCircle, UserCheck, X } from "lucide-react";
import { ThemeToggle } from "@/src/components/auth/theme-toggle";
import {
  STORE_CONTACT_CONFIG,
  STORE_NAV_LINKS,
} from "@/src/components/landing/store-config";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "border-b border-border bg-surface/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
          : "border-b border-transparent bg-background/85 backdrop-blur-xs"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Identity: ELSORY STORE Logo + Authorized Badge */}
        <Link
          href="#hero"
          onClick={closeMobileMenu}
          aria-label="ELSORY STORE - السوري ستور - الرئيسية"
          className="group inline-flex items-center gap-3 focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
        >
          <div className="inline-flex items-center justify-center rounded-xl bg-[#F5F5F5] p-2 shadow-2xs ring-1 ring-black/5 dark:ring-white/15 transition-transform duration-200 group-hover:scale-[1.02]">
            <Image
              src="/images/elsory-logo.png"
              alt="شعار ELSORY STORE - السوري ستور"
              width={513}
              height={468}
              loading="eager"
              className="h-9 w-auto sm:h-10 object-contain select-none"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-wide text-foreground">
              ELSORY STORE
            </span>
            <span className="text-[11px] font-medium text-muted">
              السوري ستور • موزع معتمد لمنتجات Apple
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden xl:flex items-center gap-1"
        >
          {STORE_NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right/End Actions: Theme Toggle + WhatsApp Contact Button + Staff Login + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />

          {/* WhatsApp Contact Button */}
          <a
            href={STORE_CONTACT_CONFIG.whatsappHref}
            className="group hidden sm:inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-4 text-xs sm:text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-2xs transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] active:scale-[0.99]"
          >
            <MessageCircle
              className="h-4 w-4 text-[#2563EB] transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
            <span>واتساب</span>
          </a>

          {/* Discrete Staff / System Login Link */}
          <Link
            href="/dashboard"
            title="دخول الإدارة"
            aria-label="لوحة تحكم الإدارة"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors duration-150 hover:border-[#A6A6A6]/60 hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <UserCheck className="h-4 w-4" aria-hidden="true" />
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={
              isMobileMenuOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-150 hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] xl:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <div
        id="mobile-navigation-menu"
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-[520px] opacity-100 border-t border-border bg-surface/95 backdrop-blur-md"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav
          aria-label="قائمة التنقل للهاتف"
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col gap-1"
        >
          {STORE_NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              <span>{item.label}</span>
              <ArrowLeft className="h-4 w-4 text-muted" aria-hidden="true" />
            </a>
          ))}

          <div className="pt-3 mt-2 border-t border-border flex flex-col sm:flex-row gap-2.5">
            <a
              href={STORE_CONTACT_CONFIG.whatsappHref}
              onClick={closeMobileMenu}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-4 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] transition-colors hover:bg-[#111111] dark:hover:bg-white"
            >
              <MessageCircle
                className="h-4 w-4 text-[#2563EB]"
                aria-hidden="true"
              />
              <span>تواصل عبر واتساب</span>
            </a>

            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-medium text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
            >
              <UserCheck className="h-4 w-4" aria-hidden="true" />
              <span>دخول الإدارة</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
