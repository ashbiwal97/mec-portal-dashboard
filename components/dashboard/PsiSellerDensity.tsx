'use client';

import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { getPsiData } from '@/lib/mock-data';
import { useMarketplace, getMonthSlice } from '@/lib/marketplace-context';

const PSI_COLOR = '#6366F1';
const DENSITY_COLOR = '#F59E0B';

const PSI_OPTIONS = ['All PSIs', 'PSI Alpha', 'PSI Beta', 'PSI Gamma'];

function TrendBadge({ value, unit = '' }: { value: number; unit?: string }) {
  if (value > 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
      <TrendingUp size={10} /> +{value}{unit}
    </span>
  );
  if (value < 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
      <TrendingDown size={10} /> {value}{unit}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
      <Minus size={10} /> No change
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const psi = payload.find((p: any) => p.dataKey === 'psi');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const density = payload.find((p: any) => p.dataKey === 'sellerDensity');
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-md px-3 py-2.5 text-[12px] min-w-[150px]">
      <p className="font-semibold text-[#231F20] mb-1.5">{label}</p>
      {psi && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-[#6A7282]">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: PSI_COLOR }} />
            PSI Index
          </span>
          <span className="font-semibold text-[#231F20]">{psi.value}</span>
        </div>
      )}
      {density && (
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[#6A7282]">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: DENSITY_COLOR }} />
            Seller Density
          </span>
          <span className="font-semibold text-[#231F20]">{density.value} sellers</span>
        </div>
      )}
    </div>
  );
}

export function PsiSellerDensity() {
  const [psi, setPsi] = useState(PSI_OPTIONS[0]);
  const { selectedMarketplaces, timeRange } = useMarketplace();

  const [sliceStart, sliceEnd] = getMonthSlice(timeRange);
  const psiSellerData = getPsiData(selectedMarketplaces, psi).slice(sliceStart, sliceEnd);

  const latestIdx = psiSellerData.length - 1;
  const prevIdx = Math.max(0, latestIdx - 1);

  const currentPsi = psiSellerData[latestIdx]?.psi ?? 0;
  const prevPsi = psiSellerData[prevIdx]?.psi ?? 0;
  const psiDelta = latestIdx > 0 ? currentPsi - prevPsi : 0;

  const currentDensity = psiSellerData[latestIdx]?.sellerDensity ?? 0;
  const prevDensity = psiSellerData[prevIdx]?.sellerDensity ?? 0;
  const densityDelta = latestIdx > 0 ? currentDensity - prevDensity : 0;

  const avgPsi = Math.round(psiSellerData.reduce((s, d) => s + d.psi, 0) / psiSellerData.length);
  const psiMax = Math.max(...psiSellerData.map((d) => d.psi));
  const densityMax = Math.max(...psiSellerData.map((d) => d.sellerDensity));

  return (
    <Card>
      <CardHeader>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-medium text-[#231F20] leading-[32px]">Trending PSI &amp; Seller Density</h2>
          <p className="text-[12px] text-[#717182] leading-[16px] uppercase tracking-wide mt-0.5">
            Monthly performance indicators
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Select value={psi} onChange={setPsi} options={PSI_OPTIONS} className="w-32" />
          <Button size="sm" icon={<Download size={13} />}>Export</Button>
        </div>
      </CardHeader>

      <CardBody>
        {/* KPI stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
            <p className="text-[11px] text-[#6A7282] uppercase tracking-wide mb-1">Current PSI</p>
            <p className="text-2xl font-bold leading-none mb-1.5" style={{ color: PSI_COLOR }}>{currentPsi}</p>
            <TrendBadge value={psiDelta} />
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
            <p className="text-[11px] text-[#6A7282] uppercase tracking-wide mb-1">Seller Density</p>
            <p className="text-2xl font-bold leading-none mb-1.5" style={{ color: DENSITY_COLOR }}>{currentDensity}</p>
            <TrendBadge value={densityDelta} unit=" sellers" />
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
            <p className="text-[11px] text-[#6A7282] uppercase tracking-wide mb-1">Avg PSI ({psiSellerData.length}m)</p>
            <p className="text-2xl font-bold text-[#364153] leading-none mb-1.5">{avgPsi}</p>
            <span className="text-[11px] text-[#6A7282]">Peak: <strong className="text-[#364153]">{psiMax}</strong></span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-0.5 rounded-full" style={{ backgroundColor: PSI_COLOR }} />
            <span className="w-2 h-2 rounded-full border-2" style={{ borderColor: PSI_COLOR }} />
            <span className="text-[12px] font-medium text-[#364153]">PSI Index</span>
            <span className="text-[11px] text-[#9CA3AF]">left axis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-3 rounded opacity-70" style={{ backgroundColor: DENSITY_COLOR }} />
            <span className="text-[12px] font-medium text-[#364153]">Seller Density</span>
            <span className="text-[11px] text-[#9CA3AF]">right axis</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="inline-block w-5 border-t-2 border-dashed border-[#9CA3AF]" />
            <span className="text-[11px] text-[#9CA3AF]">PSI avg ({avgPsi})</span>
          </div>
        </div>

        {/* Dual-axis chart */}
        <div aria-label="PSI index and seller density dual-axis chart" role="img">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={psiSellerData} margin={{ top: 8, right: 52, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={DENSITY_COLOR} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={DENSITY_COLOR} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="psi"
                orientation="left"
                domain={[0, Math.ceil(psiMax * 1.25)]}
                tick={{ fontSize: 11, fill: PSI_COLOR }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <YAxis
                yAxisId="density"
                orientation="right"
                domain={[0, Math.ceil(densityMax * 1.15)]}
                tick={{ fontSize: 11, fill: DENSITY_COLOR }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v) => `${v}`}
              />
              <ReferenceLine
                yAxisId="psi"
                y={avgPsi}
                stroke="#9CA3AF"
                strokeDasharray="5 3"
                strokeWidth={1.5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
              <Area
                yAxisId="density"
                type="monotone"
                dataKey="sellerDensity"
                fill="url(#densityGradient)"
                stroke={DENSITY_COLOR}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: DENSITY_COLOR, strokeWidth: 0 }}
              />
              <Line
                yAxisId="psi"
                type="monotone"
                dataKey="psi"
                stroke={PSI_COLOR}
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#fff', stroke: PSI_COLOR, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: PSI_COLOR, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
