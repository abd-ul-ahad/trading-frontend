# Implementation Plan: Trading Symbols API Integration

## Overview

This implementation plan breaks down the trading symbols API integration into six phases following the design document. The feature replaces mock data with real API integration, implements Redux state management for trading symbols and prices, and adds pagination and filtering capabilities. All code will be written in TypeScript using Redux Toolkit, React 19, and Next.js 16.

## Tasks

- [ ] 1. Phase 1: Foundation - API Configuration and Type Definitions
  - [x] 1.1 Add trading endpoints to endpoints.ts
    - Add TRADING section with SYMBOLS and PRICE endpoint definitions
    - SYMBOLS endpoint accepts accountId parameter
    - PRICE endpoint accepts accountId and symbol parameters
    - Follow existing endpoint pattern in endpoints.ts
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 1.2 Create TypeScript type definitions
    - Create `src/lib/trading-api/types/index.ts`
    - Define SymbolPrice interface (symbol, bid, ask, time, accountCurrencyExchangeRate)
    - Define CategoryFilter type ('all' | 'metals' | 'forex' | 'indices' | 'commodities')
    - Define TradingState interface for Redux state shape
    - Define SymbolWithPrice and PaginationMetadata interfaces
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 1.3 Create trading API configuration constants
    - Create `src/lib/trading-api/config/constants.ts`
    - Define TRADING_CONFIG with DEFAULT_ACCOUNT_ID, PRICE_CACHE_TTL, MAX_CONCURRENT_PRICE_REQUESTS, DEFAULT_PAGE_SIZE, API_TIMEOUT
    - Use environment variable for account ID with fallback
    - _Requirements: 1.3_

  - [x] 1.4 Implement TradingService class
    - Create `src/lib/axios/services/tradingService.ts`
    - Implement getSymbols(accountId: string): Promise<string[]>
    - Implement getSymbolPrice(accountId: string, symbol: string): Promise<SymbolPrice>
    - Use axiosInstance from config.ts
    - Use endpoint definitions from endpoints.ts
    - Handle API errors and return typed responses
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 8.4_

  - [ ]* 1.5 Write unit tests for TradingService
    - Create `src/lib/axios/services/tradingService.test.ts`
    - Mock Axios responses for successful calls
    - Test error handling for network failures
    - Test request formatting with correct URLs and parameters
    - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [ ] 2. Phase 2: Redux State Management - Trading Slice
  - [x] 2.1 Create trading slice with initial state and reducers
    - Create `src/lib/redux/features/trading/tradingSlice.ts`
    - Define TradingState interface matching design document
    - Implement initial state with empty arrays and default values
    - Create synchronous reducers: setPage, setPageSize, setCategoryFilter, resetPagination
    - _Requirements: 6.1, 6.2_

  - [x] 2.2 Implement fetchSymbols async thunk
    - Create fetchSymbols thunk using createAsyncThunk
    - Call TradingService.getSymbols with configured account ID
    - Handle pending, fulfilled, and rejected states
    - Store symbols array and update loading/error states
    - Store lastFetchTimestamp on success
    - _Requirements: 1.1, 1.4, 1.5, 6.3_

  - [x] 2.3 Implement fetchSymbolPrice async thunk
    - Create fetchSymbolPrice thunk accepting symbol parameter
    - Call TradingService.getSymbolPrice with account ID and symbol
    - Handle pending, fulfilled, and rejected states per symbol
    - Store price data in prices object keyed by symbol
    - Update pricesLoading and pricesError for specific symbol
    - Implement price caching logic with timestamp check
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 10.3_

  - [x] 2.4 Implement fetchVisibleSymbolsPrices async thunk
    - Create thunk to fetch prices for multiple symbols concurrently
    - Limit concurrent requests to MAX_CONCURRENT_PRICE_REQUESTS
    - Check cache before fetching each price
    - Dispatch fetchSymbolPrice for each uncached symbol
    - _Requirements: 2.5, 10.1, 10.3_

  - [ ]* 2.5 Write unit tests for trading slice
    - Create `src/lib/redux/features/trading/tradingSlice.test.ts`
    - Test initial state values
    - Test synchronous reducer actions (setPage, setFilter, etc.)
    - Test fetchSymbols thunk state transitions (pending, fulfilled, rejected)
    - Test fetchSymbolPrice thunk state transitions
    - Test edge cases (empty arrays, invalid page numbers)
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 3. Phase 3: Selectors and Utility Functions
  - [x] 3.1 Implement symbol categorization utility
    - Create `src/lib/trading-api/utils/categorization.ts`
    - Implement categorizeSymbol function matching design document logic
    - Test patterns for metals, forex, indices, commodities
    - Default to 'forex' for unmatched symbols
    - _Requirements: 4.3_

  - [ ]* 3.2 Write unit tests for categorization
    - Create `src/lib/trading-api/utils/categorization.test.ts`
    - Test all category patterns (metals, forex, indices, commodities)
    - Test edge cases (empty strings, special characters, case insensitivity)
    - _Requirements: 4.3_

  - [x] 3.3 Create base selectors
    - Create `src/lib/redux/features/trading/tradingSelectors.ts`
    - Implement selectSymbols, selectPrices, selectCategoryFilter
    - Implement selectCurrentPage, selectPageSize
    - Implement selectSymbolsLoading, selectSymbolsError
    - _Requirements: 6.4_

  - [x] 3.4 Create derived memoized selectors
    - Implement selectFilteredSymbols using createSelector
    - Apply categorization and filter by categoryFilter
    - Implement selectTotalPages based on filtered symbols and page size
    - Implement selectPaginatedSymbols (filter then paginate)
    - Implement selectVisibleSymbolsWithPrices combining symbols and prices
    - Implement selectIsLoading and selectHasError
    - Implement selectPaginationMetadata
    - _Requirements: 6.4, 10.2_

  - [ ]* 3.5 Write unit tests for selectors
    - Create `src/lib/redux/features/trading/tradingSelectors.test.ts`
    - Test base selectors return correct state slices
    - Test derived selectors with various input combinations
    - Test memoization behavior (same input returns cached result)
    - Test selector composition
    - _Requirements: 6.4_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Phase 4: Component Integration - Update Discover Page
  - [ ] 5.1 Register trading reducer in Redux store
    - Modify `src/lib/redux/store.ts`
    - Import tradingReducer from tradingSlice
    - Add trading reducer to configureStore
    - _Requirements: 6.5_

  - [x] 5.2 Update Discover page to use Redux hooks
    - Modify `src/app/me/discover/page.tsx`
    - Remove import of strategiesData
    - Import useAppSelector and useAppDispatch hooks
    - Import trading actions and selectors
    - _Requirements: 5.1, 5.2, 6.6_

  - [x] 5.3 Implement data fetching on component mount
    - Dispatch fetchSymbols action in useEffect on mount
    - Dispatch fetchVisibleSymbolsPrices when paginated symbols change
    - Handle cleanup on unmount
    - _Requirements: 1.1, 2.1, 10.1_

  - [x] 5.4 Connect filter buttons to Redux actions
    - Update filter button onClick handlers to dispatch setCategoryFilter
    - Dispatch resetPagination when filter changes
    - Use selectCategoryFilter for active filter state
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 5.5 Implement pagination controls
    - Add pagination UI (Previous/Next buttons or page numbers)
    - Dispatch setPage action on navigation
    - Use selectCurrentPage, selectTotalPages, selectPaginationMetadata
    - Disable Previous on first page, Next on last page
    - Display current page and total symbols count
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 5.6 Update symbol cards to display API data
    - Map selectVisibleSymbolsWithPrices to symbol cards
    - Display symbol name, category, price data (bid, ask)
    - Calculate and display spread (ask - bid)
    - Handle missing price data with "Price unavailable" indicator
    - Maintain existing visual design and styling
    - _Requirements: 5.2, 5.4, 5.5_

  - [x] 5.7 Implement loading states
    - Use selectIsLoading to show loading skeleton/spinner
    - Show loading indicator while symbols are being fetched
    - Show individual loading states for prices being fetched
    - _Requirements: 7.1_

  - [x] 5.8 Implement error handling UI
    - Use selectHasError and selectSymbolsError for error display
    - Show error message with retry button for symbols fetch failure
    - Show "Price unavailable" with retry for individual price errors
    - Implement retry handlers that re-dispatch fetch actions
    - _Requirements: 7.2, 7.3, 7.5_

  - [x] 5.9 Implement empty state handling
    - Display message when no symbols are available
    - Display message when filter returns no results
    - Provide clear call-to-action or explanation
    - _Requirements: 5.3_

