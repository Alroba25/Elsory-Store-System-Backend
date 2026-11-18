import Image from "next/image";
import {
  Activity,
  Boxes,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import type { AuthMode } from "@/src/types/auth.types";

interface LoginBrandPanelProps {
  mode?: AuthMode;
}

export function LoginBrandPanel({ mode = "login" }: LoginBrandPanelProps) {
  const isRegister = mode === "register";

  return (
    <aside
      aria-label="هوية نظام ELSORY STORE"
      className={`relative z-20 hidden md:flex md:w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-[#111111] text-[#F5F5F5] p-8 lg:p-12 xl:p-16 border-[#242424] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        isRegister
          ? "md:-translate-x-full md:border-r"
          : "md:translate-x-0 md:border-l"
      }`}
    >
      {/* Subtle Architectural Grid & Matte Surface Depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to left, #A6A6A6 1px, transparent 1px), linear-gradient(to bottom, #A6A6A6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Controlled ambient highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#2563EB]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#242424]/60 blur-3xl"
      />

      {/* Top Section: Large ELSORY Logo Presentation */}
      <div className="relative z-10 flex flex-col items-start gap-5">
        <div className="inline-flex items-center gap-4 rounded-2xl bg-[#F5F5F5] p-4 lg:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/15">
          <Image
            src="/images/elsory-logo.png"
            alt="شعار ELSORY STORE"
            width={513}
            height={468}
            loading="eager"
            className="h-16 w-auto lg:h-20 xl:h-24 object-contain select-none"
          />
        </div>

        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#242424] bg-[#18181A] px-3.5 py-1.5">
          <span
            className="h-2 w-2 rounded-full bg-[#2563EB]"
            aria-hidden="true"
          />
          <span className="text-xs font-medium tracking-wide text-[#A6A6A6]">
            {isRegister
              ? "حسابات فريق العمل — نظام ELSORY STORE الداخلي"
              : "نظام الإدارة الداخلي لـ ELSORY STORE"}
          </span>
        </div>
      </div>

      {/* Middle Section: Brand Headline, Supporting Copy & Abstract Retail Visual */}
      <div className="relative z-10 my-auto py-8 lg:py-10 flex flex-col gap-8">
        <div className="space-y-4 max-w-lg transition-opacity duration-300 motion-reduce:transition-none">
          <h1 className="text-3xl lg:text-4xl xl:text-[2.65rem] font-bold tracking-tight text-[#F5F5F5] leading-[1.22]">
            {isRegister
              ? "ابدأ رحلتك مع ELSORY STORE"
              : "كل تفاصيل محلك تحت سيطرتك"}
          </h1>
          <p className="text-base lg:text-lg leading-relaxed text-[#A6A6A6] font-normal">
            {isRegister
              ? "أنشئ حسابك للوصول إلى نظام الإدارة الداخلي لـ ELSORY STORE ومتابعة مهام قسمك داخل المحل."
              : "من المبيعات والمخزون إلى المشتريات والموظفين، كل عمليات ELSORY STORE في مكان واحد."}
          </p>
        </div>

        {/* Abstract Architectural Composition (Contextualized for Login vs Register) */}
        {!isRegister ? (
          <div
            aria-hidden="true"
            className="relative rounded-2xl border border-[#242424] bg-[#161618]/90 p-5 lg:p-6 shadow-2xl"
          >
            {/* Abstract Header Bar */}
            <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#242424] text-[#F5F5F5] border border-[#A6A6A6]/15">
                  <Activity className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F5F5F5]">
                    مؤشرات أداء المحل
                  </div>
                  <div className="text-[11px] text-[#A6A6A6]">
                    متابعة المبيعات وحركة المخزون
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-[#242424]/80 px-2.5 py-1 border border-[#A6A6A6]/10">
                <TrendingUp className="h-3.5 w-3.5 text-[#2563EB]" />
                <span className="text-[11px] font-medium text-[#F5F5F5]">
                  أداء المبيعات
                </span>
              </div>
            </div>

            {/* Abstract Retail Analytics Rhythm Bars */}
            <div className="grid grid-cols-12 items-end gap-2 h-24 px-1 mb-5">
              {[
                { height: "h-10", active: false },
                { height: "h-14", active: false },
                { height: "h-12", active: false },
                { height: "h-16", active: false },
                { height: "h-11", active: false },
                { height: "h-20", active: false },
                { height: "h-16", active: false },
                { height: "h-18", active: false },
                { height: "h-24", active: true },
                { height: "h-19", active: false },
                { height: "h-22", active: false },
                { height: "h-15", active: false },
              ].map((bar, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-t-md transition-all ${bar.height} ${
                      bar.active
                        ? "bg-[#2563EB]"
                        : "bg-[#242424] border-t border-[#A6A6A6]/20"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Abstract Inventory & Ledger Micro-Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#242424]">
              <div className="flex items-center gap-3 rounded-xl bg-[#1D1D20] p-3 border border-[#242424]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#242424] text-[#A6A6A6]">
                  <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-[#A6A6A6] truncate">
                    السجلات المالية
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                    <span className="text-[11px] font-medium text-[#F5F5F5]">
                      متابعة دقيقة
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#1D1D20] p-3 border border-[#242424]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#242424] text-[#A6A6A6]">
                  <Boxes className="h-4 w-4 text-[#F5F5F5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-[#A6A6A6] truncate">
                    حالة المخزون
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-[#242424] overflow-hidden">
                      <div className="h-full w-4/5 rounded-full bg-[#F5F5F5]" />
                    </div>
                    <span className="text-[10px] font-medium text-[#F5F5F5] shrink-0">
                      متابعة مستمرة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="relative rounded-2xl border border-[#242424] bg-[#161618]/90 p-5 lg:p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#242424] text-[#F5F5F5] border border-[#A6A6A6]/15">
                  <UserPlus className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F5F5F5]">
                    حسابات فريق عمل ELSORY STORE
                  </div>
                  <div className="text-[11px] text-[#A6A6A6]">
                    صلاحيات داخلية مخصصة لأقسام المحل
                  </div>
                </div>
              </div>
              <span className="rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/40 px-2.5 py-1 text-[11px] font-semibold text-[#93c5fd]">
                نظام داخلي
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  title: "إنشاء الحساب بالبيانات الشخصية",
                  desc: "تسجيل الاسم الكامل والبريد الإلكتروني الخاص بك",
                },
                {
                  title: "تفعيل الصلاحية من إدارة المحل",
                  desc: "تحديد دورك داخل المحل (كاشير، موبايلات، إكسسوارات، أو إدارة)",
                },
                {
                  title: "متابعة العمل اليومي داخل المحل",
                  desc: "إدارة الفواتير والورديات والمنتجات والمشتريات بسهولة",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-[#242424] bg-[#1D1D20] p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                  <div>
                    <div className="text-xs font-semibold text-[#F5F5F5]">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-[#A6A6A6] mt-0.5">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Brand Pillar Tags */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#242424] pt-5 text-xs text-[#A6A6A6]">
        <div className="flex items-center gap-6">
          <span className="font-medium text-[#F5F5F5]">ELSORY STORE</span>
          <span>نظام الإدارة الداخلي</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>المبيعات</span>
          <span aria-hidden="true" className="text-[#242424]">
            •
          </span>
          <span>المخزون</span>
          <span aria-hidden="true" className="text-[#242424]">
            •
          </span>
          <span>التقارير</span>
        </div>
      </div>
    </aside>
  );
}
