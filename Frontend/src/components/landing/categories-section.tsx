import type { LucideIcon } from "lucide-react";
import {
  Cable,
  Cpu,
  Headphones,
  Laptop,
  Smartphone,
  Watch,
} from "lucide-react";

interface ProductCategoryCard {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: readonly string[];
  icon: LucideIcon;
  featured?: boolean;
}

const PRODUCT_CATEGORIES: readonly ProductCategoryCard[] = [
  {
    id: "smartphones",
    title: "الموبايلات",
    subtitle: "أشهر ماركات الهواتف الذكية",
    description:
      "تشكيلة متكاملة من أحدث الهواتف الذكية بمختلف الفئات لتناسب كافة الاستخدامات.",
    highlights: ["Apple iPhone", "Samsung", "Xiaomi", "OPPO", "ماركات أخرى"],
    icon: Smartphone,
    featured: true,
  },
  {
    title: "منتجات Apple",
    subtitle: "موزع معتمد لمنتجات Apple",
    description:
      "مجموعة منتجات Apple الأصلية من هواتف وأجهزة لوحية وحاسبات وساعات وسماعات.",
    highlights: ["iPhone", "iPad", "Mac", "Apple Watch", "AirPods"],
    icon: Laptop,
    featured: true,
  },
  {
    id: "accessories",
    title: "الإكسسوارات",
    subtitle: "مستلزمات الحماية والشحن",
    description:
      "كل ما يحتاجه هاتفك من شواحن ومحولات طاقة، كابلات أصلية، جرابات وأغطية حماية، ومستلزمات يومية.",
    highlights: ["شواحن ومحولات", "كابلات", "جرابات وأغطية", "حماية شاشات"],
    icon: Cable,
  },
  {
    id: "electronics",
    title: "الأجهزة الإلكترونية",
    subtitle: "أجهزة ذكية وإلكترونيات حديثة",
    description:
      "تشكيلة مختارة من الأجهزة الإلكترونية والأجهزة الذكية العملية المتوفرة داخل فروع السوري ستور.",
    highlights: ["أجهزة ذكية", "أجهزة لوحية", "ملحقات تقنية", "إلكترونيات متنوعة"],
    icon: Cpu,
  },
  {
    title: "الساعات الذكية",
    subtitle: "تصميم عصري ومتابعة يومية",
    description:
      "إصدارات Apple Watch إلى جانب تشكيلة واسعة من الساعات الذكية المتوافقة مع مختلف الهواتف.",
    highlights: ["Apple Watch", "ساعات ذكية متنوعة", "أساور وإكسسوارات ساعات"],
    icon: Watch,
  },
  {
    title: "السماعات",
    subtitle: "تجربة صوتية نقية",
    description:
      "سماعات AirPods، سماعات الرأس، والسماعات اللاسلكية بمختلف فئاتها لتجربة استماع ومكالمات مميزة.",
    highlights: ["AirPods", "سماعات لاسلكية", "سماعات رأس", "سماعات سلكية"],
    icon: Headphones,
  },
];

export function CategoriesSection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="py-20 sm:py-24 lg:py-28 border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
            <span>أقسام المتجر</span>
          </div>
          <h2
            id="categories-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug"
          >
            تشكيلة شاملة من الموبايلات والإلكترونيات
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            اكتشف أقسام السوري ستور المتنوعة التي تجمع أشهر العلامات التجارية
            العالمية تحت سقف واحد.
          </p>
        </div>

        {/* 6 Visual Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <article
                key={category.title}
                id={category.id}
                className={`group relative scroll-mt-28 flex flex-col justify-between rounded-2xl border p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 ${
                  category.featured
                    ? "border-border bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_14px_38px_rgba(0,0,0,0.4)] hover:border-[#2563EB]/50"
                    : "border-border bg-surface shadow-2xs hover:border-[#2563EB]/45"
                }`}
              >
                <div>
                  {/* Card Top: Icon + Subtitle Tag */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-border bg-background text-foreground transition-colors duration-200 group-hover:border-[#2563EB]/30 group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-lg border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-muted">
                      {category.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2.5 transition-colors group-hover:text-[#2563EB]">
                    {category.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted mb-6">
                    {category.description}
                  </p>
                </div>

                {/* Category Highlights Pills */}
                <div className="pt-4 border-t border-border/80 flex flex-wrap gap-1.5">
                  {category.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground/90"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
