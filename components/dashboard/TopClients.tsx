'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { topClients } from '@/lib/mock-data';
import { getHealthZone, healthZone } from '@/lib/tokens';
import { useMarketplace } from '@/lib/marketplace-context';

type Tier = 'all' | 'a-list' | 'b-list' | 'c-list';

const TABS: { label: string; key: Tier }[] = [
  { label: 'All', key: 'all' },
  { label: 'A-list', key: 'a-list' },
  { label: 'B-list', key: 'b-list' },
  { label: 'C-list', key: 'c-list' },
];

function filterByTierFrom(list: typeof topClients, tier: Tier) {
  if (tier === 'all') return list;
  if (tier === 'a-list') return list.filter((c) => c.score >= 86);
  if (tier === 'b-list') return list.filter((c) => c.score >= 60 && c.score <= 85);
  return list.filter((c) => c.score < 60);
}

export function TopClients() {
  const [tier, setTier] = useState<Tier>('all');
  const { selectedMarketplaces, isAllSelected } = useMarketplace();

  const marketplaceFiltered =
    isAllSelected || selectedMarketplaces.length === 0
      ? topClients
      : topClients.filter((c) => selectedMarketplaces.includes(c.marketplace));

  const clients = filterByTierFrom(marketplaceFiltered, tier);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-medium text-[#231F20] leading-[32px]">Top Performing Clients</h2>
        <Button size="sm" icon={<Download size={13} />}>Export</Button>
      </CardHeader>

      {/* Tier tabs */}
      <div className="px-6 flex gap-0 border-b border-[#E5E7EB]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTier(t.key)}
            className={[
              'px-4 py-2 text-sm font-medium transition-colors',
              tier === t.key
                ? 'border-b-2 border-[#231F20] text-[#231F20] -mb-px'
                : 'text-[#6A7282] hover:text-[#364153]',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <CardBody className="!pt-4">
        <div className="overflow-x-auto overflow-y-auto max-h-[336px]">
          <table className="w-full text-sm" aria-label="Top performing clients">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-[#E5E7EB]">
                {['Client', 'Marketplace', 'Deals', 'Revenue', 'Health Score'].map((h) => (
                  <th key={h} className="text-left pb-2 text-[12px] font-semibold text-[#6A7282] uppercase tracking-wide pr-4 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[13px] text-[#6A7282]">
                    No clients found for the selected marketplace{selectedMarketplaces.length > 1 ? 's' : ''} and tier
                  </td>
                </tr>
              ) : (
                clients.map((c, i) => {
                  const zone = getHealthZone(c.score);
                  const zd = healthZone[zone];
                  return (
                    <tr key={c.name} className={i < clients.length - 1 ? 'border-b border-[#F3F4F6]' : ''}>
                      <td className="py-3 pr-4 font-medium text-[#231F20]">{c.name}</td>
                      <td className="py-3 pr-4 text-[#605759]">{c.marketplace}</td>
                      <td className="py-3 pr-4 text-[#231F20]">{c.deals}</td>
                      <td className="py-3 pr-4 font-medium text-[#231F20]">{c.revenue}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${c.score}%`, backgroundColor: zd.color }}
                            />
                          </div>
                          <span className="text-[12px] font-medium" style={{ color: zd.color }}>{c.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