- [ ] 6. Phase 5: Property-Based Testing
  - [ ]* 6.1 Write property test for Pagination Boundary Integrity
    - Create `src/lib/redux/features/trading/pagination.property.test.ts`
    - **Property 1: Pagination Boundary Integrity**
    - **Validates: Requirements 3.1, 3.2, 3.4**
    - Use fast-check to generate random symbol arrays, page sizes, page numbers
    - Assert paginated result length <= pageSize
    - Assert all pages combined equal original array length
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 1: Pagination Boundary Integrity`

  - [ ]* 6.2 Write property test for Category Filter Completeness
    - Create `src/lib/redux/features/trading/filtering.property.test.ts`
    - **Property 2: Category Filter Completeness**
    - **Validates: Requirements 4.2, 4.3**
    - Use fast-check to generate random symbol arrays and category filters
    - Assert all filtered symbols match selected category
    - Assert no matching symbols are excluded
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 2: Category Filter Completeness`

  - [ ]* 6.3 Write property test for Filter-Pagination Composition
    - Add to `src/lib/redux/features/trading/filtering.property.test.ts`
    - **Property 3: Filter-Pagination Composition**
    - **Validates: Requirements 4.4**
    - Use fast-check to generate symbol arrays, filters, page configs
    - Assert filter-then-paginate equals paginate(filter(symbols))
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 3: Filter-Pagination Composition`

  - [ ]* 6.4 Write property test for Price Cache Consistency
    - Create `src/lib/redux/features/trading/cache.property.test.ts`
    - **Property 4: Price Cache Consistency**
    - **Validates: Requirements 10.3**
    - Use fast-check to generate cache states with timestamps
    - Assert cached data returned when within TTL
    - Assert no API call made for cached data
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 4: Price Cache Consistency`

  - [ ]* 6.5 Write property test for Symbol Categorization Determinism
    - Create `src/lib/redux/features/trading/categorization.property.test.ts`
    - **Property 5: Symbol Categorization Determinism**
    - **Validates: Requirements 4.3**
    - Use fast-check to generate random symbol strings
    - Assert categorizeSymbol always returns same category for same input
    - Assert returned category is valid CategoryFilter value
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 5: Symbol Categorization Determinism`

  - [ ]* 6.6 Write property test for Page Navigation Bounds
    - Add to `src/lib/redux/features/trading/pagination.property.test.ts`
    - **Property 6: Page Navigation Bounds**
    - **Validates: Requirements 3.2, 3.4**
    - Use fast-check to generate pagination states
    - Assert next page navigation doesn't exceed total pages
    - Assert previous page navigation doesn't go below page 1
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 6: Page Navigation Bounds`

  - [ ]* 6.7 Write property test for Filtered Symbol Count Accuracy
    - Add to `src/lib/redux/features/trading/filtering.property.test.ts`
    - **Property 7: Filtered Symbol Count Accuracy**
    - **Validates: Requirements 4.5**
    - Use fast-check to generate symbol arrays and filters
    - Assert displayed count exactly matches filtered array length
    - Run minimum 100 iterations
    - Tag: `Feature: trading-symbols-api-integration, Property 7: Filtered Symbol Count Accuracy`

