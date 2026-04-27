'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  ChartGantt,
  ClipboardClock,
  HandCoins,
  IdCard,
  LayoutGrid,
  List,
  MapPin,
  MoreVertical,
  Search,
} from 'lucide-react';
import clsx from 'clsx';
import { publishedRfcs, type PublishedRfc } from '@/lib/mock-data';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const ALL_WEEK = 'This week';
const ALL_STATUS = 'Status';
const ALL_LOCATION = 'Location';
const STATUS_OPTIONS = ['Featured', 'Expiring Soon'] as const;

function getLocationLabel(location: string) {
  const parts = location.split(',');
  return parts[parts.length - 1].trim();
}

function getWeekLabel(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);
  const firstDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const weekOfMonth = Math.ceil((date.getUTCDate() + firstDay.getUTCDay()) / 7);
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  return `${month} Week ${weekOfMonth}`;
}

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getAttentionState(endDate: string) {
  const target = new Date(`${endDate}T00:00:00Z`).getTime();
  const today = new Date('2025-04-27T00:00:00Z').getTime();
  const daysLeft = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 3) {
    return {
      label: daysLeft <= 0 ? 'Closing today' : 'Expiring Soon',
      className: 'border border-rose-200 bg-rose-50 text-rose-700',
      isExpiringSoon: true,
    };
  }

  if (daysLeft <= 10) {
    return {
      label: 'Expiring Soon',
      className: 'border border-amber-200 bg-amber-50 text-amber-700',
      isExpiringSoon: true,
    };
  }

  return {
    label: `Ends ${formatDate(endDate)}`,
    className: 'border border-sky-200 bg-sky-50 text-sky-700',
    isExpiringSoon: false,
  };
}

function FilterPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#CDEEF5] bg-[#F0FBFE] px-2.5 py-1 text-[11px] font-medium text-[#25676E]">
      {label}
    </span>
  );
}

function PublishedMetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[160px] flex-1 px-1 py-1">
      <div className="flex items-center gap-2 text-[#586872]">
        <span className="flex-shrink-0">{icon}</span>
        <span className="text-[14px] font-semibold tracking-[-0.01em]">{label}</span>
      </div>
      <p className="mt-2 pl-6 text-[16px] font-semibold leading-6 text-[#3F4C57]">{value}</p>
    </div>
  );
}

function PublishedCard({
  item,
  view,
}: {
  item: PublishedRfc;
  view: 'grid' | 'list';
}) {
  const createdWeek = getWeekLabel(item.createdAt);
  const attention = getAttentionState(item.endDate);

  return (
    <div className="rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
      <div className={clsx('gap-5', view === 'grid' ? 'flex flex-col' : 'grid grid-cols-[168px_minmax(0,1fr)]')}>
        <div className="rounded-[16px] border border-[#EAF3F5] bg-gradient-to-b from-[#F8FDFF] to-[#EFF9FC] px-4 py-4">
          <div className="space-y-4">
            <div className="rounded-[14px] border border-white/80 bg-white/80 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <div className="flex items-center gap-2 text-[#516367]">
                <CalendarClock size={14} />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">End date</span>
              </div>
              <p className="mt-2 text-[15px] font-semibold text-[#031317]">{formatDate(item.endDate)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-sm text-[#605759]">{item.rfcNumber}</span>
                  <FilterPill label={createdWeek} />
                  {item.featured && <FilterPill label="Featured" />}
                  {attention.isExpiringSoon && (
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium',
                        attention.className
                      )}
                    >
                      {attention.label}
                    </span>
                  )}
                </div>
                <p className="text-[17px] font-semibold text-[#256F7E]">{item.productName}</p>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
                <button
                  className="rounded-full p-1.5 text-[#605759] transition-colors hover:bg-[#F9FAFB] hover:text-[#231F20]"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h3 className="text-[22px] font-medium leading-8 text-[#031317]">{item.title}</h3>
              <p className="line-clamp-2 text-sm leading-6 text-[#384D51]">{item.description}</p>
            </div>
          </div>

          <div className="border-y border-[#EEF2F4] py-4">
            <div
              className={clsx(
                view === 'list'
                  ? 'grid grid-cols-4 gap-x-6 gap-y-4'
                  : 'grid grid-cols-2 gap-x-6 gap-y-4'
              )}
            >
              <PublishedMetaItem icon={<MapPin size={14} />} label="Service location" value={item.location} />
              <PublishedMetaItem icon={<ChartGantt size={14} />} label="Eligibility" value={item.eligibility} />
              <PublishedMetaItem icon={<ClipboardClock size={14} />} label="Timeline" value={item.timeline} />
              <PublishedMetaItem icon={<HandCoins size={14} />} label="Budget" value={item.budget} />
            </div>
          </div>

          <div className="h-px bg-[#EEF2F4]" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#F0FBFE] p-2 text-[#25676E]">
                  <IdCard size={14} className="flex-shrink-0" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6A7282]">Owner</p>
                  <p className="text-sm font-medium text-[#384D51]">{item.owner}</p>
                </div>
              </div>
            </div>

            <Link href={`/manage-rfcs/published/${item.id}`}>
              <Button
                variant="primary"
                size="md"
                className="h-10 gap-1.5 rounded-full px-4 text-[14px] font-semibold"
              >
                View details
              </Button>
            </Link>
          </div>
        </div>
        </div>
      </div>
  );
}

