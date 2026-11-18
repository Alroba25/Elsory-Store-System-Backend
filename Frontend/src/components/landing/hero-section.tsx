import {
  ArrowLeft,
  Award,
  Cable,
  Headphones,
  Laptop,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Watch,
} from "lucide-react";
import { STORE_CONTACT_CONFIG } from "@/src/components/landing/store-config";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-border"
    >
      {/* Subtle Studio Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to left, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient Studio Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 h-[340px] w-[340px] rounded-full bg-[#A6A6A6]/15 dark:bg-[#242424]/60 blur-3xl animate-pulse-subtle"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Right Column (in RTL): Brand Copy, Authorized Badge & Retail CTAs */}
          <div className="lg:col-span-6 space-y-7 text-right">
            {/* Official Apple Authorized Retailer Badge Pill */}
            <div className="animate-fade-up inline-flex flex-wrap items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2 shadow-2xs">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] dark:bg-[#F5F5F5] text-[#F5F5F5] dark:text-[#111111]">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                موزع معتمد لمنتجات Apple
              </span>
              <span
                aria-hidden="true"
                className="h-3.5 w-px bg-border hidden sm:inline-block"
              />
              <span
                dir="ltr"
                className="hidden sm:inline text-xs font-medium text-muted"
              >
                Apple Authorized Retailer
              </span>
            </div>

            {/* Required Arabic Headline */}
            <h1
              id="hero-heading"
              className="animate-fade-up-delay-1 text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold tracking-tight text-foreground leading-[1.24]"
            >
              كل اللي بتدور عليه.. هتلاقيه في السوري ستور.
            </h1>

            {/* Required Arabic Description */}
            <p className="animate-fade-up-delay-2 max-w-xl text-base sm:text-lg leading-relaxed text-muted">
              عالم متكامل من الموبايلات والإلكترونيات والإكسسوارات، مع تشكيلة
              متنوعة من أشهر العلامات التجارية.
            </p>

            {/* Primary & Secondary Retail CTAs */}
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#smartphones"
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-7 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] active:scale-[0.99]"
              >
                <span>تصفح الأقسام والمنتجات</span>
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </a>

              <a
                href={STORE_CONTACT_CONFIG.whatsappHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-7 text-sm font-semibold text-foreground shadow-2xs transition-all duration-200 hover:border-[#2563EB]/50 hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
              >
                <MessageCircle
                  className="h-4 w-4 text-[#2563EB]"
                  aria-hidden="true"
                />
                <span>تواصل معنا عبر واتساب</span>
              </a>
            </div>

            {/* Store Trust & Brand Lineup Strip */}
            <div className="animate-fade-up-delay-3 pt-5 border-t border-border/80 space-y-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted">
                <span className="inline-flex items-center gap-1.5 text-foreground font-semibold">
                  <ShieldCheck
                    className="h-4 w-4 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  منتجات أصلية ومعتمدة
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles
                    className="h-4 w-4 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  أشهر العلامات العالمية
                </span>
              </div>

              <div
                dir="ltr"
                className="flex flex-wrap items-center justify-end gap-2 pt-1"
              >
                {["Apple", "Samsung", "Xiaomi", "OPPO"].map((brand) => (
                  <span
                    key={brand}
                    className="rounded-lg border border-border bg-surface px-3 py-1 text-xs font-semibold tracking-wide text-foreground"
                  >
                    {brand}
                  </span>
                ))}
                <span className="rounded-lg border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-muted">
                  + المزيد من الماركات
                </span>
              </div>
            </div>
          </div>

          {/* Left Column (in RTL): Flagship Hardware & Retail Showcase */}
          <div className="lg:col-span-6 animate-fade-up-delay-2">
            <div className="relative rounded-3xl border border-[#242424] bg-[#111111] p-5 sm:p-7 text-[#F5F5F5] shadow-[0_24px_70px_rgba(0,0,0,0.2)] dark:shadow-[0_28px_80px_rgba(0,0,0,0.65)] overflow-hidden">
              {/* Subtle radial studio spotlight inside showcase */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2563EB]/15 blur-3xl"
              />

              {/* Showcase Top Banner: Authorized Apple Retailer Highlight */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#242424] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#242424] text-[#F5F5F5] border border-[#A6A6A6]/20">
                    <Award className="h-5 w-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#F5F5F5]">
                      ELSORY STORE • السوري ستور
                    </div>
                    <div className="text-[11px] text-[#A6A6A6]">
                      موزع معتمد لمنتجات Apple وتشكيلة الهواتف الذكية
                    </div>
                  </div>
                </div>

                <a
                  href="#apple-authorized"
                  className="rounded-full border border-[#A6A6A6]/25 bg-[#1B1B1E] px-3.5 py-1 text-[11px] font-semibold text-[#F5F5F5] transition-colors hover:border-[#2563EB] hover:text-white"
                >
                  قسم منتجات Apple
                </a>
              </div>

              {/* Studio Hardware Showcase Grid */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Main Flagship Showcase Card: Smartphones & iPhone */}
                <div className="sm:col-span-7 flex flex-col justify-between rounded-2xl border border-[#242424] bg-linear-to-b from-[#1C1C1F] to-[#141416] p-5 transition-colors hover:border-[#A6A6A6]/35">
                  <div className="space-y-1.5">
                    <span className="inline-block rounded-md bg-[#2563EB]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#60a5fa]">
                      عالم الهواتف الذكية
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#F5F5F5]">
                      أحدث الموبايلات من أشهر الماركات
                    </h2>
                    <p className="text-xs leading-relaxed text-[#A6A6A6]">
                      iPhone وSamsung وXiaomi وOPPO وتشكيلة واسعة تناسب كل
                      الاحتياجات.
                    </p>
                  </div>

                  {/* Stylized Studio Smartphone Silhouette */}
                  <div
                    aria-hidden="true"
                    className="my-5 mx-auto flex items-end justify-center gap-3 pt-2"
                  >
                    <div className="relative h-36 w-20 rounded-2xl border-2 border-[#A6A6A6]/40 bg-linear-to-b from-[#2A2A2E] to-[#111111] p-2 shadow-xl">
                      <div className="mx-auto h-1.5 w-7 rounded-full bg-[#111111]" />
                      <div className="mt-4 flex h-full flex-col justify-between pb-4">
                        <Smartphone className="mx-auto h-7 w-7 text-[#F5F5F5]/80" />
                        <div className="mx-auto h-1 w-8 rounded-full bg-[#A6A6A6]/50" />
                      </div>
                    </div>

                    <div className="relative h-32 w-18 rounded-2xl border border-[#242424] bg-linear-to-b from-[#202024] to-[#121214] p-2 opacity-85">
                      <div className="mx-auto h-1 w-5 rounded-full bg-[#111111]" />
                      <div className="mt-4 flex h-full flex-col justify-between pb-4">
                        <div className="mx-auto h-5 w-5 rounded-full border border-[#2563EB]/60 bg-[#2563EB]/15" />
                        <div className="mx-auto h-1 w-6 rounded-full bg-[#A6A6A6]/30" />
                      </div>
                    </div>
                  </div>

                  <div
                    dir="ltr"
                    className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#242424] text-[11px] text-[#A6A6A6]"
                  >
                    <span>iPhone</span>
                    <span>•</span>
                    <span>Samsung</span>
                    <span>•</span>
                    <span>Xiaomi</span>
                    <span>•</span>
                    <span>OPPO</span>
                  </div>
                </div>

                {/* Right Stack: Apple Ecosystem + Audio/Watches/Accessories */}
                <div className="sm:col-span-5 flex flex-col gap-4">
                  {/* Card A: Apple Ecosystem */}
                  <div className="flex-1 rounded-2xl border border-[#242424] bg-[#18181B] p-4 transition-colors hover:border-[#A6A6A6]/35">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#F5F5F5]">
                        منظومة Apple المتكاملة
                      </span>
                      <Laptop
                        className="h-4 w-4 text-[#A6A6A6]"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-[#A6A6A6] mb-3.5">
                      أجهزة Apple الأصلية لدى موزع معتمد.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 rounded-lg bg-[#242424]/70 px-2.5 py-1.5 text-[#F5F5F5]">
                        <Smartphone className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span dir="ltr">iPhone</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-[#242424]/70 px-2.5 py-1.5 text-[#F5F5F5]">
                        <Tablet className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span dir="ltr">iPad</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-[#242424]/70 px-2.5 py-1.5 text-[#F5F5F5]">
                        <Laptop className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span dir="ltr">Mac</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-[#242424]/70 px-2.5 py-1.5 text-[#F5F5F5]">
                        <Watch className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span dir="ltr">Watch</span>
                      </div>
                    </div>
                  </div>

                  {/* Card B: Watches, Audio & Original Accessories */}
                  <div className="flex-1 rounded-2xl border border-[#242424] bg-[#18181B] p-4 transition-colors hover:border-[#A6A6A6]/35">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-[#F5F5F5]">
                        الإكسسوارات والأجهزة الذكية
                      </span>
                      <Headphones
                        className="h-4 w-4 text-[#2563EB]"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-[#A6A6A6] mb-3">
                      ساعات ذكية، سماعات AirPods وسماعات لاسلكية، شواحن وكابلات
                      وجرابات أصلية.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#F5F5F5]">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#242424] px-2.5 py-1">
                        <Watch className="h-3 w-3 text-[#2563EB]" />
                        ساعات
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#242424] px-2.5 py-1">
                        <Headphones className="h-3 w-3 text-[#2563EB]" />
                        سماعات
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#242424] px-2.5 py-1">
                        <Cable className="h-3 w-3 text-[#2563EB]" />
                        شواحن
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
