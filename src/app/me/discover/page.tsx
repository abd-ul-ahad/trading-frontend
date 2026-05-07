'use client';

import { useEffect, useMemo, memo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
  fetchSymbols,
  fetchVisibleSymbolsPrices,
  setCategoryFilter,
  setPage,
  resetPagination,
} from '@/lib/redux/features/trading/tradingSlice';
import {
  selectVisibleSymbolsWithPrices,
  selectCategoryFilter,
  selectPaginationMetadata,
  selectSymbolsLoading,
  selectSymbolsError,
  selectIsLoading,
} from '@/lib/redux/features/trading/tradingSelectors';
import type { CategoryFilter, SymbolWithPrice } from '@/lib/trading-api/types';

/**
 * Task 7.3: Performance Optimization - Memoized helper function
 * 
 * Returns category-specific styling (text color and background color).
 * This function is pure and can be safely used in useMemo.
 */
function getCategoryColor(category: CategoryFilter) {
  switch (category) {
    case 'metals': return { text: 'text-[#c9a44a]', bg: 'bg-[rgba(200,160,60,0.15)]' };
    case 'forex': return { text: 'text-[#9ec8ff]', bg: 'bg-[rgba(158,200,255,0.15)]' };
    case 'indices': return { text: 'text-[#c8b4ff]', bg: 'bg-[rgba(200,180,255,0.15)]' };
    case 'commodities': return { text: 'text-[#7effa8]', bg: 'bg-[rgba(126,255,168,0.15)]' };
    default: return { text: 'text-[#e8c84a]', bg: 'bg-[rgba(232,200,74,0.15)]' };
  }
}

/**
 * Task 7.3: Performance Optimization - Memoized SymbolCard Component
 * 
 * Wrapped in React.memo to prevent unnecessary re-renders when parent component
 * updates but this card's props haven't changed. This is especially important
 * when dealing with lists of items where only one item might change at a time.
 */
interface SymbolCardProps {
  symbolData: SymbolWithPrice;
  index: number;
  onRetryPrice: (symbol: string) => void;
}

