import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Occasions } from "@/components/home/Occasions";
import { CoupleCollection } from "@/components/home/CoupleCollection";
import { WhyEyvora } from "@/components/home/WhyEyvora";
import { FabricExperience } from "@/components/home/FabricExperience";
import { AboutStory } from "@/components/home/AboutStory";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { StyleFinder } from "@/components/home/StyleFinder";
import { Faq } from "@/components/home/Faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EYVORA — Premium Hoodies & Trousers | Elevate Everyday Wear" },
      {
        name: "description",
        content:
          "Heavyweight cotton hoodies and tailored trousers for men and women. Minimal, timeless, built for comfort. Free delivery nationwide.",
      },
      { property: "og:title", content: "EYVORA — Elevate Everyday Wear" },
      {
        property: "og:description",
        content:
          "Premium hoodies and trousers in matte black, warm ivory and stone. Made in small runs.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          name: "EYVORA",
          description:
            "Premium hoodies and trousers for men and women. Minimal, timeless, built for comfort.",
          address: { "@type": "PostalAddress", addressCountry: "PK" },
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
      <NewArrivals />
      <Occasions />
      <CoupleCollection />
      <WhyEyvora />
      <FabricExperience />
      <AboutStory />
      <Testimonials />
      <InstagramFeed />
      <StyleFinder />
      <Faq />
    </>
  );
}