- [ ] 7. Phase 6: Integration Testing and Polish
  - [ ]* 7.1 Write integration tests for Discover page
    - Create `src/app/me/discover/DiscoverPage.integration.test.tsx`
    - Test full data flow from API call to UI rendering
    - Mock API responses for symbols and prices
    - Test user interactions (filter changes, pagination clicks)
    - Test loading states display correctly
    - Test error states display correctly
    - Test empty state handling
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 7.1, 7.2_

  - [ ]* 7.2 Write Redux integration tests
    - Create `src/lib/redux/features/trading/trading.integration.test.ts`
    - Test thunk execution with mocked TradingService
    - Test complete workflows (fetch symbols → fetch prices → filter → paginate)
    - Test selector behavior with real Redux store
    - Test error recovery flows
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.3 Implement performance optimizations
    - Wrap symbol card components in React.memo
    - Use useMemo for expensive computations in Discover page
    - Verify selectors are properly memoized
    - Ensure price fetching only happens for visible symbols
    - _Requirements: 10.1, 10.2, 10.5_

  - [x] 7.4 Add accessibility improvements
    - Add ARIA labels to filter buttons and pagination controls
    - Add aria-live regions for loading state announcements
    - Ensure keyboard navigation works for all interactive elements
    - Test focus management when pagination changes
    - Verify color contrast meets WCAG AA standards
    - _Requirements: 7.1, 7.2_

  - [x] 7.5 Final cleanup and verification
    - Remove any remaining references to strategiesData.ts
    - Verify no console errors or warnings
    - Test all error scenarios (network failures, API errors, timeouts)
    - Verify TypeScript compilation with no errors
    - Test in development mode with Redux DevTools
    - _Requirements: 5.1, 9.5_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation follows the 6-phase plan outlined in the design document
- All code uses TypeScript with strict type checking
- Redux Toolkit patterns (createSlice, createAsyncThunk, createSelector) are used throughout
- The existing Axios configuration and patterns are maintained
- The UI maintains the current visual design while integrating real API data
