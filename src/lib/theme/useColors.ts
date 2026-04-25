/**
 * Color Utility Hook
 * Provides easy access to theme colors from colors.ts
 * Use this hook in components to access globalized colors
 */

import { colors } from './colors'

/**
 * Hook to access theme colors
 * @returns Object containing all color scales and semantic colors
 * 
 * @example
 * const { primary, success, error } = useColors()
 * <div className="bg-primary-500">Primary Background</div>
 */
export function useColors() {
  return colors
}

/**
 * Get color value by path
 * @param path - Dot notation path to color (e.g., 'primary.500', 'light.background')
 * @returns Color value as string
 * 
 * @example
 * const primaryColor = getColor('primary.500') // '#3b82f6'
 * const bgColor = getColor('light.background') // '#ffffff'
 */
export function getColor(path: string): string {
  const keys = path.split('.')
  let value: any = colors
  
  for (const key of keys) {
    value = value[key]
    if (value === undefined) {
      console.warn(`Color path "${path}" not found in colors.ts`)
      return ''
    }
  }
  
  return value
}

/**
 * Convert hex color to RGB values for CSS variables
 * @param hex - Hex color string (e.g., '#3b82f6')
 * @returns RGB values as string (e.g., '59 130 246')
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    console.warn(`Invalid hex color: ${hex}`)
    return ''
  }
  
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  
  return `${r} ${g} ${b}`
}

// Export colors for direct import
export { colors }
export * from './colors'
