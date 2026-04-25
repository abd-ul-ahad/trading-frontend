# Project Architecture Memory

## Overview
This document serves as a memory reference for the project's architecture, configurations, and patterns.

---

## 1. Redux Toolkit Setup

### Structure
```
src/lib/redux/
├── store.ts              # Store configuration with TypeScript types
├── hooks.ts              # Typed hooks (useAppDispatch, useAppSelector, useAppStore)
├── StoreProvider.tsx     # Client component provider wrapper
└── features/
    └── counter/
        └── counterSlice.ts  # Example feature slice
```

### Key Patterns

**Store Configuration** (`store.ts`):
- Uses `configureStore` from Redux Toolkit
- Exports TypeScript types: `AppStore`, `RootState`, `AppDispatch`
- Middleware configured with serializability checks
- DevTools enabled in development only

**Typed Hooks** (`hooks.ts`):
- `useAppDispatch()` - Type-safe dispatch
- `useAppSelector()` - Type-safe state selection
- `useAppStore()` - Direct store access

**Provider Setup** (`StoreProvider.tsx`):
- Client component (`'use client'`)
- Uses `useRef` to create store instance once per render tree
- Wraps children with Redux Provider
- Integrated in root layout

**Feature Slices**:
- Use `createSlice` from Redux Toolkit
- Define state interface with TypeScript
- Export actions and reducer
- Support async operations with `createAsyncThunk`

### Usage Example
```typescript
// In a client component
'use client'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { increment } from '@/lib/redux/features/counter/counterSlice'

const count = useAppSelector((state) => state.counter.value)
const dispatch = useAppDispatch()
dispatch(increment())
```

---

## 2. Axios Configuration

### Structure
```
src/lib/axios/
├── config.ts              # Axios instance with interceptors
├── api.ts                 # Generic API service class
├── endpoints.ts           # Centralized endpoint definitions
├── index.ts              # Main export file
└── services/
    ├── authService.ts    # Authentication API calls
    └── userService.ts    # User management API calls
```

### Key Features

**Axios Instance** (`config.ts`):
- Base URL from environment variable: `NEXT_PUBLIC_API_BASE_URL`
- Timeout: 30 seconds
- Request interceptor: Adds Authorization header, logs requests (dev)
- Response interceptor: Handles errors, token refresh on 401

**Token Management**:
- Automatic token injection in Authorization header
- Token refresh on 401 response
- Tokens stored in localStorage: `accessToken`, `refreshToken`
- Auto-redirect to login on refresh failure

**API Service** (`api.ts`):
- Generic methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- File operations: `upload()`, `download()`
- Typed responses with TypeScript
- Centralized error handling

**Endpoints** (`endpoints.ts`):
- Centralized endpoint definitions
- Static endpoints: `API_ENDPOINTS.AUTH.LOGIN`
- Dynamic endpoints: `API_ENDPOINTS.USERS.BY_ID(id)`
- Organized by feature (AUTH, USERS, PRODUCTS, etc.)

**Service Layer**:
- `authService`: login, register, logout, token refresh, password reset
- `userService`: profile management, avatar upload
- Each service is a singleton class instance

### Usage Example
```typescript
import { authService, userService, api } from '@/lib/axios'

// Using service
const { user, accessToken } = await authService.login({ email, password })

// Using generic API
const data = await api.get('/custom-endpoint', { page: 1 })

// Using endpoints
await api.get(API_ENDPOINTS.USERS.PROFILE)
```

### Error Handling
```typescript
try {
  const data = await api.get('/users')
} catch (error) {
  const apiError = error as ApiError
  console.error(apiError.message)
  console.error(apiError.statusCode)
}
```

---

## 3. Theme System

### Structure
```
src/lib/theme/
├── colors.ts             # Color palette constants
├── ThemeProvider.tsx     # Theme provider component
└── index.ts             # Main export file

src/components/
└── ThemeToggle.tsx      # Theme toggle button component

src/app/
└── globals.css          # CSS variables for theme
```

### Key Features

**Color System** (`colors.ts`):
- Comprehensive color scales: primary, secondary, accent, success, warning, error, info, gray
- Each scale has 11 shades (50-950)
- Semantic colors for light/dark modes
- TypeScript typed exports

**Theme Provider** (`ThemeProvider.tsx`):
- Uses `next-themes` library
- Supports system preference detection
- Class-based theme switching (`class` attribute)
- No transition flash on page load

**CSS Variables** (`globals.css`):
- RGB format for Tailwind opacity support
- Light mode variables in `:root`
- Dark mode variables in `.dark` class
- Semantic color names: background, foreground, card, primary, etc.

**Theme Toggle** (`ThemeToggle.tsx`):
- Client component with hydration safety
- Sun/moon icons for light/dark modes
- Uses theme colors for styling
- Accessible with aria-label

