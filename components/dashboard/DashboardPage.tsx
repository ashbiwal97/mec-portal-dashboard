'use client';

import { Select } from '@/components/ui/Select';
import { KpiCards } from './KpiCards';
import { MarketplaceGrowth } from './MarketplaceGrowth';
import { RfcMeetingAnalysis } from './RfcMeetingAnalysis';
import { PsiSellerDensity } from './PsiSellerDensity';
import { TopClients } from './TopClients';
import { DemographicBreakdown } from './DemographicBreakdown';
import { useMarketplace, MARKETPLACE_OPTIONS, TIME_RANGES } from '@/lib/marketplace-context';
import { Clock } from 'lucide-react';

// Global filter options: All + each individual marketplace
const GLOBAL_FILTER_OPTIONS = ['All Marketplaces', ...MARKETPLACE_OPTIONS];

export function DashboardPage() {
  const { selectedMarketplaces, setSelectedMarketplaces, isAllSelected, timeRange, setTimeRange } = useMarketplace();

  // Synthetic label when a subset (not all, not one) is selected
  const multiLabel =
    !isAllSelected && selectedMarketplaces.length > 1
      ? `${selectedMarketplaces.length} Marketplaces`
      : null;

  const globalFilterOptions = multiLabel
    ? [multiLabel, ...GLOBAL_FILTER_OPTIONS]
    : GLOBAL_FILTER_OPTIONS;

  const globalFilterValue =
    multiLabel ??
    (isAllSelected || selectedMarketplaces.length === 0
      ? 'All Marketplaces'
      : selectedMarketplaces[0]);

  function handleGlobalMarketplace(value: string) {
    if (multiLabel && value === multiLabel) return; // already in multi-select state
    if (value === 'All Marketplaces') {
      setSelectedMarketplaces([...MARKETPLACE_OPTIONS]);
    } else {
      setSelectedMarketplaces([value]);
    }
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

        {/* Global filters bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#605759]" />
              <Select value={timeRange} onChange={setTimeRange} options={TIME_RANGES} className="w-40" />
            </div>
            <Select
              value={globalFilterValue}
              onChange={handleGlobalMarketplace}
              options={globalFilterOptions}
              className="w-52"
            />
          </div>
          <p className="text-[12px] text-[#6A7282]">
            Last updated: <span className="font-medium text-[#231F20]">26 Apr 2026, 10:25 AM</span>
          </p>
        </div>

        {/* KPI Cards row */}
        <KpiCards />

        {/* Marketplace Growth — full width */}
        <MarketplaceGrowth />

        {/* RFC Meeting Analysis — full width */}
        <RfcMeetingAnalysis />

        {/* PSI & Seller Density — full width */}
        <PsiSellerDensity />

        {/* Bottom row: Top Clients + Demographic Breakdown — equal width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TopClients />
          <DemographicBreakdown />
        </div>

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </main>
  );
}
