'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Portfolio', href: '/me/portfolio', badge: null },
    { label: 'My Strategies', href: '/me/my-strategies', badge: '3' },
    { label: 'Discover', href: '/me/discover', badge: '9' },
  ];

  return (
    <>
      <div className="fixed top-[68px] left-0 right-0 z-[200] h-[50px] bg-[#080808] border-b border-[rgba(255,255,255,0.05)] flex items-stretch px-4 md:px-8 lg:px-16">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-5 font-ui text-[13px] font-medium transition-all relative top-px border-b-2 ${
              pathname === tab.href
                ? 'text-[#e8c84a] border-[#e8c84a]'
                : 'text-[#8a847c] border-transparent hover:text-[#d8d3ca]'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="font-mono text-[9px] tracking-[0.08em] px-1.5 py-0.5 rounded-[10px] bg-[rgba(232,200,74,0.08)] text-[#c9a44a] border border-[rgba(232,200,74,0.18)]">
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
