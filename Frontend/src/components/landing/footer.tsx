import Image from "next/image";
import Link from "next/link";
import { Award, MessageCircle, UserCheck } from "lucide-react";
import {
  STORE_CONTACT_CONFIG,
  STORE_NAV_LINKS,
} from "@/src/components/landing/store-config";

export function Footer() {
  return (
    <footer
      aria-label="تذييل الموقع"
      className="bg-surface text-foreground border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12 pb-10 border-b border-border">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-3.5">
              <div className="inline-flex items-center justify-center rounded-xl bg-[#F5F5F5] p-2.5 shadow-2xs ring-1 ring-black/5 dark:ring-white/15">
                <Image
                  src="/images/elsory-logo.png"
                  alt="شعار ELSORY STORE - السوري ستور"
                  width={513}
                  height={468}
                  className="h-10 w-auto object-contain select-none"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-wide text-foreground">
                  ELSORY STORE
                </span>
                <span className="text-xs text-muted">
                  السوري ستور للموبايلات والإلكترونيات
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-muted">
              عالم متكامل من الموبايلات والإلكترونيات والإكسسوارات من أشهر
              العلامات التجارية، وموزع معتمد لمنتجات Apple الأصلية.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground">
              <Award className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              <span>{STORE_CONTACT_CONFIG.authorizedBadgeText}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-3.5">
            <h3 className="text-sm font-bold text-foreground">أقسام المتجر</h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm">
              {STORE_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-muted transition-colors hover:text-foreground focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact & Store Portal */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              تواصل سريع
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              تواصل معنا مباشرة للاستفسار عن الأجهزة المتوفرة والعروض الحالية.
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              <a
                href={STORE_CONTACT_CONFIG.whatsappHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-4 text-xs sm:text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] transition-colors hover:bg-[#111111] dark:hover:bg-white"
              >
                <MessageCircle
                  className="h-4 w-4 text-[#2563EB]"
                  aria-hidden="true"
                />
                <span>تواصل عبر واتساب</span>
              </a>

              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3.5 text-xs font-medium text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
              >
                <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>بوابة دخول الإدارة</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p className="font-medium">
            ELSORY STORE (السوري ستور) © جميع الحقوق محفوظة
          </p>
          <p>موزع معتمد لمنتجات Apple • موبايلات وإلكترونيات وإكسسوارات</p>
        </div>
      </div>
    </footer>
  );
}
