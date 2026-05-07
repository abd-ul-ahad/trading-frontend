# Requirements Document

## Introduction

This document specifies the requirements for integrating trading symbols API into the discover page. The feature replaces mock data with real-time trading data from two API endpoints, implements Redux state management for data handling, and adds pagination support for the symbols list. The implementation uses the existing Axios configuration and maintains the current UI/UX patterns while removing dependencies on mock data.

## Glossary

- **Discover_Page**: The user interface component located at src/app/me/discover/page.tsx that displays available trading strategies
- **Trading_API**: The backend API service that provides trading symbols and price data
- **Redux_Store**: The centralized state management system using Redux Toolkit
- **Symbols_Endpoint**: The API endpoint GET /trading/accounts/:accountId/symbols that returns an array of trading symbol strings
- **Price_Endpoint**: The API endpoint GET /trading/accounts/:accountId/symbols/:symbol/price that returns price data for a specific symbol
- **Account_ID**: A hardcoded identifier used to specify which trading account to query
- **Symbol**: A string identifier for a tradable asset (e.g., "AAPL", "EURUSD")
- **Pagination**: The mechanism to load and display trading symbols in manageable chunks
- **Category_Filter**: The existing UI filter that allows users to filter symbols by type (metals, forex, indices, commodities)
- **Axios_Instance**: The pre-configured HTTP client located in src/lib/axios/config.ts
- **Trading_Slice**: The Redux slice that manages trading symbols and price data state

## Requirements

### Requirement 1: Fetch Trading Symbols

**User Story:** As a user, I want to see real trading symbols on the discover page, so that I can browse actual investment opportunities.

#### Acceptance Criteria

1. WHEN the Discover_Page loads, THE Trading_Slice SHALL dispatch an action to fetch symbols from the Symbols_Endpoint
2. THE Trading_Slice SHALL use the Axios_Instance to make API requests
3. THE Trading_Slice SHALL store the Account_ID as a configurable constant that can be easily modified
4. WHEN the Symbols_Endpoint returns successfully, THE Trading_Slice SHALL store the array of symbols in the Redux_Store
5. WHEN the Symbols_Endpoint returns an error, THE Trading_Slice SHALL store the error state and error message
6. THE Symbols_Endpoint request SHALL use the format GET /trading/accounts/:accountId/symbols with the configured Account_ID

### Requirement 2: Fetch Symbol Price Data

**User Story:** As a user, I want to see current price information for each trading symbol, so that I can make informed investment decisions.

#### Acceptance Criteria

1. WHEN a Symbol needs to be displayed, THE Trading_Slice SHALL fetch price data from the Price_Endpoint for that Symbol
2. THE Price_Endpoint request SHALL use the format GET /trading/accounts/:accountId/symbols/:symbol/price
3. WHEN the Price_Endpoint returns successfully, THE Trading_Slice SHALL store the price data including bid, ask, time, and accountCurrencyExchangeRate
4. WHEN the Price_Endpoint returns an error for a Symbol, THE Trading_Slice SHALL store an error state for that specific Symbol
5. THE Trading_Slice SHALL support fetching price data for multiple symbols concurrently

### Requirement 3: Implement Pagination

**User Story:** As a user, I want symbols to load in manageable chunks, so that the page loads quickly and I can browse through symbols efficiently.

#### Acceptance Criteria

1. THE Discover_Page SHALL display symbols in pages with a configurable page size
2. WHEN the user reaches the end of the current page, THE Discover_Page SHALL provide a mechanism to load the next page
3. THE Trading_Slice SHALL track the current page number and total number of symbols
4. WHEN the user navigates to a different page, THE Discover_Page SHALL display the symbols for that page
5. THE Discover_Page SHALL indicate the current page position and total available symbols

### Requirement 4: Integrate with Category Filter

**User Story:** As a user, I want to filter trading symbols by category, so that I can focus on specific types of investments.

#### Acceptance Criteria

1. THE Discover_Page SHALL maintain the existing Category_Filter UI (all, metals, forex, indices, commodities)
2. WHEN a user selects a Category_Filter, THE Discover_Page SHALL display only symbols matching that category
3. THE Trading_Slice SHALL support categorizing symbols based on symbol naming patterns or metadata
4. WHEN the Category_Filter changes, THE Discover_Page SHALL reset pagination to the first page
5. THE Discover_Page SHALL display the count of filtered symbols

