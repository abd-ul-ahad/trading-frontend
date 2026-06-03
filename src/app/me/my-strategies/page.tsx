'use client'

import { StrategiesGrid } from '@/app/components/StrategiesGrid'

export default function MyStrategiesPage() {
  return (
    <main className="pt-[calc(68px+50px+44px)] pb-20 px-4 md:px-8 lg:px-12">
      <div className="mb-6 md:mb-8 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
        <div className="font-display text-[32px] md:text-[50px] font-light text-white tracking-[-0.01em]">
          Your active <em className="italic">strategies.</em>
        </div>
        <div className="font-mono md:text-[14px] tracking-[0.14em] uppercase text-[#c8c3bb] mt-1">
          Live performance from verified MT5 accounts
        </div>
      </div>

      <div className="opacity-0 animate-[fadeUp_0.6s_ease_0.15s_both]">
        <StrategiesGrid gridClassName="grid grid-cols-1 gap-5 sm:grid-cols-2" />
      </div>
    </main>
  )
}
