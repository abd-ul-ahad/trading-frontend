'use client';

export default function MyStrategiesPage() {
  const myStrategies = [
    {
      id: 'I',
      name: 'Aurum Momentum',
      type: 'Metals',
      typeClass: 'tag-metals',
      invested: 120000,
      current: 142480,
      pnl: 22480,
      pnlPct: 18.7,
      allocation: 40,
    },
    {
      id: 'III',
      name: 'EUR/USD Precision',
      type: 'Indices',
      typeClass: 'tag-indices',
      invested: 85000,
      current: 97760,
      pnl: 12760,
      pnlPct: 15.0,
      allocation: 28,
    },
    {
      id: 'V',
      name: 'S&P 500 Trend',
      type: 'Forex',
      typeClass: 'tag-forex',
      invested: 95000,
      current: 112600,
      pnl: 17600,
      pnlPct: 18.5,
      allocation: 32,
    },
  ];

  return (
    <main className="pt-[calc(68px+50px+44px)] pb-20 px-4 md:px-8 lg:px-24">
      <div className="mb-6 md:mb-8 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
        <div className="font-display text-[32px] md:text-[40px] font-light text-white tracking-[-0.01em]">
          Your active <em className="italic">strategies.</em>
        </div>
        <div className="font-mono text-[12px] tracking-[0.14em] uppercase text-[#c8c3bb] mt-1">
          Currently invested in 3 strategies with total allocation of $300,000
        </div>
      </div>

      <div className="grid gap-5 opacity-0 animate-[fadeUp_0.6s_ease_0.1s_both]">
        {myStrategies.map((strategy, idx) => (
          <div
            key={strategy.id}
            className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[18px] p-7 transition-all hover:border-[rgba(200,160,60,0.18)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
            style={{ animation: `fadeUp 0.5s ease ${0.1 + idx * 0.05}s both` }}
          >
            <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`font-mono text-[8.5px] tracking-[0.13em] uppercase px-2.5 py-1 rounded ${
                    strategy.typeClass === 'tag-metals' ? 'bg-[rgba(200,160,60,0.1)] text-[#c9a44a] border border-[rgba(200,160,60,0.2)]' :
                    strategy.typeClass === 'tag-indices' ? 'bg-[rgba(200,180,255,0.08)] text-[#c8b4ff] border border-[rgba(200,180,255,0.18)]' :
                    'bg-[rgba(158,200,255,0.08)] text-[#9ec8ff] border border-[rgba(158,200,255,0.18)]'
                  }`}>
                    {strategy.type}
                  </span>
                  <span className="font-display text-[15px] text-[#c8c3bb] tracking-[0.06em]">
                    Strategy {strategy.id}
                  </span>
                </div>
                <h3 className="font-display text-[28px] md:text-[36px] font-normal text-white leading-tight tracking-[-0.01em] mb-3">
                  {strategy.name}
                </h3>
                <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-6 text-sm">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Invested
                    </div>
                    <div className="font-outfit text-[18px] md:text-[20px] font-bold text-white tracking-[-0.02em]">
                      ${strategy.invested.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Current Value
                    </div>
                    <div className="font-outfit text-[18px] md:text-[20px] font-bold text-white tracking-[-0.02em]">
                      ${strategy.current.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Total PnL
                    </div>
                    <div className="font-outfit text-[18px] md:text-[20px] font-bold text-[#e8c84a] tracking-[-0.02em]">
                      +${strategy.pnl.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Return
                    </div>
                    <div className="font-outfit text-[18px] md:text-[20px] font-bold text-[#e8c84a] tracking-[-0.02em]">
                      +{strategy.pnlPct}%
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Allocation
                    </div>
                    <div className="font-outfit text-[18px] md:text-[20px] font-bold text-white tracking-[-0.02em]">
                      {strategy.allocation}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-[#d4d5e0] bg-[rgba(168,169,200,0.07)] border border-[rgba(168,169,200,0.25)] rounded-lg px-6 py-3 transition-all hover:bg-[rgba(168,169,200,0.12)] hover:border-[rgba(168,169,200,0.42)] hover:-translate-y-px whitespace-nowrap">
                  Manage Position
                </button>
                <button className="font-outfit text-[13px] font-medium tracking-[0.02em] text-[#c8c3bb] border border-[rgba(255,255,255,0.08)] rounded-lg px-6 py-3 transition-all hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)] whitespace-nowrap">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8 p-5 md:p-6 bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[18px] opacity-0 animate-[fadeUp_0.6s_ease_0.25s_both]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-display text-lg md:text-xl font-normal text-white mb-1">
              Looking for more strategies?
            </div>
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#c8c3bb]">
              Explore 9 additional verified strategies
            </div>
          </div>
          <button className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-black bg-gradient-to-r from-[#c9a44a] via-[#e8c84a] to-[#f5e090] rounded-lg px-6 py-3 transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(200,160,60,0.35)] whitespace-nowrap w-full md:w-auto">
            Discover Strategies
          </button>
        </div>
      </div>
    </main>
  );
}
