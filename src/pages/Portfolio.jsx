import React from "react";
import Hero from "@/components/portfolio/Hero";
import ServerGallery from "@/components/portfolio/ServerGallery";
import DevShowcase from "@/components/portfolio/DevShowcase";
import StaffImpact from "@/components/portfolio/StaffImpact";
import CommandTerminal from "@/components/portfolio/CommandTerminal";
import Hotbar from "@/components/portfolio/Hotbar";

const HERO_IMAGE = "https://media.base44.com/images/public/6a9d6e3b66960f62348b5cb7/c24cda505_generated_9bd1fbc6.jpg";

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-void">
      <Hero heroImage={HERO_IMAGE} />
      <ServerGallery />
      <DevShowcase />
      <StaffImpact />
      <CommandTerminal />
      <Hotbar />
    </main>
  );
}