export function PublishedRfcList() {
  const [search, setSearch] = useState('');
  const [weekFilter, setWeekFilter] = useState(ALL_WEEK);
  const [statusFilter, setStatusFilter] = useState(ALL_STATUS);
  const [locationFilter, setLocationFilter] = useState(ALL_LOCATION);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const weekOptions = useMemo(
    () => [ALL_WEEK, ...Array.from(new Set(publishedRfcs.map((item) => getWeekLabel(item.createdAt))))],
    []
  );
  const locationOptions = useMemo(
    () => [ALL_LOCATION, ...Array.from(new Set(publishedRfcs.map((item) => getLocationLabel(item.location))))],
    []
  );

  const filtered = publishedRfcs.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.rfcNumber.toLowerCase().includes(q) ||
      item.productName.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q);
    const matchesWeek = weekFilter === ALL_WEEK || getWeekLabel(item.createdAt) === weekFilter;
    const attention = getAttentionState(item.endDate);
    const matchesStatus =
      statusFilter === ALL_STATUS ||
      (statusFilter === 'Featured' && item.featured) ||
      (statusFilter === 'Expiring Soon' && attention.isExpiringSoon);
    const matchesLocation = locationFilter === ALL_LOCATION || getLocationLabel(item.location) === locationFilter;
    return matchesSearch && matchesWeek && matchesStatus && matchesLocation;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[24px] border border-[#E9EEF1] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-[280px] flex-1 flex-wrap items-center gap-4">
            <div className="relative w-full max-w-[760px] min-w-[320px] flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#908386]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for RFC Number, Name,"
                className="h-12 w-full rounded-full border border-[#E5E7EB] bg-white pl-10 pr-5 text-[15px] text-[#231F20] placeholder:text-[#908386] shadow-[0_2px_6px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#3AA2B7]"
              />
            </div>

            <Select
              value={weekFilter}
              onChange={setWeekFilter}
              options={weekOptions}
              className="w-[148px]"
              selectClassName="h-12 rounded-full border-dashed border-[#D7E6EA] bg-white px-5 pr-10 text-[15px] text-[#4F5565] shadow-none"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[ALL_STATUS, ...STATUS_OPTIONS]}
              className="w-[160px]"
              selectClassName="h-12 rounded-full border-dashed border-[#D7E6EA] bg-white px-5 pr-10 text-[15px] text-[#4F5565] shadow-none"
            />
            <Select
              value={locationFilter}
              onChange={setLocationFilter}
              options={locationOptions}
              className="mr-2 w-[168px]"
              selectClassName="h-12 rounded-full border-dashed border-[#D7E6EA] bg-white px-5 pr-10 text-[15px] text-[#4F5565] shadow-none"
            />
          </div>

          <div className="rounded-full border border-[#3AA2B7] bg-white p-0.5 shadow-[0_2px_6px_rgba(15,23,42,0.04)]">
            <div className="flex items-center overflow-hidden rounded-full">
              <button
                onClick={() => setView('grid')}
                className={clsx(
                  'flex h-12 w-12 items-center justify-center transition-colors',
                  view === 'grid' ? 'bg-[#3AA2B7] text-white' : 'text-[#605759] hover:bg-[#F0FBFE]'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={clsx(
                  'flex h-12 w-12 items-center justify-center transition-colors',
                  view === 'list' ? 'bg-[#3AA2B7] text-white' : 'text-[#605759] hover:bg-[#F0FBFE]'
                )}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={clsx(view === 'grid' ? 'grid grid-cols-1 gap-4 xl:grid-cols-2' : 'flex flex-col gap-4')}>
        {filtered.map((item) => (
          <PublishedCard key={item.id} item={item} view={view} />
        ))}
      </div>
    </div>
  );
}
