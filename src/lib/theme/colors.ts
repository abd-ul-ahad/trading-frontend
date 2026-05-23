/**
 * Theme Colors Configuration
 * Centralized color palette for the application
 * Supports both light and dark modes
 */

export const colors = {
  // Primary Brand Colors - Gold/Amber Theme
  primary: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#d4af37',
    600: '#ca9c2e',
    700: '#ca9c2e',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },

  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Accent Colors - Gold/Amber Theme
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#d4af37',
    600: '#ca9c2e',
    700: '#ca9c2e',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },

  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Error/Danger Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Info Colors
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Neutral/Gray Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic Colors (Light Mode)
  light: {
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    popover: '#ffffff',
    popoverForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#d4af37',
  },

  // Semantic Colors (Dark Mode) - Extracted from ApexCopy design
  dark: {
    background: '#0c0e13',      // Deep dark background
    foreground: '#e0f2f1',      // Light cyan-white text
    card: '#14161d',            // Slightly lighter dark for cards
    cardForeground: '#e0f2f1',  // Light cyan-white text on cards
    popover: '#14161d',         // Same as card
    popoverForeground: '#e0f2f1',
    muted: '#1a1d26',           // Muted dark gray
    mutedForeground: '#80cbc4', // Muted cyan-gray text
    border: '#1a1d26',          // Dark gray border
    input: '#1a1d26',           // Dark gray input border
    ring: '#d4af37',            // Gold accent for focus rings
  },
} as const

// Export individual color scales for convenience
export const {
  primary,
  secondary,
  accent,
  success,
  warning,
  error,
  info,
  gray,
  light,
  dark,
} = colors

// Type exports
export type ColorScale = typeof primary
export type SemanticColors = typeof light
export type Colors = typeof colors
