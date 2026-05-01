'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { toggleSidebar } from '@/lib/redux/features/navbar/navbarSlice'
import { ThemeToggle } from './ThemeToggle'
import { MobileSidebar } from './MobileSidebar'
import { HamburgerButton } from './HamburgerButton'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Strategies', href: '/strategies' },
  { label: 'Performance', href: '/#performance' },
  { label: 'Transparency', href: '/#transparency' },
  { label: 'FAQ', href: '/#faq' }
]

export function Navbar() {
  const isSidebarOpen = useAppSelector((state) => state.navbar.isSidebarOpen)
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const isAdminPortal = pathname?.startsWith('/me')

  const handleToggle = () => {
    dispatch(toggleSidebar())
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle FAQ navigation
    if (href === '/#faq') {
      if (pathname === '/') {
        // On homepage, smooth scroll to FAQ
        e.preventDefault()
        const faqSection = document.getElementById('faq')
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
      // If not on homepage, let the link navigate normally (will go to /#faq)
    }
  }

  if (isAdminPortal) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-300 h-[68px] flex items-center justify-between px-4 md:px-8 lg:px-16 bg-[rgba(0,0,0,0.94)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)]">
        <Link href="/me/portfolio" className="flex flex-col shrink-0">
          <span className="font-display text-[20px] md:text-[24px] font-medium tracking-[0.04em] leading-none gold-text">
            Oroviax
          </span>
          <span className="font-mono text-[8px] md:text-[9px] tracking-[0.22em] uppercase text-[#c8c3bb] block mt-0.5">
            Client Portal
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-[#c8c3bb] px-2 md:px-3 py-1 border border-[rgba(255,255,255,0.05)] rounded-full bg-[rgba(126,255,168,0.03)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7effa8] shadow-[0_0_7px_rgba(126,255,168,0.8)] animate-pulse shrink-0" />
            <span className="hidden md:inline">Live · MT5 verified</span>
            <span className="md:hidden">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] block">
                Signed in as
              </span>
              <span className="font-ui text-[14px] font-semibold text-[#d8d3ca] block mt-0.5">
                Sarah Mitchell
              </span>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#9a7b1a] to-[#e8c84a] flex items-center justify-center text-[10px] md:text-xs font-bold text-black shrink-0">
              SM
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      >
        {/* Desktop Navbar */}
        <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between relative">
          {/* Logo - Left */}
          <motion.div
          >
            <Link href="/" className="flex flex-col">
              <span className="text-[22px] font-bold text-foreground">Oroviax</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Verified performance
              </span>
            </Link>
          </motion.div>

          {/* Nav Links - Absolutely centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-6">
            {NAV_LINKS.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Actions - Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Sign in
            </motion.button>
            <Link href="/me/portfolio">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-[15px] font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Open dashboard
              </motion.button>
            </Link>
            <ThemeToggle />
          </motion.div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden container mx-auto px-4 h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex flex-col">
              <span className="text-[22px] font-bold text-foreground">Oroviax</span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Verified performance
              </span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ThemeToggle />
            <HamburgerButton isOpen={isSidebarOpen} onClick={handleToggle} />
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={handleToggle}
        navLinks={NAV_LINKS}
      />
    </>
  )
}
