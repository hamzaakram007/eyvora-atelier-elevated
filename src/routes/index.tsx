import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import heroMobile from "@/assets/products/hero/hero-mobile.webp";

const BestSellers = lazy(() =>
  import("@/components/home/BestSellers").then((m) => ({ default: m.BestSellers })),
);
const CoupleCollection = lazy(() =>
  import("@/components/home/CoupleCollection").then((m) => ({
    default: m.CoupleCollection,
  })),
);
const WhyEyvora = lazy(() =>
  import("@/components/home/WhyEyvora").then((m) => ({ default: m.WhyEyvora })),
);
const AboutStory = lazy(() =>
  import("@/components/home/AboutStory").then((m) => ({ default: m.AboutStory })),
);
const StyleFinder = lazy(() =>
  import("@/components/home/StyleFinder").then((m) => ({ default: m.StyleFinder })),
);
const Testimonials = lazy(() =>
  import("@/components/home/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Faq = lazy(() =>
  import("@/components/home/Faq").then((m) => ({ default: m.Faq })),
);

function SectionFallback() {
  return <div className="min-h-[240px] border-t border-border bg-[var(--ivory)]" aria-hidden />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EYVORA — Everyday Essentials. Elevated. | Hoodies & Trousers PK" },
      {
        name: "description",
        content:
          "Buy EYVORA premium hoodies and trousers in Pakistan. Free shipping, tax-free prices, couple looks, COD and 7% off bank transfer.",
      },
      {
        property: "og:title",
        content: "EYVORA — Everyday Essentials. Elevated.",
      },
      {
        property: "og:description",
        content:
          "Thoughtfully designed hoodies and trousers. Launch essentials in olive, black and grey. Shop online in PKR.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://eyvora.pk/" },
      { property: "og:image", content: "https://eyvora.pk/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eyvora.pk/og.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://eyvora.pk/" },
      { rel: "preload", as: "image", href: heroMobile, type: "image/webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "EYVORA",
              url: "https://eyvora.pk",
              logo: "https://eyvora.pk/favicon.png",
              email: "eyvorapk@gmail.com",
              telephone: "+923161609389",
              sameAs: [],
            },
            {
              "@type": "ClothingStore",
              name: "EYVORA",
              url: "https://eyvora.pk",
              image: "https://eyvora.pk/og.jpg",
              description:
                "Premium hoodies and trousers for modern everyday wear in Pakistan.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "PK",
                addressLocality: "Lahore",
              },
              currenciesAccepted: "PKR",
              paymentAccepted: "Cash, Bank Transfer",
              areaServed: "PK",
            },
            {
              "@type": "WebSite",
              name: "EYVORA",
              url: "https://eyvora.pk",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://eyvora.pk/shop?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <Suspense fallback={<SectionFallback />}>
        <BestSellers />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CoupleCollection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyEyvora />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AboutStory />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <StyleFinder />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Faq />
      </Suspense>
    </>
  );
}