const SymbolCard = memo(function SymbolCard({ symbolData, index, onRetryPrice }: SymbolCardProps) {
  const { symbol, price, priceLoading, priceError, category } = symbolData;
  
  // Task 7.3: Use useMemo for expensive computations
  // Calculate spread only when price changes
  const spread = useMemo(() => {
    return price ? (price.ask - price.bid).toFixed(5) : null;
  }, [price]);
  
  // Task 7.3: Memoize category styling to avoid recalculation on every render
  const categoryStyle = useMemo(() => getCategoryColor(category), [category]);

  return (
    <article
      className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[18px] p-6 transition-all hover:border-[rgba(200,160,60,0.18)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
      style={{ animation: `fadeUp 0.5s ease ${0.15 + index * 0.05}s both` }}
      aria-label={`Trading symbol ${symbol}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span 
              className={`font-mono text-[8.5px] tracking-[0.13em] uppercase px-2.5 py-1 rounded ${categoryStyle.text} ${categoryStyle.bg}`}
              aria-label={`Category: ${category}`}
            >
              {category}
            </span>
          </div>
          <h3 className="font-display text-[26px] md:text-[28px] font-normal text-white leading-tight tracking-[-0.01em]">
            {symbol}
          </h3>
        </div>
      </div>

      {/* Price display with loading and error states */}
      {/* Task 7.4: Added aria-live region for price loading states */}
      <div className="border-t border-[rgba(255,255,255,0.05)] pt-4 mb-4">
        {priceLoading ? (
          <div 
            className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#c8c3bb]"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            Loading price...
          </div>
        ) : priceError ? (
          <div className="flex items-center justify-between">
            <div 
              className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#ff9090]"
              role="alert"
              aria-live="assertive"
            >
              Price unavailable
            </div>
            <button
              onClick={() => onRetryPrice(symbol)}
              className="font-mono text-[15px] tracking-[0.12em] uppercase text-[#c8c3bb] hover:text-[#e8e2da] transition-colors"
              aria-label={`Retry loading price for ${symbol}`}
            >
              Retry
            </button>
          </div>
        ) : price ? (
          <div className="grid grid-cols-3 gap-4" role="group" aria-label="Price information">
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                Bid
              </div>
              <div className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em]" aria-label={`Bid price: ${price.bid.toFixed(5)}`}>
                {price.bid.toFixed(5)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                Ask
              </div>
              <div className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em]" aria-label={`Ask price: ${price.ask.toFixed(5)}`}>
                {price.ask.toFixed(5)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                Spread
              </div>
              <div className="font-outfit text-[18px] font-bold text-[#e8c84a] tracking-[-0.01em]" aria-label={`Spread: ${spread}`}>
                {spread}
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#c8c3bb]"
            role="status"
          >
            No price data
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button 
          className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-black bg-linear-to-r from-[#c9a44a] via-[#e8c84a] to-[#f5e090] rounded-lg px-5 py-2.5 transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(200,160,60,0.35)] whitespace-nowrap"
          aria-label={`Trade ${symbol}`}
        >
          Trade
        </button>
        <button 
          className="font-outfit text-[13px] font-medium tracking-[0.02em] text-[#c8c3bb] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 transition-all hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)] whitespace-nowrap"
          aria-label={`View details for ${symbol}`}
        >
          Details
        </button>
      </div>
    </article>
  );
});

export default function DiscoverPage() {
  const dispatch = useAppDispatch();
  
  // Task 7.4: Ref for focus management when pagination changes
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Redux selectors
  const visibleSymbols = useAppSelector(selectVisibleSymbolsWithPrices);
  const categoryFilter = useAppSelector(selectCategoryFilter);
  const paginationMetadata = useAppSelector(selectPaginationMetadata);
  const symbolsLoading = useAppSelector(selectSymbolsLoading);
  const symbolsError = useAppSelector(selectSymbolsError);
  const isLoading = useAppSelector(selectIsLoading);

  // Task 5.3: Fetch data on component mount
  useEffect(() => {
    dispatch(fetchSymbols());
  }, [dispatch]);

  // Task 5.3: Fetch prices for visible symbols when they change
  useEffect(() => {
    if (visibleSymbols.length > 0) {
      const symbolsToFetch = visibleSymbols.map(s => s.symbol);
      dispatch(fetchVisibleSymbolsPrices({ symbols: symbolsToFetch }));
    }
  }, [dispatch, visibleSymbols.length]);

  // Task 5.4: Handle filter changes
  const handleFilterChange = (filter: CategoryFilter) => {
    dispatch(setCategoryFilter(filter));
    dispatch(resetPagination());
  };

  // Task 5.5: Handle pagination
  const handlePreviousPage = () => {
    if (paginationMetadata.hasPreviousPage) {
      dispatch(setPage(paginationMetadata.currentPage - 1));
      // Task 7.4: Focus management - scroll to top of content when page changes
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextPage = () => {
    if (paginationMetadata.hasNextPage) {
      dispatch(setPage(paginationMetadata.currentPage + 1));
      // Task 7.4: Focus management - scroll to top of content when page changes
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Task 5.8: Handle retry for symbols fetch
  const handleRetrySymbols = () => {
    dispatch(fetchSymbols());
  };

  // Task 7.3: Memoize retry handler to prevent recreating on every render
  const handleRetryPrice = useMemo(() => {
    return (symbol: string) => {
      dispatch(fetchVisibleSymbolsPrices({ symbols: [symbol] }));
    };
  }, [dispatch]);

  // Task 7.3: Memoize filter buttons to avoid recreating on every render
  const filterButtons = useMemo(() => {
    const filters: Array<{ value: CategoryFilter; label: string; activeColor: string; activeBg: string }> = [
      { value: 'all', label: 'All', activeColor: 'text-[#e8c84a]', activeBg: 'bg-[rgba(232,200,74,0.06)]' },
      { value: 'metals', label: 'Metals', activeColor: 'text-[#c9a44a]', activeBg: 'bg-[rgba(200,160,60,0.06)]' },
      { value: 'forex', label: 'Forex', activeColor: 'text-[#9ec8ff]', activeBg: 'bg-[rgba(158,200,255,0.06)]' },
      { value: 'indices', label: 'Indices', activeColor: 'text-[#c8b4ff]', activeBg: 'bg-[rgba(200,180,255,0.06)]' },
      { value: 'commodities', label: 'Commodities', activeColor: 'text-[#7effa8]', activeBg: 'bg-[rgba(126,255,168,0.06)]' },
    ];

    return filters.map(filter => ({
      ...filter,
      isActive: categoryFilter === filter.value,
    }));
  }, [categoryFilter]);

  // Task 5.8: Show error state with retry
  if (symbolsError) {
    return (
      <main className="pt-[calc(68px+50px+44px)] pb-20 px-4 md:px-8 lg:px-24">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="font-display text-[24px] text-white">
            Unable to load trading symbols
          </div>
          <div className="font-mono text-[14px] text-[#c8c3bb]">
            {symbolsError}
          </div>
          <button
            onClick={handleRetrySymbols}
            className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-black bg-linear-to-r from-[#c9a44a] via-[#e8c84a] to-[#f5e090] rounded-lg px-5 py-2.5 transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(200,160,60,0.35)]"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[calc(68px+50px+44px)] pb-20 px-4 md:px-8 lg:px-24">
      {/* Task 7.4: Content ref for focus management */}
      <div ref={contentRef} tabIndex={-1} className="outline-none">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 md:mb-8 gap-4 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
          <div>
            <div className="font-display text-[32px] md:text-[40px] font-light text-white tracking-[-0.01em]">
              Discover new <em className="italic">opportunities.</em>
            </div>
            <div className="font-mono text-[12px] tracking-[0.14em] uppercase text-[#c8c3bb] mt-1">
              {/* Task 5.9: Show appropriate count or empty state message */}
              {symbolsLoading ? (
                'Loading symbols...'
              ) : paginationMetadata.totalItems === 0 ? (
                'No symbols available'
              ) : (
                `${paginationMetadata.totalItems} trading symbols available`
              )}
            </div>
          </div>
        </div>

      {/* Task 5.4: Filter buttons connected to Redux */}
      {/* Task 7.3: Using memoized filter buttons for better performance */}
      {/* Task 7.4: Added ARIA labels and role for accessibility */}
      <div 
        className="flex gap-1.5 mb-6 opacity-0 animate-[fadeUp_0.55s_ease_0.1s_both] overflow-x-auto pb-2"
        role="group"
        aria-label="Filter trading symbols by category"
      >
        {filterButtons.map(filter => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
              filter.isActive
                ? `${filter.activeColor} border-[rgba(232,200,74,0.4)] ${filter.activeBg}`
                : 'text-[#c8c3bb] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
            aria-label={`Filter by ${filter.label}`}
            aria-pressed={filter.isActive}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Task 5.7: Loading state */}
      {/* Task 7.4: Added aria-live region for loading state announcements */}
      {isLoading && visibleSymbols.length === 0 ? (
        <div 
          className="flex items-center justify-center min-h-[400px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="font-mono text-[14px] tracking-[0.12em] uppercase text-[#c8c3bb]">
            Loading symbols...
          </div>
        </div>
      ) : visibleSymbols.length === 0 ? (
        // Task 5.9: Empty state
        <div 
          className="flex flex-col items-center justify-center min-h-[400px] gap-2"
          role="status"
          aria-live="polite"
        >
          <div className="font-display text-[24px] text-white">
            No symbols found
          </div>
          <div className="font-mono text-[14px] text-[#c8c3bb]">
            {categoryFilter === 'all' 
              ? 'No trading symbols are currently available'
              : `No ${categoryFilter} symbols found. Try a different filter.`
            }
          </div>
        </div>
      ) : (
        <>
          {/* Task 5.6: Symbol cards with API data */}
          {/* Task 7.3: Using memoized SymbolCard component for better performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 opacity-0 animate-[fadeUp_0.6s_ease_0.15s_both]">
            {visibleSymbols.map((symbolData, idx) => (
              <SymbolCard
                key={symbolData.symbol}
                symbolData={symbolData}
                index={idx}
                onRetryPrice={handleRetryPrice}
              />
            ))}
          </div>

          {/* Task 5.5: Pagination controls */}
          {/* Task 7.4: Added navigation role and improved ARIA labels for pagination */}
          {paginationMetadata.totalPages > 1 && (
            <nav 
              className="flex items-center justify-center gap-4 mt-8"
              role="navigation"
              aria-label="Pagination navigation"
            >
              <button
                onClick={handlePreviousPage}
                disabled={!paginationMetadata.hasPreviousPage}
                className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-lg px-4 py-2 transition-all ${
                  paginationMetadata.hasPreviousPage
                    ? 'text-[#c8c3bb] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
                    : 'text-[rgba(200,195,187,0.3)] border-[rgba(255,255,255,0.03)] cursor-not-allowed'
                }`}
                aria-label={`Go to previous page, page ${paginationMetadata.currentPage - 1}`}
                aria-disabled={!paginationMetadata.hasPreviousPage}
              >
                Previous
              </button>
              
              <div 
                className="font-mono text-[13px] tracking-[0.12em] uppercase text-[#c8c3bb]"
                aria-current="page"
                aria-live="polite"
              >
                Page {paginationMetadata.currentPage} of {paginationMetadata.totalPages}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={!paginationMetadata.hasNextPage}
                className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-lg px-4 py-2 transition-all ${
                  paginationMetadata.hasNextPage
                    ? 'text-[#c8c3bb] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
                    : 'text-[rgba(200,195,187,0.3)] border-[rgba(255,255,255,0.03)] cursor-not-allowed'
                }`}
                aria-label={`Go to next page, page ${paginationMetadata.currentPage + 1}`}
                aria-disabled={!paginationMetadata.hasNextPage}
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
      </div>
    </main>
  );
}
