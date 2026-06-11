import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Bestsellers } from "@/components/site/Bestsellers";
import { SkinQuiz } from "@/components/site/SkinQuiz";
import { Ritual } from "@/components/site/Ritual";
import { SpinWheel } from "@/components/site/SpinWheel";
import { MysteryBox } from "@/components/site/MysteryBox";
import { Community } from "@/components/site/Community";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumi Glow 15 — lumi glow let me glow ✨" },
      { name: "description", content: "Premium skincare with personalized AI rituals, glow rewards, and luxe formulas. Discover the radiance your skin has been waiting for." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <Bestsellers />
      <SkinQuiz />
      <Ritual />
      <SpinWheel />
      <MysteryBox />
      <Community />
      <Footer />
    </main>
  );
}
