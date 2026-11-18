export interface NavLinkItem {
  label: string;
  href: string;
}

export interface EditableCatalogSlot {
  id: string;
  categoryLabel: string;
  slotTitle: string;
  slotDescription: string;
  statusTag: string;
}

export interface EditableOfferSlot {
  id: string;
  badge: string;
  title: string;
  description: string;
  note: string;
}

export interface StoreContactConfig {
  storeNameAr: string;
  storeNameEn: string;
  authorizedBadgeText: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappLabel: string;
  whatsappHref: string;
  facebookHref: string;
  instagramHref: string;
  workingHours: string;
  mapEmbedUrl: string | null;
  mapLocationNote: string;
}

export const STORE_NAV_LINKS: readonly NavLinkItem[] = [
  { label: "الرئيسية", href: "#hero" },
  { label: "الموبايلات", href: "#smartphones" },
  { label: "منتجات Apple", href: "#apple-authorized" },
  { label: "الإكسسوارات", href: "#accessories" },
  { label: "الأجهزة الإلكترونية", href: "#electronics" },
  { label: "العروض", href: "#offers" },
  { label: "تواصل معنا", href: "#contact" },
];

/**
 * Editable store contact & branch details.
 * Populate with verified ELSORY STORE branch data without inventing unverified numbers or addresses.
 */
export const STORE_CONTACT_CONFIG: StoreContactConfig = {
  storeNameAr: "السوري ستور",
  storeNameEn: "ELSORY STORE",
  authorizedBadgeText: "موزع معتمد لمنتجات Apple",
  address: "يُضاف عنوان فرع ELSORY STORE المعتمد هنا",
  phoneDisplay: "يُضاف رقم الهاتف المعتمد للمتجر",
  phoneHref: "#contact",
  whatsappLabel: "تواصل عبر واتساب",
  whatsappHref: "#contact",
  facebookHref: "#contact",
  instagramHref: "#contact",
  workingHours: "تُحدد مواعيد العمل الرسمية للفرع هنا",
  mapEmbedUrl: null,
  mapLocationNote:
    "مساحة مخصصة لخريطة موقع الفرع المعتمد (Google Maps) — يتم تفعيل الإحداثيات الرسمية فور إضافتها في إعدادات المتجر.",
};

/**
 * Editable featured product showcase slots.
 * No fabricated product names, prices, discounts, or technical specifications.
 */
export const EDITABLE_PRODUCT_SLOTS: readonly EditableCatalogSlot[] = [
  {
    id: "slot-smartphones",
    categoryLabel: "الموبايلات",
    slotTitle: "أحدث إصدارات الهواتف الذكية",
    slotDescription:
      "مساحة مخصصة لعرض موديلات الموبايلات المتوفرة (Apple iPhone، Samsung، Xiaomi، OPPO وغيرها) مع المواصفات والأسعار الفعلية من كتالوج المتجر.",
    statusTag: "يُحدّث من كتالوج المتجر",
  },
  {
    id: "slot-apple",
    categoryLabel: "منتجات Apple",
    slotTitle: "أجهزة ومنتجات Apple الأصلية",
    slotDescription:
      "مساحة مخصصة لعرض أجهزة iPhone وiPad وMac وApple Watch وAirPods المتاحة حالياً لدى السوري ستور كموزع معتمد لمنتجات Apple.",
    statusTag: "موزع معتمد لمنتجات Apple",
  },
  {
    id: "slot-watches-audio",
    categoryLabel: "الساعات الذكية والسماعات",
    slotTitle: "تشكيلة الساعات الذكية والسماعات",
    slotDescription:
      "مساحة مخصصة لعرض موديلات الساعات الذكية وسماعات الرأس والسماعات اللاسلكية المتوفرة بالفرع.",
    statusTag: "يُحدّث من كتالوج المتجر",
  },
  {
    id: "slot-accessories",
    categoryLabel: "الإكسسوارات والأجهزة",
    slotTitle: "الإكسسوارات الأصلية والأجهزة الإلكترونية",
    slotDescription:
      "مساحة مخصصة لعرض الشواحن والمحولات، الكابلات، الجرابات والأغطية، والأجهزة الإلكترونية الذكية المتوفرة.",
    statusTag: "يُحدّث من كتالوج المتجر",
  },
];

/**
 * Editable store promotional offer slots.
 */
export const EDITABLE_OFFER_SLOTS: readonly EditableOfferSlot[] = [
  {
    id: "offer-slot-1",
    badge: "عروض الموبايلات والأجهزة",
    title: "مساحة العروض الموسمية والحالية",
    description:
      "تُعرض هنا العروض الفعلية المعتمدة من إدارة السوري ستور على الهواتف الذكية والأجهزة الإلكترونية فور تفعيلها.",
    note: "محتوى قابل للتحديث المباشر حسب العروض السارية بالفرع",
  },
  {
    id: "offer-slot-2",
    badge: "عروض الإكسسوارات والباقات",
    title: "مساحة عروض الإكسسوارات والمستلزمات",
    description:
      "تُعرض هنا عروض الشواحن، السماعات، الساعات الذكية، ومستلزمات الحماية الأصلية المتوفرة داخل المتجر.",
    note: "محتوى قابل للتحديث المباشر حسب العروض السارية بالفرع",
  },
];
