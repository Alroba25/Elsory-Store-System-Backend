import type { Metadata } from "next";
import { AppleAuthorizedSection } from "@/src/components/landing/apple-authorized-section";
import { CategoriesSection } from "@/src/components/landing/categories-section";
import { ContactSection } from "@/src/components/landing/contact-section";
import { Footer } from "@/src/components/landing/footer";
import { HeroSection } from "@/src/components/landing/hero-section";
import { Navbar } from "@/src/components/landing/navbar";
import { OffersSection } from "@/src/components/landing/offers-section";
import { WhyElsorySection } from "@/src/components/landing/why-elsory-section";

export const metadata: Metadata = {
  title: "ELSORY STORE | السوري ستور للموبايلات والإلكترونيات والإكسسوارات",
  description:
    "كل اللي بتدور عليه.. هتلاقيه في السوري ستور. عالم متكامل من الموبايلات والإلكترونيات والإكسسوارات، وموزع معتمد لمنتجات Apple.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <AppleAuthorizedSection />
        <OffersSection />
        <WhyElsorySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
