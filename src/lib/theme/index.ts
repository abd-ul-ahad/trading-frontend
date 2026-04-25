/**
 * Theme Configuration - Main Export
 * 
 * Usage:
 * import { colors, ThemeProvider, useColors } from '@/lib/theme'
 */

// Colors
export { colors, primary, secondary, accent, success, warning, error, info, gray, light, dark } from './colors'
export type { ColorScale, SemanticColors, Colors } from './colors'

// Color Utilities
export { useColors, getColor, hexToRgb } from './useColors'

// Theme Provider
export { ThemeProvider } from './ThemeProvider'

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color} / ${opacity}`
}