### Requirement 5: Remove Mock Data Dependencies

**User Story:** As a developer, I want to remove all mock data from the discover page, so that the application uses only real API data.

#### Acceptance Criteria

1. THE Discover_Page SHALL NOT import or reference strategiesData.ts
2. THE Discover_Page SHALL render trading symbols from the Redux_Store instead of mock data
3. WHEN no API data is available, THE Discover_Page SHALL display an appropriate loading or empty state
4. THE Discover_Page SHALL maintain the existing UI layout and styling while using API data
5. THE Discover_Page SHALL map API response fields to the existing UI components

### Requirement 6: Redux State Management

**User Story:** As a developer, I want trading data managed through Redux, so that state is centralized and can be shared across components.

#### Acceptance Criteria

1. THE Trading_Slice SHALL be created in src/lib/redux/features/trading/
2. THE Trading_Slice SHALL define state shape including symbols array, loading states, error states, and pagination metadata
3. THE Trading_Slice SHALL export actions for fetching symbols, fetching prices, and updating pagination
4. THE Trading_Slice SHALL export selectors for accessing symbols, prices, loading states, and filtered data
5. THE Redux_Store SHALL include the Trading_Slice reducer in its configuration
6. THE Discover_Page SHALL use Redux hooks (useAppSelector, useAppDispatch) to interact with the Trading_Slice

### Requirement 7: Error Handling and Loading States

**User Story:** As a user, I want clear feedback when data is loading or when errors occur, so that I understand the application state.

#### Acceptance Criteria

1. WHEN the Trading_Slice is fetching data, THE Discover_Page SHALL display a loading indicator
2. WHEN the Symbols_Endpoint returns an error, THE Discover_Page SHALL display an error message with retry option
3. WHEN the Price_Endpoint returns an error for a Symbol, THE Discover_Page SHALL display that Symbol with a fallback state
4. THE Discover_Page SHALL handle network timeouts gracefully
5. WHEN the user retries after an error, THE Trading_Slice SHALL re-attempt the failed API request

### Requirement 8: API Endpoint Configuration

**User Story:** As a developer, I want trading API endpoints defined in the centralized endpoints configuration, so that API paths are maintainable.

#### Acceptance Criteria

1. THE endpoints.ts file SHALL include a TRADING section with SYMBOLS and PRICE endpoint definitions
2. THE SYMBOLS endpoint definition SHALL accept an accountId parameter
3. THE PRICE endpoint definition SHALL accept accountId and symbol parameters
4. THE Trading_Slice SHALL use endpoint definitions from endpoints.ts rather than hardcoded strings
5. THE endpoint definitions SHALL follow the existing pattern in endpoints.ts

### Requirement 9: Type Safety

**User Story:** As a developer, I want TypeScript types for all API responses and state, so that the code is type-safe and maintainable.

#### Acceptance Criteria

1. THE Trading_Slice SHALL define TypeScript interfaces for SymbolsResponse (array of strings)
2. THE Trading_Slice SHALL define TypeScript interfaces for PriceResponse including all fields (accountCurrencyExchangeRate, symbol, bid, ask, time)
3. THE Trading_Slice SHALL define TypeScript interfaces for the state shape including symbols, prices, loading, errors, and pagination
4. THE Discover_Page SHALL use typed selectors and actions from the Trading_Slice
5. THE TypeScript compiler SHALL report no type errors in the trading integration code

### Requirement 10: Performance Optimization

**User Story:** As a user, I want the discover page to load quickly and respond smoothly, so that I have a good browsing experience.

#### Acceptance Criteria

1. THE Trading_Slice SHALL fetch price data only for symbols currently visible on the page
2. THE Discover_Page SHALL avoid unnecessary re-renders when Redux state updates
3. THE Trading_Slice SHALL cache price data to avoid redundant API calls for the same symbol
4. WHEN the user changes the Category_Filter, THE Discover_Page SHALL filter locally without re-fetching symbols
5. THE Discover_Page SHALL use React.memo or useMemo for expensive computations where appropriate
