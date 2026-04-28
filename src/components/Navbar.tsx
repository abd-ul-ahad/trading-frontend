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
              <span className="text-xl font-bold text-foreground">Oroviax</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Sign in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Open dashboard
            </motion.button>
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
              <span className="text-xl font-bold text-foreground">Oroviax</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
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
