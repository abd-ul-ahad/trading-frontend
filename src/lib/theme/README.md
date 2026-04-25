# Theme System Documentation

## Overview

This project uses a centralized color system defined in `colors.ts`. All colors are globalized through CSS variables in `globals.css` and can be accessed via Tailwind CSS classes or programmatically through utility functions.

## Color System Architecture

```
src/lib/theme/
├── colors.ts          # Central color definitions
├── useColors.ts       # Color utility functions
├── ThemeProvider.tsx  # Theme context provider
└── index.ts          # Main exports
```

## Using Colors in Components

### Method 1: Tailwind CSS Classes (Recommended)

Use semantic color classes that automatically adapt to light/dark mode:

```tsx
// Navbar example
<nav className="bg-background border-b border-border">
  <Link href="/" className="text-foreground hover:text-primary">
    Brand
  </Link>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Open dashboard
  </button>
</nav>
```

### Method 2: Direct Color Scale Access

Use specific color shades from the color scales:

```tsx
// Using primary color scale
<div className="bg-primary-500 text-white">Primary 500</div>
<div className="bg-primary-600 text-white">Primary 600</div>

// Using success colors
<div className="bg-success-500 text-white">Success</div>

// Using error colors
<div className="bg-error-500 text-white">Error</div>
```

### Method 3: Programmatic Access

Use the `useColors` hook or `getColor` function:

```tsx
import { useColors, getColor } from '@/lib/theme'

function MyComponent() {
  const colors = useColors()
  
  // Access color values
  const primaryColor = colors.primary[500] // '#3b82f6'
  const bgColor = colors.light.background // '#ffffff'
  
  // Or use getColor helper
  const accentColor = getColor('accent.500')
  
  return <div style={{ backgroundColor: primaryColor }}>Content</div>
}
```

## Available Color Scales

### Semantic Colors (Auto-adapting to theme)
- `background` - Main background color
- `foreground` - Main text color
- `card` - Card background
- `card-foreground` - Card text
- `primary` - Primary brand color
- `primary-foreground` - Text on primary
- `secondary` - Secondary color
- `muted` - Muted background
- `muted-foreground` - Muted text
- `accent` - Accent color
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color

### Brand Color Scales (50-950)
- `primary-{50-950}` - Primary brand colors
- `success-{50-950}` - Success/positive colors
- `warning-{50-950}` - Warning/caution colors
- `error-{50-950}` - Error/danger colors

## Navbar Color Usage

The navbar uses the following color tokens:

```tsx
// Desktop Navbar
<nav className="bg-background/95 border-b border-border backdrop-blur">
  {/* Logo */}
  <Link className="text-foreground">Brand</Link>
  
  {/* Nav Links */}
  <Link className="text-muted-foreground hover:text-foreground">
    Performance
  </Link>
  
  {/* Action Buttons */}
  <button className="text-muted-foreground hover:text-foreground">
    Sign in
  </button>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Open dashboard
  </button>
</nav>

// Mobile Sidebar
<div className="bg-card shadow-lg">
  <Link className="text-foreground hover:text-primary">
    Performance
  </Link>
  <button className="bg-primary text-primary-foreground">
    Open dashboard
  </button>
</div>
```

## Best Practices

### ✅ DO

1. **Use semantic colors for theme-aware components**
   ```tsx
   <div className="bg-background text-foreground">Content</div>
   ```

2. **Use color scales for specific shades**
   ```tsx
   <div className="bg-primary-500 hover:bg-primary-600">Button</div>
   ```

3. **Use opacity modifiers for transparency**
   ```tsx
   <div className="bg-background/95 backdrop-blur">Navbar</div>
   ```

4. **Import colors from theme index**
   ```tsx
   import { colors, useColors } from '@/lib/theme'
   ```

### ❌ DON'T

1. **Don't hardcode hex colors**
   ```tsx
   // Bad
   <div style={{ backgroundColor: '#3b82f6' }}>Content</div>
   
   // Good
   <div className="bg-primary">Content</div>
   ```

2. **Don't use arbitrary color values**
   ```tsx
   // Bad
   <div className="bg-[#3b82f6]">Content</div>
   
   // Good
   <div className="bg-primary-500">Content</div>
   ```

3. **Don't bypass the color system**
   ```tsx
   // Bad
   <div style={{ color: 'blue' }}>Text</div>
   
   // Good
   <div className="text-primary">Text</div>
   ```

## Adding New Colors

To add new colors to the system:

1. **Update `colors.ts`**
   ```typescript
   export const colors = {
     // ... existing colors
     brand: {
       50: '#...',
       100: '#...',
       // ... more shades
     }
   }
   ```

2. **Update `globals.css`**
   ```css
   :root {
     --brand-50: 239 246 255;
     --brand-100: 219 234 254;
     /* ... more shades */
   }
   
   @theme inline {
     --color-brand-50: rgb(var(--brand-50));
     --color-brand-100: rgb(var(--brand-100));
     /* ... more shades */
   }
   ```

3. **Use in components**
   ```tsx
   <div className="bg-brand-500">Content</div>
   ```

## Color Conversion Utilities

### hexToRgb
Convert hex colors to RGB format for CSS variables:

```typescript
import { hexToRgb } from '@/lib/theme'

const rgb = hexToRgb('#3b82f6') // '59 130 246'
```

### withOpacity
Add opacity to colors:

```typescript
import { withOpacity } from '@/lib/theme'

const color = withOpacity('59 130 246', 0.5) // '59 130 246 / 0.5'
```

## Theme Switching

The theme system supports automatic light/dark mode switching:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

function Layout() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      {/* Your content */}
    </ThemeProvider>
  )
}
```

## Memory Note

**IMPORTANT**: Always use colors from `colors.ts` throughout the application. Never hardcode color values. Import colors using:

```typescript
import { colors, useColors, getColor } from '@/lib/theme'
```

This ensures consistency, maintainability, and proper theme switching across the entire application.