### Color Palette
```typescript
// Primary (Blue)
primary: { 50: '#eff6ff', ..., 950: '#172554' }

// Success (Green)
success: { 50: '#f0fdf4', ..., 950: '#052e16' }

// Error (Red)
error: { 50: '#fef2f2', ..., 950: '#450a0a' }

// Warning (Yellow)
warning: { 50: '#fffbeb', ..., 950: '#451a03' }
```

### Semantic Colors
```css
/* Light Mode */
--background: 255 255 255
--foreground: 15 23 42
--primary: 59 130 246
--card: 255 255 255
--border: 226 232 240

/* Dark Mode */
--background: 15 23 42
--foreground: 248 250 252
--primary: 96 165 250
--card: 30 41 59
--border: 51 65 85
```

### Usage Example
```typescript
// Import colors
import { colors, primary, success } from '@/lib/theme'

// Use in Tailwind classes
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
<div className="border border-border bg-card">

// Theme toggle
import { ThemeToggle } from '@/components/ThemeToggle'
<ThemeToggle />
```

### Integration
- ThemeProvider wraps entire app in root layout
- Nested inside StoreProvider
- `suppressHydrationWarning` on `<html>` tag to prevent hydration mismatch

---

## 4. Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout (ThemeProvider + StoreProvider)
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles + theme variables
│   └── components/
│       └── Counter.tsx      # Example Redux component
├── components/
│   └── ThemeToggle.tsx      # Theme toggle button
└── lib/
    ├── redux/               # Redux Toolkit setup
    ├── axios/               # Axios configuration
    └── theme/               # Theme system
```

---

## 5. Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Environment
NODE_ENV=development
```

---

## 6. Key Dependencies

```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "react-redux": "^9.0.0",
  "axios": "^1.6.0",
  "next-themes": "^0.2.0"
}
```

---

## 7. Design Patterns

### Provider Pattern
- Redux: StoreProvider wraps app with Redux context
- Theme: ThemeProvider wraps app with theme context
- Nested providers in root layout

### Service Layer Pattern
- Axios services encapsulate API logic
- Each service is a singleton class
- Services use generic API methods

### Typed Hooks Pattern
- Redux hooks are pre-typed with app types
- Eliminates need for type assertions
- Better TypeScript inference

### Centralized Configuration
- All endpoints in one file
- All colors in one file
- All theme variables in globals.css

---

## 8. Best Practices

### Redux
- Use typed hooks (`useAppDispatch`, `useAppSelector`)
- Create feature slices for related state
- Use `createAsyncThunk` for async operations
- Keep state serializable

### Axios
- Use service layer for API calls
- Define endpoints in `endpoints.ts`
- Handle errors with try-catch
- Use TypeScript interfaces for requests/responses

### Theme
- Use semantic color names (background, foreground, primary)
- Avoid hardcoded colors
- Use Tailwind's opacity syntax: `bg-primary/90`
- Test both light and dark modes

### TypeScript
- Define interfaces for all data structures
- Export types from modules
- Use type inference where possible
- Avoid `any` type

---

## 9. Common Tasks

### Adding a New Redux Slice
1. Create slice file in `src/lib/redux/features/[feature]/[feature]Slice.ts`
2. Define state interface
3. Create slice with `createSlice`
4. Export actions and reducer
5. Add reducer to store in `store.ts`

### Adding a New API Service
1. Create service file in `src/lib/axios/services/[service]Service.ts`
2. Define TypeScript interfaces
3. Create service class with methods
4. Export singleton instance
5. Add endpoints to `endpoints.ts`
6. Export from `index.ts`

### Adding New Theme Colors
1. Add color scale to `colors.ts`
2. Add CSS variables to `globals.css` (both `:root` and `.dark`)
3. Add to `@theme inline` section
4. Use in components with Tailwind classes

---

## 10. File Naming Conventions

- Components: PascalCase (e.g., `Counter.tsx`, `ThemeToggle.tsx`)
- Utilities: camelCase (e.g., `colors.ts`, `api.ts`)
- Services: camelCase with "Service" suffix (e.g., `authService.ts`)
- Slices: camelCase with "Slice" suffix (e.g., `counterSlice.ts`)
- Config files: camelCase (e.g., `config.ts`, `store.ts`)

---

## 11. Import Aliases

```typescript
@/lib/*          → src/lib/*
@/components/*   → src/components/*
@/app/*          → src/app/*
```

---

## Notes

- All client components must have `'use client'` directive
- Redux store is created per render tree (not singleton)
- Theme provider prevents hydration mismatch with `suppressHydrationWarning`
- Axios automatically handles token refresh on 401 errors
- All colors use RGB format for Tailwind opacity support
