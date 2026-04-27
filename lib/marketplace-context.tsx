'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { MARKETPLACES } from './mock-data';

const MARKETPLACE_OPTIONS = MARKETPLACES.filter((m) => m !== 'All Marketplaces');

export const TIME_RANGES = ['Last 30 days', 'Last 90 days', 'Last 6 months', 'Last 12 months', 'YTD'];

/** Returns [startIndex, endIndex) into the 12-month data arrays */
export function getMonthSlice(timeRange: string): [number, number] {
  switch (timeRange) {
    case 'Last 30 days':  return [11, 12];
    case 'Last 90 days':  return [9, 12];
    case 'Last 6 months': return [6, 12];
    case 'YTD':           return [0, 4];   // Jan–Apr (current month Apr 2026)
    default:              return [0, 12];  // Last 12 months
  }
}

interface MarketplaceContextType {
  selectedMarketplaces: string[];
  setSelectedMarketplaces: (v: string[]) => void;
  isAllSelected: boolean;
  effectiveMarketplace: string;
  timeRange: string;
  setTimeRange: (v: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([...MARKETPLACE_OPTIONS]);
  const [timeRange, setTimeRange] = useState(TIME_RANGES[3]); // default: Last 12 months

  const isAllSelected = selectedMarketplaces.length === MARKETPLACE_OPTIONS.length;

  const effectiveMarketplace =
    selectedMarketplaces.length === 0 || isAllSelected
      ? 'All Marketplaces'
      : selectedMarketplaces.length === 1
      ? selectedMarketplaces[0]
      : 'All Marketplaces';

  return (
    <MarketplaceContext.Provider value={{ selectedMarketplaces, setSelectedMarketplaces, isAllSelected, effectiveMarketplace, timeRange, setTimeRange }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return ctx;
}

export { MARKETPLACE_OPTIONS };
