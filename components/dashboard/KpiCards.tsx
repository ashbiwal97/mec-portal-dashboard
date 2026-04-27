'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getKpiData } from '@/lib/mock-data';
import { useMarketplace } from '@/lib/marketplace-context';

export function KpiCards() {
  const { selectedMarketplaces, timeRange } = useMarketplace();
  const cards = getKpiData(selectedMarketplaces, timeRange);

  return (
    <section aria-label="Key performance indicators">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <KpiCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  trendUp: boolean;
}

function KpiCard({ title, value, description, trend, trendUp }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-[#363230] leading-[18px] line-clamp-2">{title}</p>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
            trendUp ? 'bg-[#ECFDF5]' : 'bg-[#FEF2F2]'
          }`}
          aria-hidden="true"
        >
          {trendUp ? (
            <ArrowUpRight size={14} className="text-[#16A34A]" />
          ) : (
            <ArrowDownRight size={14} className="text-[#EF4444]" />
          )}
        </span>
      </div>

      <div>
        <p className="text-2xl font-semibold text-[#231F20] leading-[32px]">{value}</p>
        <p className="text-[12px] text-[#605759] leading-[16px] mt-0.5">{description}</p>
      </div>

      <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${trendUp ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend} vs last month
      </div>
    </div>
  );
}
