# Implementation Plan: Responsive Navbar

## Overview

This implementation plan creates a responsive navigation component for a Next.js application that adapts between desktop (horizontal layout) and mobile (hamburger menu with sidebar) views. The navbar integrates with Redux for state management, next-themes for theme switching, and uses Tailwind CSS for responsive styling and animations.

## Tasks

- [x] 1. Set up Redux navbar slice and state management
  - Create `src/lib/redux/features/navbar/navbarSlice.ts` with `isSidebarOpen` state
  - Implement `toggleSidebar` and `closeSidebar` actions
  - Register navbarSlice in the Redux store configuration
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 1.1 Write unit tests for navbar Redux slice
  - Test initial state is `{ isSidebarOpen: false }`
  - Test `toggleSidebar` action toggles state correctly
  - Test `closeSidebar` action sets state to false
  - Test state type consistency (always boolean)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Create HamburgerButton component
  - Create `src/components/HamburgerButton.tsx` with TypeScript interface
  - Implement icon animation between hamburger (three lines) and X icon
  - Add click handler and accessibility attributes (aria-label)
  - Style with Tailwind CSS for mobile visibility
  - _Requirements: 2.1, 13.1, 13.2, 13.3, 13.4, 13.5, 10.1_

- [ ]* 2.1 Write unit tests for HamburgerButton
  - Test component renders with correct icon based on `isOpen` prop
  - Test onClick handler is called when clicked
  - Test aria-label attribute is present
  - Test icon animation classes are applied
  - _Requirements: 2.1, 13.1, 13.2, 13.3, 13.4, 13.5, 10.1_

- [x] 3. Create MobileSidebar component with animations
  - Create `src/components/MobileSidebar.tsx` with TypeScript interface
  - Implement slide-in/slide-out animation using CSS transforms (300ms duration)
  - Add backdrop overlay with click-to-close functionality
  - Render navigation links vertically
  - Add close button with aria-label
  - Integrate ThemeToggle component
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 10.2_

- [x] 3.1 Implement body scroll lock in MobileSidebar
  - Use useEffect hook to manage `document.body.style.overflow`
  - Lock scroll when sidebar is open (`overflow: hidden`)
  - Restore scroll when sidebar closes or component unmounts
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 3.2 Write unit tests for MobileSidebar
  - Test sidebar renders with correct animation classes based on `isOpen`
  - Test backdrop click calls `onClose` handler
  - Test close button calls `onClose` handler
  - Test clicking sidebar content does not close sidebar
  - Test navigation links render correctly
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 9.1, 9.2, 9.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create main Navbar component with responsive layout
  - Create `src/components/Navbar.tsx` with TypeScript interface
  - Define `NAV_LINKS` array with Performance, Strategies, and Transparency routes
  - Implement desktop view (horizontal layout, visible ≥768px)
  - Implement mobile header (compact layout, visible <768px)
  - Connect to Redux store using `useAppSelector` and `useAppDispatch`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 15.1, 15.3_

- [x] 5.1 Add logo and branding to Navbar
  - Render "Brand" logo as clickable link to home route ("/")
  - Position logo on left side in both desktop and mobile views
  - Style with Tailwind CSS
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 5.2 Add navigation links rendering
  - Render navigation links horizontally in desktop view
  - Validate links (skip empty labels or invalid hrefs)
  - Use Next.js Link component for client-side navigation
  - Add hover states and transitions
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 14.1, 14.2, 14.3, 14.4, 14.5, 15.3_

- [x] 5.3 Add action buttons to Navbar
  - Render "Sign in" button
  - Render "Open dashboard" button with primary styling
  - Display in desktop header and mobile sidebar
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.4 Integrate ThemeToggle component
  - Import existing ThemeToggle component
  - Display in desktop header
  - Display in mobile header
  - Ensure functionality in all contexts
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 15.5_

- [x] 5.5 Add sticky positioning and visual styling
  - Apply sticky positioning at top of viewport
  - Add bottom border
  - Add semi-transparent background with backdrop blur
  - Set height to 4rem (64px)
  - Configure appropriate z-index
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 5.6 Wire HamburgerButton and MobileSidebar to Navbar
  - Integrate HamburgerButton in mobile header
  - Integrate MobileSidebar component
  - Connect toggle handlers to Redux actions
  - Pass navigation links to MobileSidebar
  - _Requirements: 2.1, 4.3, 4.4_

- [ ]* 5.7 Write unit tests for Navbar component
  - Test desktop view renders correctly on large screens
  - Test mobile view renders correctly on small screens
  - Test navigation links render in correct locations
  - Test action buttons render in correct locations
  - Test ThemeToggle integration
  - Test Redux state connection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.2, 4.3_

- [x] 6. Add keyboard navigation and accessibility
  - Ensure all interactive elements are in tab order
  - Add focus indicators to navigation links
  - Add focus indicators to action buttons
  - Verify aria-labels on HamburgerButton and close button
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 6.1 Write accessibility tests
  - Test all interactive elements have proper tab order
  - Test aria-labels are present on toggle buttons
  - Test keyboard navigation works correctly
  - Test focus indicators are visible
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Integrate Navbar into application layout
  - Add Navbar to `src/app/layout.tsx`
  - Ensure Navbar is wrapped in StoreProvider
  - Ensure Navbar is wrapped in ThemeProvider
  - Verify Navbar appears above page content
  - _Requirements: 15.1, 15.2_

- [ ]* 8.1 Write integration tests
  - Test full navigation flow (hamburger → sidebar opens → click link → navigate)
  - Test theme toggle works while sidebar is open
  - Test responsive behavior on window resize
  - Test Redux state updates propagate correctly
  - Test body scroll lock on mobile
  - _Requirements: 1.3, 2.2, 2.3, 2.4, 6.5, 7.1, 7.2_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All code uses TypeScript with React/Next.js patterns
- Tailwind CSS is used for all styling and animations
- Redux Toolkit is used for state management
