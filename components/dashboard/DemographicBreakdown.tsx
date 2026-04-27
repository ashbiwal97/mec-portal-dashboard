'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDemographicData, getDemographicTotal } from '@/lib/mock-data';
import { useMarketplace } from '@/lib/marketplace-context';

const REGION_COLORS = ['#3AA2B7', '#6366F1', '#8B5CF6', '#A855F7', '#CBD5E1'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, total }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const count = Math.round((value / 100) * total);
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-md px-3 py-2 text-[12px]">
      <span className="font-semibold text-[#231F20]">{name}</span>
      <span className="text-[#6A7282] ml-2">{count.toLocaleString()}</span>
      <span className="text-[#9CA3AF] ml-1">({value}%)</span>
    </div>
  );
}

export function DemographicBreakdown() {
  const [tab, setTab] = useState<'buyers' | 'sellers'>('buyers');
  const { selectedMarketplaces } = useMarketplace();

  const data = getDemographicData(selectedMarketplaces, tab);
  const total = getDemographicTotal(selectedMarketplaces, tab);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-medium text-[#231F20] leading-[32px]">Demographic Breakdown</h2>
        <Button size="sm" icon={<Download size={13} />}>Export</Button>
      </CardHeader>

      <CardBody className="!pt-0">
        {/* Buyers / Sellers tabs */}
        <div className="flex gap-0 border-b border-[#E5E7EB] mb-5">
          {(['buyers', 'sellers'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'px-4 py-2 text-sm font-medium capitalize transition-colors',
                tab === t
                  ? 'border-b-2 border-[#231F20] text-[#231F20] -mb-px'
                  : 'text-[#6A7282] hover:text-[#364153]',
              ].join(' ')}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Donut chart with center label */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={98}
                paddingAngle={4}
                cornerRadius={6}
                dataKey="value"
                nameKey="region"
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={REGION_COLORS[i % REGION_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[28px] font-bold text-[#231F20] leading-none">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6A7282] mt-1">
              Total {tab}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
          {data.map((d, i) => {
            const count = Math.round((d.value / 100) * total);
            return (
              <div key={d.region} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: REGION_COLORS[i % REGION_COLORS.length] }}
                />
                <span className="text-[11px] uppercase tracking-wide text-[#6A7282]">{d.region}</span>
                <span className="text-[11px] font-bold text-[#231F20]">{count.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
