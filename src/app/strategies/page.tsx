import { Metadata } from 'next'
import { PortfolioHeader } from './components/PortfolioHeader'
import { PlatformStats } from './components/PlatformStats'
import { StrategyFilters } from './components/StrategyFilters'
import { StrategyGrid } from './components/StrategyGrid'

export const metadata: Metadata = {
  title: 'Strategies - Oroviax',
  description: 'Browse and invest in verified performance. Every strategy sourced live from verified MT5 accounts.',
}

export default function StrategiesPage() {
  return (
    <main className="flex flex-col flex-1 bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Page Header */}
        <section className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Available strategies
          </h1>
          <p className="mb-1 text-lg text-foreground">
            Browse & invest in <span className="text-primary">verified performance.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Every strategy below is sourced live from a verified MT5 account. Performance data is real, unfiltered, and updated continuously.
          </p>
        </section>

        {/* Portfolio Header */}
        <PortfolioHeader />

        {/* Platform Stats */}
        <PlatformStats />

        {/* Filters & Grid */}
        <StrategyFilters />
        <StrategyGrid />
      </div>
    </main>
  )
}
