/**
 * Theme Configuration - Main Export
 * 
 * Usage:
 * import { colors, ThemeProvider } from '@/lib/theme'
 */

// Colors
export { colors, primary, secondary, accent, success, warning, error, info, gray, light, dark } from './colors'
export type { ColorScale, SemanticColors, Colors } from './colors'

// Theme Provider
export { ThemeProvider } from './ThemeProvider'

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color} / ${opacity}`
}

// Utility to convert hex to RGB
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0'
}
