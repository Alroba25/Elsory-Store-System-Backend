import {
  ArrowLeft,
  MessageCircle,
  PackageCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  EDITABLE_OFFER_SLOTS,
  EDITABLE_PRODUCT_SLOTS,
  STORE_CONTACT_CONFIG,
} from "@/src/components/landing/store-config";

export function OffersSection() {
  return (
    <section
      id="offers"
      aria-labelledby="offers-heading"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-28 border-b border-border bg-surface/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>العروض والمنتجات المختارة</span>
          </div>
          <h2
            id="offers-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug"
          >
            أحدث العروض والمنتجات المتوفرة في السوري ستور
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            تعرّف على فئات المنتجات والعروض المتاحة بالمتجر، أو تواصل معنا
            مباشرة للاستفسار عن الموديلات والأسعار الحالية.
          </p>
        </div>

        {/* Store Offers Banner Cards (Editable Slots) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12">
          {EDITABLE_OFFER_SLOTS.map((offer) => (
            <article
              key={offer.id}
              className="group relative overflow-hidden rounded-2xl border border-[#242424] bg-[#111111] p-6 sm:p-8 text-[#F5F5F5] shadow-lg transition-all duration-200 hover:border-[#2563EB]/60"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -left-20 h-52 w-52 rounded-full bg-[#2563EB]/10 blur-3xl"
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#242424] bg-[#1D1D20] px-3 py-1 text-xs font-semibold text-[#60a5fa]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{offer.badge}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
                    {offer.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#A6A6A6]">
                    {offer.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#242424]">
                  <span className="text-xs text-[#A6A6A6]">{offer.note}</span>
                  <a
                    href={STORE_CONTACT_CONFIG.whatsappHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5F5F5] transition-colors hover:text-[#60a5fa]"
                  >
                    <span>استفسر عن العروض الحالية</span>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Featured Product Showcase Slots (Editable Catalog Cards) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EDITABLE_PRODUCT_SLOTS.map((slot) => (
            <article
              key={slot.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-[#2563EB]/45"
            >
              <div>
                {/* Visual Product Frame Placeholder */}
                <div className="mb-5 flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/70 p-4 text-center transition-colors group-hover:border-[#2563EB]/40">
                  <PackageCheck
                    className="h-8 w-8 text-muted mb-2 transition-colors group-hover:text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {slot.categoryLabel}
                  </span>
                  <span className="text-[11px] text-muted mt-0.5">
                    {slot.statusTag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mb-2">
                  {slot.slotTitle}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted">
                  {slot.slotDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/80">
                <a
                  href={STORE_CONTACT_CONFIG.whatsappHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 px-4 text-xs font-semibold text-foreground transition-colors hover:border-[#2563EB]/50 hover:bg-surface-secondary"
                >
                  <MessageCircle
                    className="h-3.5 w-3.5 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>اسأل عن الموديلات والأسعار</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
