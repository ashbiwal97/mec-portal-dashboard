'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  ChartGantt,
  ClipboardClock,
  HandCoins,
  IdCard,
  Pencil,
  LayoutGrid,
  List,
  MoreVertical,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import {
  rfcRequests,
  rfcDrafts,
  type BaseRfcItem,
  type DraftStatus,
  type RfcDraft,
  type RfcRequest,
  type RfcStatus,
} from '@/lib/mock-data';
import { Select } from '@/components/ui/Select';

type CollectionVariant = 'requests' | 'drafts';

type StatusTone = { bg: string; text: string };

const REQUEST_STATUS_COLORS: Record<RfcStatus, StatusTone> = {
  Active: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Pending: { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Under Review': { bg: 'bg-blue-100', text: 'text-blue-800' },
  Closed: { bg: 'bg-slate-200', text: 'text-slate-700' },
};

const DRAFT_STATUS_COLORS: Record<DraftStatus, StatusTone> = {
  'In Progress': { bg: 'bg-sky-100', text: 'text-sky-800' },
  'Pending Review': { bg: 'bg-violet-100', text: 'text-violet-800' },
  'Needs Revision': { bg: 'bg-rose-100', text: 'text-rose-800' },
  'Ready to Publish': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
};

const REQUEST_STATUS_OPTIONS: RfcStatus[] = ['Active', 'Pending', 'Under Review', 'Closed'];
const DRAFT_STATUS_OPTIONS: DraftStatus[] = ['In Progress', 'Pending Review', 'Needs Revision', 'Ready to Publish'];
const ALL_WEEKS = 'Week selection';
const ALL_STATUS = 'Statuses';
const ALL_LOCATIONS = 'Location';

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

function formatCreatedDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function FilterPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#CDEEF5] bg-[#F0FBFE] px-2.5 py-1 text-[11px] font-medium text-[#25676E]">
      {label}
    </span>
  );
}

function MetaItem({
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

function RfcCard({
  item,
  view,
  statusColors,
  ctaLabel,
  disableEdit,
  editHref,
}: {
  item: BaseRfcItem;
  view: 'grid' | 'list';
  statusColors: Record<string, StatusTone>;
  ctaLabel: string;
  disableEdit?: boolean;
  editHref: string;
}) {
  const statusStyle = statusColors[item.status] ?? { bg: 'bg-slate-100', text: 'text-slate-700' };
  const createdWeek = getWeekLabel(item.createdAt);

  return (
    <div className="rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-sm text-[#605759]">{item.rfcNumber}</span>
                  <FilterPill label={createdWeek} />
                </div>
                <p className="text-[17px] font-semibold text-[#256F7E]">{item.productName}</p>
              </div>

              <div className="flex items-center gap-2.5 pt-0.5">
                <span
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-[12px] font-bold leading-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]',
                    statusStyle.bg,
                    statusStyle.text
                  )}
                >
                  {item.status}
                </span>
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
              <MetaItem icon={<MapPin size={14} />} label="Service location" value={item.location} />
              <MetaItem icon={<ChartGantt size={14} />} label="Eligibility" value={item.eligibility} />
              <MetaItem icon={<ClipboardClock size={14} />} label="Timeline" value={item.timeline} />
              <MetaItem icon={<HandCoins size={14} />} label="Budget" value={item.budget} />
            </div>
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

            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6A7282]">Created</p>
              <p className="text-sm font-medium text-[#384D51]">{formatCreatedDate(item.createdAt)}</p>
            </div>
          </div>

          {disableEdit ? (
            <button
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F8FAFB] px-4 py-2 text-sm font-semibold text-[#9AA4AF]"
            >
              <Pencil size={14} />
              Editing unavailable
            </button>
          ) : (
            <Link
              href={editHref}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#3AA2B7] bg-[#3AA2B7] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(58,162,183,0.18)] transition-colors hover:border-[#2E8FA2] hover:bg-[#2E8FA2]"
            >
              <Pencil size={14} />
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  onClear,
  title,
  description,
}: {
  onClear: () => void;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#CDEEF5] bg-gradient-to-br from-white to-[#F7FDFF] px-8 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F9FD] text-[#25676E]">
        <Search size={20} />
      </div>
      <h3 className="text-xl font-medium text-[#231F20]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#605759]">{description}</p>
      <button
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3AA2B7] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2E8FA2]"
      >
        <X size={14} />
        Clear filters
      </button>
    </div>
  );
}

