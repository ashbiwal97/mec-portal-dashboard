'use client';

import { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { getRfcData, MONTHS_OPTIONS } from '@/lib/mock-data';
import { useMarketplace, getMonthSlice } from '@/lib/marketplace-context';

const CREATED_COLOR = '#6366F1';
const MATCHED_COLOR = '#10B981';

export function RfcMeetingAnalysis() {
  const [month, setMonth] = useState(MONTHS_OPTIONS[0]);
  const { selectedMarketplaces, timeRange } = useMarketplace();

  const allData = getRfcData(selectedMarketplaces, 'All Months');
  const [sliceStart, sliceEnd] = getMonthSlice(timeRange);
  const data = month === 'All Months'
    ? allData.slice(sliceStart, sliceEnd)
    : getRfcData(selectedMarketplaces, month);
  const totalCreated = data.reduce((s, d) => s + d.Created, 0);
  const totalMatched = data.reduce((s, d) => s + d.Matched, 0);
  const growthPct = totalCreated > 0
    ? Math.round((totalMatched / totalCreated) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-medium text-[#231F20] leading-[32px]">RFC Meeting Analysis</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[34px] font-bold text-[#10B981] leading-[42px]">{growthPct}%</span>
            <TrendingUp size={18} className="text-[#10B981] mb-1" />
            <span className="text-[13px] text-[#605759]">match rate</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Select value={month} onChange={setMonth} options={MONTHS_OPTIONS} className="w-32" />
          <Button size="sm" icon={<Download size={13} />}>Export</Button>
        </div>
      </CardHeader>

      <CardBody>
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-[#EEF2FF] px-4 py-3">
            <p className="text-[12px] text-[#605759] leading-[16px]">RFCs Created</p>
            <p className="text-xl font-semibold text-[#6366F1] leading-[28px]">{totalCreated}</p>
          </div>
          <div className="rounded-xl bg-[#ECFDF5] px-4 py-3">
            <p className="text-[12px] text-[#605759] leading-[16px]">Matched</p>
            <p className="text-xl font-semibold text-[#10B981] leading-[28px]">{totalMatched}</p>
          </div>
        </div>

        {/* Bar chart */}
        <div aria-label="RFC created vs matched bar chart" role="img">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                cursor={{ fill: '#F9FAFB' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="Created" fill={CREATED_COLOR} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Matched" fill={MATCHED_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}
