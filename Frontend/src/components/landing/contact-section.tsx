import {
  Clock,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import { STORE_CONTACT_CONFIG } from "@/src/components/landing/store-config";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 py-20 sm:py-24 lg:py-28 border-b border-border bg-surface/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold text-[#2563EB]">
            <span>تواصل معنا وزورنا</span>
          </div>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-snug"
          >
            يسعدنا تواصلك وزيارتك لفرع السوري ستور
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            تواصل معنا عبر واتساب أو الهاتف أو صفحاتنا الرسمية، أو تفضل بزيارة
            الفرع للتعرف على أحدث الموبايلات ومنتجات Apple والإكسسوارات.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Right Column: Contact Details Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Store Address */}
            <div className="sm:col-span-2 rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">
                    عنوان المتجر
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {STORE_CONTACT_CONFIG.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <Phone className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">
                    رقم الهاتف
                  </h3>
                  <a
                    href={STORE_CONTACT_CONFIG.phoneHref}
                    className="block text-xs sm:text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {STORE_CONTACT_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <MessageCircle
                    className="h-4 w-4 text-[#2563EB]"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">واتساب</h3>
                  <a
                    href={STORE_CONTACT_CONFIG.whatsappHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] hover:underline"
                  >
                    <span>{STORE_CONTACT_CONFIG.whatsappLabel}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <Clock className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">
                    مواعيد العمل
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {STORE_CONTACT_CONFIG.workingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Facebook & Social Media */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <Share2
                    className="h-4 w-4 text-[#2563EB]"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-foreground">
                    صفحات التواصل الاجتماعي
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <a
                      href={STORE_CONTACT_CONFIG.facebookHref}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 font-medium text-foreground transition-colors hover:border-[#2563EB]/50"
                    >
                      <Globe className="h-3 w-3 text-[#2563EB]" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href={STORE_CONTACT_CONFIG.instagramHref}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 font-medium text-foreground transition-colors hover:border-[#2563EB]/50"
                    >
                      <Globe className="h-3 w-3 text-[#2563EB]" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Store Map Container */}
          <div className="lg:col-span-6 flex">
            <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <MapPin
                    className="h-5 w-5 text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-bold text-foreground">
                    موقع المتجر على الخريطة
                  </h3>
                </div>
                <span className="rounded-lg border border-border bg-surface-secondary px-2.5 py-1 text-[11px] font-medium text-muted">
                  ELSORY STORE
                </span>
              </div>

              {STORE_CONTACT_CONFIG.mapEmbedUrl ? (
                <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={STORE_CONTACT_CONFIG.mapEmbedUrl}
                    title="خريطة موقع السوري ستور"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full min-h-[260px] border-0"
                  />
                </div>
              ) : (
                <div className="relative flex min-h-[260px] flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/80 p-6 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#242424] text-[#F5F5F5]">
                    <MapPin
                      className="h-6 w-6 text-[#2563EB]"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1.5">
                    خريطة موقع الفرع — السوري ستور
                  </p>
                  <p className="max-w-md text-xs leading-relaxed text-muted">
                    {STORE_CONTACT_CONFIG.mapLocationNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
