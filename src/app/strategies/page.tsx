import { StrategiesGrid } from '@/app/components/StrategiesGrid'

export default function StrategiesPage() {
  return (
    <div className="min-h-screen bg-black text-[#e8e2da]">
      <div className="pt-[110px] px-4 md:px-8 lg:px-12 flex items-end justify-between gap-10 max-md:flex-col max-md:items-start max-md:gap-7">
        <div>
          <div className="font-mono text-[13px] tracking-[0.22em] uppercase text-primary mb-3.5 opacity-90">
            Available strategies
          </div>
          <h1 className="font-display text-[52px] font-light text-white leading-[1.05] tracking-[-0.015em] max-lg:text-[42px] max-md:text-[34px]">
            Browse & invest in
            <br />
            <em className="italic text-[#f2efe9]">verified performance.</em>
          </h1>
          <p className="text-[16px] text-[#c8c3bb] leading-[1.75] max-w-[460px] mt-3.5">
            Every strategy below is sourced live from a verified MT5 account. Performance data is real, unfiltered, and updated continuously.
          </p>
        </div>
      </div>

      <div className="mt-7 px-4 md:px-8 lg:px-12 pb-24 max-md:pb-16">
        <StrategiesGrid gridClassName="grid grid-cols-2 gap-5 max-md:grid-cols-1" />
      </div>
    </div>
  )
}
