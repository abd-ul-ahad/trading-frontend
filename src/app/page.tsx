import { HeroSection } from './components/HeroSection'
import { CapitalChartSection } from './components/CapitalChartSection'
import { StatsBar } from './components/StatsBar'
import { StrategiesSection } from './components/StrategiesSection'
import { TrustSection } from './components/TrustSection'
import { CtaSection } from './components/CtaSection'

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <CapitalChartSection />
      <StatsBar />
      <StrategiesSection />
      <TrustSection />
      <CtaSection />
    </main>
  )
}
