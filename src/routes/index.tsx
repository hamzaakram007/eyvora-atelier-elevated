import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { CoupleCollection } from "@/components/home/CoupleCollection";
import { WhyEyvora } from "@/components/home/WhyEyvora";
import { AboutStory } from "@/components/home/AboutStory";
import { Testimonials } from "@/components/home/Testimonials";
import { StyleFinder } from "@/components/home/StyleFinder";
import { Faq } from "@/components/home/Faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EYVORA — Everyday Essentials. Elevated." },
      {
        name: "description",
        content:
          "EYVORA premium hoodies and trousers for modern everyday wear. Olive and black hoodies, grey and black trousers. Priced in PKR.",
      },
      { property: "og:title", content: "EYVORA — Everyday Essentials. Elevated." },
      {
        property: "og:description",
        content:
          "Thoughtfully designed hoodies and trousers. Launch essentials in olive, black and grey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          name: "EYVORA",
          url: "https://eyvora.pk",
          description:
            "Premium hoodies and trousers for modern everyday wear.",
          address: { "@type": "PostalAddress", addressCountry: "PK" },
          currenciesAccepted: "PKR",
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
      <BestSellers />
      <CoupleCollection />
      <WhyEyvora />
      <AboutStory />
      <StyleFinder />
      <Testimonials />
      <Faq />
    </>
  );
}
