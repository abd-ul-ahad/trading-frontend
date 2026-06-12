'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { strategyApi } from '@/lib/api/strategyApi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [strategyCount, setStrategyCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const strategies = await strategyApi.getAllStrategies();
        if (!cancelled) setStrategyCount(strategies.length);
      } catch (err) {
        console.error('Failed to load strategy count:', err);
        if (!cancelled) setStrategyCount(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = [
    { label: 'Portfolio', href: '/me/portfolio', badge: null },
    {
      label: 'My Strategies',
      href: '/me/my-strategies',
      badge: strategyCount !== null ? String(strategyCount) : null,
    },
    {
      label: 'Discover',
      href: '/me/discover',
      badge: strategyCount !== null ? String(strategyCount) : null,
    },
  ];

  return (
    <>
      <div className="fixed top-[68px] left-0 right-0 z-200 overflow-hidden h-[50px] bg-[#080808] border-b border-[rgba(255,255,255,0.05)] flex items-stretch px-4 md:px-8 lg:px-16">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 md:px-5 font-ui text-[15px] md:text-[17px] font-medium transition-all relative top-px border-b-2 whitespace-nowrap ${
              pathname === tab.href
                ? 'text-[#e8c84a] border-[#e8c84a]'
                : 'text-[#8a847c] border-transparent hover:text-[#d8d3ca]'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="font-mono text-[9px] tracking-[0.08em] px-1.5 py-0.5 rounded-[10px] bg-primary/10 text-primary border border-primary/25">
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
      {children}
    </>
  );
}