function RfcCollectionList({
  items,
  variant,
}: {
  items: BaseRfcItem[];
  variant: CollectionVariant;
}) {
  const [search, setSearch] = useState('');
  const [weekFilter, setWeekFilter] = useState<string>(ALL_WEEKS);
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);
  const [locationFilter, setLocationFilter] = useState<string>(ALL_LOCATIONS);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const statusOptions = variant === 'drafts' ? DRAFT_STATUS_OPTIONS : REQUEST_STATUS_OPTIONS;
  const statusColors = variant === 'drafts' ? DRAFT_STATUS_COLORS : REQUEST_STATUS_COLORS;
  const ctaLabel = variant === 'drafts' ? 'Continue Edit' : 'Edit RFC';
  const totalLabel = variant === 'drafts' ? 'draft RFCs' : 'RFC requests';
  const emptyTitle =
    variant === 'drafts' ? 'No draft RFCs match these filters' : 'No RFC requests match these filters';
  const emptyDescription =
    variant === 'drafts'
      ? 'Try broadening your search or reset the current week, status, and location filters to find the draft you want to continue editing.'
      : 'Try broadening your search or reset the current week, status, and location filters to explore more requests.';

  const weekOptions = useMemo(
    () => [ALL_WEEKS, ...Array.from(new Set(items.map((item) => getWeekLabel(item.createdAt))))],
    [items]
  );

  const locationOptions = useMemo(
    () => [ALL_LOCATIONS, ...Array.from(new Set(items.map((item) => getLocationLabel(item.location))))],
    [items]
  );

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const week = getWeekLabel(item.createdAt);
    const location = getLocationLabel(item.location);

    const matchesSearch =
      !q ||
      item.rfcNumber.toLowerCase().includes(q) ||
      item.productName.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.owner.toLowerCase().includes(q);

    const matchesWeek = weekFilter === ALL_WEEKS || week === weekFilter;
    const matchesStatus = statusFilter === ALL_STATUS || item.status === statusFilter;
    const matchesLocation = locationFilter === ALL_LOCATIONS || location === locationFilter;

    return matchesSearch && matchesWeek && matchesStatus && matchesLocation;
  });

  const hasActiveFilters =
    search.trim().length > 0 ||
    weekFilter !== ALL_WEEKS ||
    statusFilter !== ALL_STATUS ||
    locationFilter !== ALL_LOCATIONS;

  function clearFilters() {
    setSearch('');
    setWeekFilter(ALL_WEEKS);
    setStatusFilter(ALL_STATUS);
    setLocationFilter(ALL_LOCATIONS);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-[280px] flex-1 flex-wrap items-center gap-3">
              <div className="relative min-w-[280px] w-full max-w-[660px]">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#908386]" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by RFC number, product, title, or owner"
                  className="h-10 w-full rounded-full border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#231F20] shadow-[0_2px_2px_rgba(0,0,0,0.05)] placeholder:text-[#908386] focus:outline-none focus:ring-2 focus:ring-[#3AA2B7]"
                />
              </div>

              <Select
                value={weekFilter}
                onChange={setWeekFilter}
                options={weekOptions}
                className="w-40"
                selectClassName="h-10 rounded-full pl-5 pr-10 text-[15px] shadow-[0_2px_2px_rgba(0,0,0,0.05)]"
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={[ALL_STATUS, ...statusOptions]}
                className="w-40"
                selectClassName="h-10 rounded-full pl-5 pr-10 text-[15px] shadow-[0_2px_2px_rgba(0,0,0,0.05)]"
              />
              <Select
                value={locationFilter}
                onChange={setLocationFilter}
                options={locationOptions}
                className="mr-3 w-40"
                selectClassName="h-10 rounded-full pl-5 pr-10 text-[15px] shadow-[0_2px_2px_rgba(0,0,0,0.05)]"
              />
            </div>

            <div className="rounded-full border border-[#D7E6EA] bg-[#F9FCFD] p-1 shadow-[0_2px_6px_rgba(15,23,42,0.04)]">
              <div className="flex flex-shrink-0 items-center overflow-hidden rounded-full border border-[#3AA2B7] bg-white">
                <button
                  onClick={() => setView('grid')}
                  className={clsx(
                    'flex h-9 w-11 items-center justify-center transition-colors',
                    view === 'grid' ? 'bg-[#3AA2B7] text-white' : 'text-[#605759] hover:bg-[#F0FBFE]'
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={clsx(
                    'flex h-9 w-11 items-center justify-center transition-colors',
                    view === 'list' ? 'bg-[#3AA2B7] text-white' : 'text-[#605759] hover:bg-[#F0FBFE]'
                  )}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F3F4F6] pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[#231F20]">
                Showing {filtered.length} of {items.length} {totalLabel}
              </span>
              {hasActiveFilters && <FilterPill label="Filtered results" />}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#25676E] transition-colors hover:text-[#1a5561]"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState onClear={clearFilters} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className={clsx(view === 'grid' ? 'grid grid-cols-1 gap-4 xl:grid-cols-2' : 'flex flex-col gap-6')}>
          {filtered.map((item) => (
            <RfcCard
              key={item.id}
              item={item}
              view={view}
              statusColors={statusColors}
              ctaLabel={ctaLabel}
              disableEdit={variant === 'requests' && item.status === 'Closed'}
              editHref={variant === 'drafts' ? `/manage-rfcs/drafts/${item.id}/edit` : `/manage-rfcs/${item.id}/edit`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RfcRequestsList() {
  return <RfcCollectionList items={rfcRequests} variant="requests" />;
}

export function RfcDraftsList() {
  return <RfcCollectionList items={rfcDrafts} variant="drafts" />;
}

export type { RfcRequest, RfcDraft };
