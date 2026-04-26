import { HeroSection } from './components/HeroSection'
import { StatsMarquee } from './components/StatsMarquee'
import { CapitalChartSection } from './components/CapitalChartSection'
import { StatsBar } from './components/StatsBar'
import { StrategiesSection } from './components/StrategiesSection'
import { TrustSection } from './components/TrustSection'
import { FaqSection } from './components/FaqSection'
import { ContactSection } from './components/ContactSection'
import { CtaSection } from './components/CtaSection'

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <StatsMarquee />
      <CapitalChartSection />
      <StatsBar />
      <StrategiesSection />
      <TrustSection />
      <FaqSection />
      <ContactSection />
      <CtaSection />
    </main>
  )
}
