'use client';

import { useState } from 'react';
import { Download, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { verticalColors, healthZone, verticals } from '@/lib/tokens';
import { marketplaceGrowthTimeline } from '@/lib/mock-data';
import { useMarketplace } from '@/lib/marketplace-context';

const PERIOD_MONTH_RANGES: Record<string, [number, number]> = {
  'Full Year': [0, 12],
  H1: [0, 6],
  H2: [6, 12],
  Q1: [0, 3],
  Q2: [3, 6],
  Q3: [6, 9],
  Q4: [9, 12],
};

const YEAR_OFFSETS: Record<string, number> = { '2024': -8, '2025': 0, '2026': 6 };

const YEARS = ['2024', '2025', '2026'];

function HealthZoneLegend() {
  return (
    <div className="flex items-center gap-4">
      {(Object.entries(healthZone) as [string, typeof healthZone.poor][]).map(([, zone]) => (
        <div key={zone.label} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
          <span className="text-[11px] font-medium text-[#6A7282]">{zone.range} {zone.label}</span>
        </div>
      ))}
    </div>
  );
}

// Map global time-range to a sensible default period
const TIME_RANGE_TO_PERIOD: Record<string, string> = {
  'Last 30 days':   'Q4',
  'Last 90 days':   'Q4',
  'Last 6 months':  'H2',
  'Last 12 months': 'Full Year',
  'YTD':            'Q1',
};

export function MarketplaceGrowth() {
  const { selectedMarketplaces, isAllSelected, timeRange } = useMarketplace();
  const [year, setYear] = useState('2025');

  const period = TIME_RANGE_TO_PERIOD[timeRange] ?? 'Full Year';

  const activeVerticals =
    isAllSelected || selectedMarketplaces.length === 0
      ? verticals
      : verticals.filter((v) => selectedMarketplaces.includes(v));

  const [start, end] = PERIOD_MONTH_RANGES[period] ?? [0, 12];
  const yearOffset = YEAR_OFFSETS[year] ?? 0;

  const chartData = marketplaceGrowthTimeline.slice(start, end).map((row) => {
    const adjusted: Record<string, number | string> = { month: row.month };
    activeVerticals.forEach((v) => {
      const base = row[v] as number;
      adjusted[v] = Math.max(10, Math.min(100, base + yearOffset));
    });
    return adjusted;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-[#101828] leading-[28px]">Marketplace Growth</h2>
          <p className="text-[14px] text-[#6A7282] leading-[20px]">Health Index (0–100) vs Target</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Select value={year} onChange={setYear} options={YEARS} className="w-24" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-[12px] text-[#6A7282]">
            <Clock size={12} />
            {period}
          </div>
          <div className="w-px h-6 bg-[#E5E7EB]" />
          <Button size="sm" icon={<Download size={13} />}>Export</Button>
        </div>
      </CardHeader>

      {/* Health zone legend */}
      <div className="px-6 pb-4">
        <HealthZoneLegend />
      </div>

      {/* Line chart — trend over time */}
      <div className="px-6 pb-6">
        <p className="text-[13px] font-medium text-[#363553] mb-4">Monthly Trend</p>
        <div aria-label="Monthly health index trend chart" role="img">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <ReferenceLine y={60} stroke={healthZone.good.color} strokeDasharray="4 2" strokeOpacity={0.6} />
              <ReferenceLine y={86} stroke={healthZone.excellent.color} strokeDasharray="4 2" strokeOpacity={0.6} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                itemStyle={{ padding: '1px 0' }}
              />
              {activeVerticals.map((v) => (
                <Line
                  key={v}
                  type="monotone"
                  dataKey={v}
                  stroke={verticalColors[v]}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Inline legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
          {activeVerticals.map((v) => (
            <div key={v} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: verticalColors[v] }} />
              <span className="text-[11px] text-[#364153]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
