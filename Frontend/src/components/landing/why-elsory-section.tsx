import type { LucideIcon } from "lucide-react";
import {
  Award,
  CheckCircle2,
  Headphones,
  Layers,
  ShieldCheck,
  Smile,
  Wrench,
} from "lucide-react";

interface StoreReason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const WHY_CHOOSE_REASONS: readonly StoreReason[] = [
  {
    title: "موزع معتمد لمنتجات Apple",
    description:
      "اقتنِ أجهزة وإكسسوارات Apple الأصلية بثقة تامة من موزع معتمد يضمن لك أصالة المنتج.",
    icon: Award,
  },
  {
    title: "تنوع واسع تحت سقف واحد",
    description:
      "تشكيلة شاملة من الهواتف الذكية (iPhone، Samsung، Xiaomi، OPPO وغيرها)، الساعات الذكية، السماعات، والإكسسوارات.",
    icon: Layers,
  },
  {
    title: "منتجات وإكسسوارات أصلية",
    description:
      "نحرص في السوري ستور على توفير الأجهزة ومستلزمات الشحن والحماية من علامات تجارية موثوقة.",
    icon: ShieldCheck,
  },
  {
    title: "تجربة شراء مريحة ومساعدة متخصصة",
    description:
      "فريق المتجر جاهز دائماً لمساعدتك في المقارنة بين الأجهزة واختيار الموبايل أو الإكسسوار الأنسب لاحتياجاتك.",
    icon: Smile,
  },
  {
    title: "خدمات المتجر (حسب المتاح بالفرع)",
    description:
      "إمكانية الاستفسار في الفرع عن خدمات المتجر المتاحة مثل أنظمة التقسيط أو الاستبدال أو الصيانة وفق السياسات المعتمدة.",
    icon: Wrench,
  },
];

export function WhyElsorySection() {
  return (
    <section
      id="why-elsory"
      aria-labelledby="why-elsory-heading"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-28 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Right Column: Store Identity Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
              <span>لماذا تختار السوري ستور؟</span>
            </div>

            <h2
              id="why-elsory-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug"
            >
              اسم تثق به في عالم الموبايلات والإلكترونيات
            </h2>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              يجمع <strong className="text-foreground">ELSORY STORE (السوري ستور)</strong>{" "}
              بين تنوع العلامات التجارية العالمية، واعتماده كموزع لمنتجات
              Apple، وتقديم تجربة تسوق واضحة تضع راحة العميل في المقام الأول.
            </p>

            {/* Store Highlights Box */}
            <div className="rounded-2xl border border-[#242424] bg-[#111111] p-6 text-[#F5F5F5] shadow-lg">
              <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-4">
                <div>
                  <div className="text-sm font-bold text-[#F5F5F5]">
                    ما الذي يميز تجربة الشراء لدينا؟
                  </div>
                  <div className="text-xs text-[#A6A6A6] mt-0.5">
                    ELSORY STORE • السوري ستور
                  </div>
                </div>
                <Headphones
                  className="h-5 w-5 text-[#2563EB]"
                  aria-hidden="true"
                />
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#F5F5F5]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>موزع معتمد لمنتجات Apple الأصلية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>أحدث الهواتف الذكية من أشهر الماركات العالمية</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>تشكيلة متكاملة من الساعات، السماعات، والإكسسوارات</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Left Column: 5 Store Value Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {WHY_CHOOSE_REASONS.map((reason, index) => {
              const Icon = reason.icon;
              const isFullWidth = index === WHY_CHOOSE_REASONS.length - 1;

              return (
                <article
                  key={reason.title}
                  className={`group rounded-2xl border border-border bg-surface p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2563EB]/45 ${
                    isFullWidth ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors duration-200 group-hover:border-[#2563EB]/30 group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-foreground">
                        {reason.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
