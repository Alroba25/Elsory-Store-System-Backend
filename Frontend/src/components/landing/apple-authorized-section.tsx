import type { LucideIcon } from "lucide-react";
import {
  Award,
  Cable,
  CheckCircle2,
  Headphones,
  Laptop,
  MessageCircle,
  Smartphone,
  Tablet,
  Watch,
} from "lucide-react";
import { STORE_CONTACT_CONFIG } from "@/src/components/landing/store-config";

interface AppleLineupItem {
  nameEn: string;
  nameAr: string;
  description: string;
  icon: LucideIcon;
}

const APPLE_PRODUCT_LINEUP: readonly AppleLineupItem[] = [
  {
    nameEn: "iPhone",
    nameAr: "أجهزة iPhone",
    description:
      "إصدارات وموديلات iPhone الأصلية المتوفرة بالمتجر بمختلف السعات والألوان.",
    icon: Smartphone,
  },
  {
    nameEn: "iPad",
    nameAr: "أجهزة iPad",
    description:
      "أجهزة iPad اللوحية المناسبة للدراسة، العمل، الإبداع، والاستخدام اليومي.",
    icon: Tablet,
  },
  {
    nameEn: "Mac",
    nameAr: "أجهزة Mac",
    description:
      "حاسبات Mac المحمولة والمكتبية ذات الأداء العالي والاعتمادية الفائقة.",
    icon: Laptop,
  },
  {
    nameEn: "Apple Watch",
    nameAr: "ساعات Apple Watch",
    description:
      "ساعات Apple Watch الذكية لمتابعة النشاط اليومي والإشعارات بتصميم أنيق.",
    icon: Watch,
  },
  {
    nameEn: "AirPods",
    nameAr: "سماعات AirPods",
    description:
      "سماعات AirPods الأصلية بتجربة صوتية نقية واتصال سلس مع أجهزة Apple.",
    icon: Headphones,
  },
  {
    nameEn: "Apple Accessories",
    nameAr: "إكسسوارات Apple",
    description:
      "الشواحن، الكابلات، المحولات، والأغطية الأصلية المتوافقة مع أجهزة Apple.",
    icon: Cable,
  },
];

export function AppleAuthorizedSection() {
  return (
    <section
      id="apple-authorized"
      aria-labelledby="apple-authorized-heading"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-28 border-b border-border bg-[#111111] text-[#F5F5F5] relative overflow-hidden"
    >
      {/* Subtle Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to left, #A6A6A6 1px, transparent 1px), linear-gradient(to bottom, #A6A6A6 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/3 h-80 w-80 rounded-full bg-[#2563EB]/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Split */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center mb-14 sm:mb-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#242424] bg-[#1A1A1D] px-4 py-1.5">
              <Award className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
              <span className="text-xs font-bold tracking-wide text-[#F5F5F5]">
                موزع معتمد لمنتجات Apple
              </span>
              <span className="text-[#A6A6A6]" aria-hidden="true">
                •
              </span>
              <span dir="ltr" className="text-xs font-medium text-[#A6A6A6]">
                Apple Authorized Retailer
              </span>
            </div>

            <h2
              id="apple-authorized-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F5F5] leading-snug"
            >
              وجهتك الموثوقة لاقتناء منتجات Apple الأصلية في السوري ستور
            </h2>

            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#A6A6A6]">
              يفخر <strong className="text-[#F5F5F5]">ELSORY STORE (السوري ستور)</strong>{" "}
              بكونه موزعاً معتمداً لمنتجات Apple، حيث نوفر لعملائنا تشكيلة
              أجهزة وإكسسوارات Apple الأصلية مع تجربة شراء احترافية ومساعدة
              متخصصة لاختيار الجهاز الأنسب لاحتياجاتك.
            </p>
          </div>

          {/* Right/End Verification Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#242424] bg-[#18181B] p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-4">
                <div>
                  <div className="text-sm font-bold text-[#F5F5F5]">
                    لماذا تشتري منتجات Apple من موزع معتمد؟
                  </div>
                  <div className="text-xs text-[#A6A6A6] mt-0.5">
                    ثقة ومصداقية في كل جهاز تقتنيه
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#242424] text-[#2563EB]">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F5F5]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>منتجات وأجهزة Apple أصلية ومعتمدة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>تشكيلة متنوعة من الأجهزة والإكسسوارات المتوافقة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>إرشاد ومساعدة في اختيار الموديل والسعة المناسبة</span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={STORE_CONTACT_CONFIG.whatsappHref}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#F5F5F5] px-5 text-xs sm:text-sm font-semibold text-[#111111] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                >
                  <MessageCircle
                    className="h-4 w-4 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>استفسر عن أجهزة Apple المتوفرة حالياً</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Apple Product Lineup Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APPLE_PRODUCT_LINEUP.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.nameEn}
                className="group rounded-2xl border border-[#242424] bg-[#17171A] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#A6A6A6]/40"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#242424] text-[#F5F5F5] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span
                    dir="ltr"
                    className="rounded-lg border border-[#242424] bg-[#111111] px-2.5 py-1 text-xs font-semibold text-[#A6A6A6]"
                  >
                    {item.nameEn}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#F5F5F5] mb-2">
                  {item.nameAr}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#A6A6A6]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Accurate Trademark & Independent Retailer Notice */}
        <p className="mt-8 text-center text-[11px] text-[#A6A6A6]/80">
          ELSORY STORE (السوري ستور) هو متجر تجزئة مستقل وموزع معتمد لمنتجات
          Apple. علامات Apple وiPhone وiPad وMac وApple Watch وAirPods هي علامات
          تجارية مسجلة لشركة Apple Inc.
        </p>
      </div>
    </section>
  );
}
