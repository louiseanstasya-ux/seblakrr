"use client"
import { useTheme, ThemeProvider } from "@/context/theme"
import NavbarSeblak from "./NavbarSeblak"
import HeroSection from "./HeroSection"
import MenuMarketplace from "./MenuMarketplace"
import HowItWorks from "./HowItWorks"
import GameSection from "./GameSection"
import MainFeatures from "./MainFeatures"
import RewardCatalog from "./RewardCatalog"
import LatestReviews from "./LatestReviews"
import WhySeblakRR from "./WhySeblakRR"
import CTASection from "./CTASection"
import FooterSeblak from "./FooterSeblak"

function SeblakRRContent() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-[#0d0400] text-white" : "bg-orange-50 text-zinc-900"
      }`}
      data-theme={theme}
    >
      <NavbarSeblak />
      <HeroSection />
      <MenuMarketplace />
      <HowItWorks />
      <GameSection />
      <MainFeatures />
      <RewardCatalog />
      <LatestReviews />
      <WhySeblakRR />
      <CTASection />
      <FooterSeblak />
    </div>
  )
}

export default function SeblakRRLanding() {
  return (
    <ThemeProvider>
      <SeblakRRContent />
    </ThemeProvider>
  )
}
