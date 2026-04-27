'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpDown,
  Bookmark,
  Building2,
  CalendarPlus,
  Check,
  ClipboardClock,
  Copy,
  Download,
  Diff,
  ExternalLink,
  HatGlasses,
  Paperclip,
  MapPin,
  MessageSquare,
  Pencil,
  Star,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { publishedRfcs } from '@/lib/mock-data';
import { getHealthZone, healthZone } from '@/lib/tokens';

type TierFilter = 'All' | 'A-list' | 'B-list' | 'C-list';
const TIER_FILTERS: TierFilter[] = ['All', 'A-list', 'B-list', 'C-list'];
const OPP_TAGS = ['IRO', 'IRO+'] as const;
type PublishedTab = 'details' | 'rtcs' | 'meetings';

/* ─── Context menu definition ────────────────────────────────────────────── */

const CLIENT_MENU = [
  {
    group: 'Engagement',
    items: [
      { icon: <ExternalLink size={13} />, label: 'View Profile' },
      { icon: <MessageSquare size={13} />, label: 'Send Message' },
      { icon: <CalendarPlus size={13} />, label: 'Schedule Meeting' },
    ],
  },
  {
    group: 'Manage',
    items: [
      { icon: <Bookmark size={13} />, label: 'Add to Shortlist' },
      { icon: <ArrowUpDown size={13} />, label: 'Change Tier' },
      { icon: <Pencil size={13} />, label: 'Add Note' },
    ],
  },
  {
    group: 'Danger',
    items: [
      { icon: <Trash2 size={13} />, label: 'Remove from List', danger: true },
    ],
  },
] as const;

const RTC_MENU = [
  {
    group: 'Decision',
    items: [
      { icon: <Check size={13} />, label: 'Accept' },
      { icon: <X size={13} />, label: 'Reject', danger: true },
      { icon: <MessageSquare size={13} />, label: 'Request Info' },
    ],
  },
] as const;

/* ─── Tabs ─────────────────────────────────────────────────────────────── */

function Tabs({ rfcId, activeTab }: { rfcId: string; activeTab: PublishedTab }) {
  const items: Array<{ key: PublishedTab; label: string; enabled: boolean }> = [
    { key: 'details', label: 'RFC details', enabled: true },
    { key: 'rtcs', label: 'RTC list', enabled: true },
    { key: 'meetings', label: 'Meetings', enabled: false },
  ];

  return (
    <div className="rounded-full p-1.5" style={{ background: 'color-mix(in srgb, #9AE6FA 30%, white)' }}>
      <div className="flex">
        {items.map((item) =>
          item.enabled ? (
            <Link
              key={item.key}
              href={`/manage-rfcs/published/${rfcId}?tab=${item.key}`}
              className={clsx(
                'flex-1 rounded-full px-3 py-2.5 text-center text-base transition-colors',
                activeTab === item.key
                  ? 'bg-[#9AE6FA] font-bold text-[#031317] shadow-[1px_2px_4px_rgba(0,0,0,0.08)]'
                  : 'font-normal text-[#062026] hover:bg-white/60'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.key}
              type="button"
              disabled
              title="Coming soon"
              className="flex-1 cursor-not-allowed rounded-full px-3 py-2.5 text-base font-normal text-[#062026] opacity-50"
            >
              {item.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ─── Detail item ────────────────────────────────────────────────────────── */

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] px-[16px] py-[8px]">
      <div className="flex flex-col gap-[8px]">
        <span className="text-[#354245]">{icon}</span>
        <span className="text-[13px] leading-5 text-[#354245]">{label}</span>
      </div>
      <p className="text-[16px] font-medium leading-6 text-[#031317]">{value}</p>
    </div>
  );
}

/* ─── Content card ───────────────────────────────────────────────────────── */

function ContentCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[12px] border border-[#E8EAED] bg-white px-[16px] py-[12px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">
      <h2 className="text-[18px] font-medium leading-7 text-[#354245]">{title}</h2>
      <div className="mt-3 text-[16px] leading-7 text-[#384d51]">{children}</div>
    </section>
  );
}

/* ─── Tag pill ───────────────────────────────────────────────────────────── */

function Tag({ label }: { label: string }) {
  if (label === 'IRO+') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#FFF7ED] px-[8px] py-[3px] text-[11px] font-semibold text-[#C2610C] ring-1 ring-[#F9C584]">
        IRO+
      </span>
    );
  }
  if (label === 'IRO') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-[8px] py-[3px] text-[11px] font-semibold text-[#1D4ED8] ring-1 ring-[#BFDBFE]">
        IRO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#e4d8f0] px-[9px] py-[4px] text-[12px] text-[#7b6393]">
      {label}
    </span>
  );
}

/* ─── Stakeholder chip ───────────────────────────────────────────────────── */

function StakeholderChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between rounded-[8px] border border-[#dddbdb] bg-white pl-[16px] pr-[12px] py-[12px]">
      <span className="truncate text-[16px] text-[#384d51]">{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        className="ml-3 flex-shrink-0 transition-colors"
      >
        {copied
          ? <Check size={20} className="text-[#22C55E]" />
          : <Copy size={20} className="text-[#908386] hover:text-[#354245]" />}
      </button>
    </div>
  );
}

/* ─── Score bar ──────────────────────────────────────────────────────────── */

function ScoreBar({ score }: { score: number }) {
  const zone = getHealthZone(score);
  const color = healthZone[zone].color;
  return (
    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
  );
}

function SellerScoreBadge({
  score,
  tier,
}: {
  score: number;
  tier: 'A-list' | 'B-list' | 'C-list';
}) {
  const zone = getHealthZone(score);

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ backgroundColor: healthZone[zone].bg, color: healthZone[zone].color }}
      >
        {score}% fit
      </span>
      <span className="inline-flex rounded-full bg-[#F3F5F6] px-2.5 py-1 text-[11px] font-medium text-[#516367]">
        {tier}
      </span>
    </div>
  );
}

function RtcStatusBadge({ status }: { status: 'Under Review' | 'Pending' }) {
  const styles =
    status === 'Under Review'
      ? 'border border-[#D7E4FF] bg-[#EEF4FF] text-[#4F6FB6]'
      : 'border border-[#F6E3A8] bg-[#FFF7DD] text-[#B78100]';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.01em]',
        styles
      )}
    >
      {status}
    </span>
  );
}

function RtcMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function keyHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="RTC options"
        className={clsx(
          'flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors',
          open ? 'bg-[#E9F5F8] text-[#25676E]' : 'text-[#908386] hover:bg-[#F3F4F6] hover:text-[#516367]'
        )}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
          <circle cx="7.5" cy="2.5" r="1.25" />
          <circle cx="7.5" cy="7.5" r="1.25" />
          <circle cx="7.5" cy="12.5" r="1.25" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-[188px] overflow-hidden rounded-[10px] border border-[#E8EAED] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#908386]">Actions</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#908386] hover:text-[#516367]"
            >
              <X size={13} />
            </button>
          </div>

          {RTC_MENU.map((group) => (
            <div key={group.group} className="px-1.5 py-1.5">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] transition-colors',
                    'danger' in item && item.danger
                      ? 'text-[#DC2626] hover:bg-[#FEF2F2]'
                      : 'text-[#354245] hover:bg-[#F0FBFE] hover:text-[#25676E]'
                  )}
                >
                  <span className="flex-shrink-0 opacity-70">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RtcCard({
  rfcId,
  rtc,
}: {
  rfcId: string;
  rtc: {
    id: string;
    rfcCode: string;
    monthLabel: string;
    dayLabel: string;
    status: 'Under Review' | 'Pending';
    category: string;
    title: string;
    summary: string;
    sellerName: string;
    sellerOrganisation: string;
    attachmentCount: number;
    appliedOn: string;
  };
}) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#E8EAED] bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-shrink-0 flex-row border-b border-[#EFF3F4] bg-[linear-gradient(180deg,#FCFEFF_0%,#EAF9FD_72%,#CBEFFA_100%)] md:w-[132px] md:flex-col md:justify-end md:border-b-0 md:border-r">
          <div className="h-[88px] w-full md:h-full" />
          <div className="hidden h-[92px] bg-[linear-gradient(180deg,rgba(201,239,250,0)_0%,rgba(187,236,248,0.78)_100%)] md:block" />
        </div>

        <div className="flex-1 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#4A4345]">{rtc.rfcCode}</span>
                <Tag label={rtc.category} />
                <RtcStatusBadge status={rtc.status} />
              </div>
              <h3 className="mt-3 text-[16px] font-bold leading-8 text-[#4A4345] md:text-[17px]">
                {rtc.title}
              </h3>
              <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#516367]">{rtc.summary}</p>
            </div>
            <RtcMenu />
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-14">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[#E8EAED] bg-[linear-gradient(180deg,#EAF8DD_0%,#D0F0FA_100%)] text-sm font-semibold text-[#25676E] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  {rtc.sellerName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold leading-5 text-[#031317]">{rtc.sellerName}</p>
                  <p className="truncate text-[14px] leading-5 text-[#384D51]">{rtc.sellerOrganisation}</p>
                </div>
              </div>

              <div className="grid gap-3 text-[14px] text-[#384D51]">
                <div className="flex items-center gap-2.5">
                  <Paperclip size={14} className="text-[#6A7282]" />
                  <span>{rtc.attachmentCount} attachments</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ClipboardClock size={14} className="text-[#6A7282]" />
                  <span>
                    Applied on - <strong>{rtc.appliedOn}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-[#E8EAED] pt-4 md:border-t-0 md:pt-0">
              <button
                type="button"
                className="rounded-[22px] border border-[#3AA2B7] bg-white px-4 py-2 text-[14px] font-medium text-[#256F7E] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#F0FBFE]"
              >
                Book timeslot
              </button>
              <Link
                href={`/manage-rfcs/published/${rfcId}?tab=rtc-detail&rtc=${rtc.id}`}
                className="rounded-[22px] bg-[#256F7E] px-4 py-2 text-[14px] font-medium text-white shadow-[0_3px_8px_rgba(37,103,110,0.22)] transition-colors hover:bg-[#1F5C68]"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Client context menu ────────────────────────────────────────────────── */

function ClientMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function keyHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Client options"
        className={clsx(
          'flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors',
          open ? 'bg-[#E9F5F8] text-[#25676E]' : 'text-[#908386] hover:bg-[#F3F4F6] hover:text-[#516367]'
        )}
      >
        {/* Three dots rendered as SVG to avoid any import conflict */}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
          <circle cx="7.5" cy="2.5" r="1.25" />
          <circle cx="7.5" cy="7.5" r="1.25" />
          <circle cx="7.5" cy="12.5" r="1.25" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-[196px] overflow-hidden rounded-[10px] border border-[#E8EAED] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#908386]">Actions</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#908386] hover:text-[#516367]"
            >
              <X size={13} />
            </button>
          </div>

          {CLIENT_MENU.map((group, gi) => (
            <div key={group.group}>
              {gi > 0 && <div className="mx-3 border-t border-[#F3F4F6]" />}
              {group.group !== 'Danger' && (
                <p className="px-3 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-wide text-[#908386]">
                  {group.group}
                </p>
              )}
              <div className="px-1.5 pb-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setOpen(false)}
                    className={clsx(
                      'flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] transition-colors',
                      'danger' in item && item.danger
                        ? 'text-[#DC2626] hover:bg-[#FEF2F2]'
                        : 'text-[#354245] hover:bg-[#F0FBFE] hover:text-[#25676E]'
                    )}
                  >
                    <span className="flex-shrink-0 opacity-70">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export function PublishedRfcDetailsPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const found = publishedRfcs.find((item) => item.id === params?.id);
  const activeTab = (searchParams.get('tab') ?? 'details') as PublishedTab | 'rtc-detail';
  const selectedRtcId = searchParams.get('rtc');

  const [tierFilter, setTierFilter] = useState<TierFilter>('All');
  const [activeOppTags, setActiveOppTags] = useState<Set<string>>(new Set());

  if (!found) notFound();
  const rfc = found!;
  const selectedRtc = rfc.rtcList.find((rtc) => rtc.id === selectedRtcId) ?? rfc.rtcList[0];

  function toggleOppTag(tag: string) {
    setActiveOppTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  const filteredClients = rfc.potentialClients.filter((c) => {
    const tierMatch =
      tierFilter === 'All' || c.tags.some((t) => t.startsWith(tierFilter.charAt(0)));
    const oppMatch =
      activeOppTags.size === 0 ||
      [...activeOppTags].some((tag) => c.tags.includes(tag));
    return tierMatch && oppMatch;
  });

  function oppTagCount(tag: string) {
    return rfc.potentialClients.filter((c) => c.tags.includes(tag)).length;
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Tabs */}
      <Tabs rfcId={rfc.id} activeTab={activeTab} />

      {activeTab === 'rtcs' ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/manage-rfcs/published"
              className="flex items-center gap-1.5 text-[13px] text-[#516367] transition-colors hover:text-[#25676E]"
            >
              <ArrowLeft size={14} />
              Back to Published RFCs
            </Link>
            <span className="text-[#E8EAED]">·</span>
            <span className="rounded-full bg-[#E9F5F8] px-3 py-0.5 text-[12px] font-medium text-[#25676E]">
              {rfc.rfcNumber}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {rfc.rtcList.map((rtc) => (
              <RtcCard key={rtc.id} rfcId={rfc.id} rtc={rtc} />
            ))}
          </div>
        </div>
      ) : activeTab === 'rtc-detail' ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/manage-rfcs/published/${rfc.id}?tab=rtcs`}
              className="flex items-center gap-1.5 text-[13px] text-[#516367] transition-colors hover:text-[#25676E]"
            >
              <ArrowLeft size={14} />
              Back to RTC list
            </Link>
            <span className="text-[#E8EAED]">·</span>
            <span className="rounded-full bg-[#E9F5F8] px-3 py-0.5 text-[12px] font-medium text-[#25676E]">
              {selectedRtc.rfcCode}
            </span>
          </div>

          <section className="rounded-[12px] border border-[#E8EAED] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)]">
            <div className="border-b border-[#E8EAED] px-4 py-4 md:px-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Tag label={selectedRtc.category} />
                    <RtcStatusBadge status={selectedRtc.status} />
                  </div>
                  <h2 className="mt-3 text-[16px] font-bold leading-8 text-[#4A4345] md:text-[17px]">
                    {selectedRtc.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <SellerScoreBadge
                      score={rfc.sellerSnapshot.score}
                      tier={rfc.sellerSnapshot.tier}
                    />
                    <span className="inline-flex rounded-full bg-[#F3F5F6] px-2.5 py-1 text-[11px] font-medium text-[#516367]">
                      {rfc.sellerSnapshot.marketplace}
                    </span>
                    <span className="inline-flex rounded-full bg-[#F3F5F6] px-2.5 py-1 text-[11px] font-medium text-[#516367]">
                      {rfc.sellerSnapshot.region}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-[#384D51]">
                    <div className="flex items-center gap-2">
                      <ClipboardClock size={14} className="text-[#6A7282]" />
                      <span>
                        Applied on - <strong>{selectedRtc.appliedOn}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8EAED] bg-[linear-gradient(180deg,#EAF8DD_0%,#D0F0FA_100%)] text-xs font-semibold text-[#25676E]">
                        {selectedRtc.sellerName
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold leading-5 text-[#031317]">{selectedRtc.sellerName}</p>
                        <p className="text-[14px] leading-5 text-[#384D51]">{selectedRtc.sellerOrganisation}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 max-w-[840px] text-[14px] leading-7 text-[#516367]">
                    {selectedRtc.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="rounded-[22px] border border-[#3AA2B7] bg-white px-4 py-2 text-[14px] font-medium text-[#256F7E] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#F0FBFE]"
                  >
                    Request info
                  </button>
                  <button
                    type="button"
                    className="rounded-[22px] bg-[#256F7E] px-4 py-2 text-[14px] font-medium text-white shadow-[0_3px_8px_rgba(37,103,110,0.22)] transition-colors hover:bg-[#1F5C68]"
                  >
                    Book timeslot
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <section className="rounded-[10px] border border-[#E8EAED] bg-white">
                <div className="border-b border-[#E8EAED] px-4 py-3">
                  <h3 className="text-[16px] font-medium text-[#231F20]">Uploaded Documents</h3>
                </div>
                <div className="grid gap-2 p-3 md:grid-cols-2">
                  {selectedRtc.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between rounded-[8px] border border-[#E8EAED] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFCFC_100%)] px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={clsx(
                            'flex h-6 w-6 items-center justify-center rounded-[5px] text-[10px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]',
                            document.kind === 'pdf' ? 'bg-[#FF3B30]' : 'bg-[#2563EB]'
                          )}
                        >
                          {document.kind === 'pdf' ? 'P' : 'W'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-[#384D51]">{document.name}</p>
                          <p className="text-[11px] text-[#908386]">
                            {document.kind === 'pdf' ? 'PDF document' : 'Word document'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] text-[#6A7282] transition-colors hover:bg-[#F3F5F6] hover:text-[#354245]"
                      >
                        <Download size={15} />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-[10px] border border-[#E8EAED] bg-white">
                <div className="border-b border-[#E8EAED] px-4 py-3">
                  <h3 className="text-[16px] font-medium text-[#231F20]">Due Diligence Questionnaire Response</h3>
                </div>
                <div className="space-y-6 p-4">
                  {selectedRtc.questionnaire.map((item, index) => (
                    <div key={item.question} className="rounded-[10px] border border-[#EEF2F4] bg-[#FCFDFD] px-4 py-4">
                      <h4 className="text-[18px] font-medium leading-7 tracking-[0.15px] text-[#031317]">
                        {index + 1}. {item.question}
                      </h4>
                      <div className="mt-3 border-l-2 border-[#D7EEF5] pl-4 text-[16px] leading-7 text-[#384D51]">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* ── Full-width header ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/manage-rfcs/published"
                className="flex items-center gap-1.5 text-[13px] text-[#516367] transition-colors hover:text-[#25676E]"
              >
                <ArrowLeft size={14} />
                Back to Published RFCs
              </Link>
              <span className="text-[#E8EAED]">·</span>
              <span className="rounded-full bg-[#E9F5F8] px-3 py-0.5 text-[12px] font-medium text-[#25676E]">
                {rfc.rfcNumber}
              </span>
              {rfc.featured && (
                <span className="rounded-full bg-[#FFF7ED] px-3 py-0.5 text-[12px] font-medium text-[#C2610C]">
                  Featured
                </span>
              )}
            </div>
            <div>
              <h1 className="text-[24px] font-medium leading-8 text-[#231F20]">{rfc.title}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#516367]">
                <span>{rfc.productName}</span>
                <span className="text-[#E8EAED]">|</span>
                <span>Owner: <span className="font-medium text-[#354245]">{rfc.owner}</span></span>
                <span className="text-[#E8EAED]">|</span>
                <span>Timeline: <span className="font-medium text-[#354245]">{rfc.timeline}</span></span>
              </div>
            </div>
          </div>

          {/* ── Row 1: Detail card · Favourites ─────────────────────────────── */}
          {/* 3fr/2fr — both columns expand proportionally when sidebar collapses */}
          <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">

        {/* Detail info card */}
        <section className="rounded-[12px] border border-[#E8EAED] bg-white px-3 py-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-2 gap-y-2 xl:grid-cols-4">
            <DetailItem icon={<Building2 size={16} />}      label="Organisation Name"  value={rfc.organisationName} />
            <DetailItem icon={<MapPin size={16} />}         label="Location"           value={rfc.location.split(',').at(-1)?.trim() ?? rfc.location} />
            <DetailItem icon={<ClipboardClock size={16} />} label="RFC Activation"     value={rfc.activationDate} />
            <DetailItem icon={<HatGlasses size={16} />}     label="Anonymous"          value={rfc.anonymous ? 'Yes' : 'No'} />
          </div>
          <div className="my-3 h-px bg-[#E8EAED]" />
          <div className="grid grid-cols-2 gap-y-2 xl:grid-cols-4">
            <DetailItem icon={<Wallet size={16} />}         label="Budget"             value={rfc.budget} />
            <DetailItem icon={<CalendarPlus size={16} />}   label="Delivery Location"  value={rfc.deliveryLocation} />
            <DetailItem icon={<Diff size={16} />}           label="RTCs raised"        value={String(rfc.rtcsRaised)} />
            <DetailItem icon={<ClipboardClock size={16} />} label="Response time"      value={rfc.responseDate} />
          </div>
        </section>

        {/* Favourites */}
        <section className="rounded-[12px] border border-[#E8EAED] bg-white px-[16px] py-[12px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2.5">
            <Star size={16} className="text-[#384d51]" />
            <h2 className="text-[20px] font-medium text-[#384d51]">Favourites</h2>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {rfc.favourites.map((fav) => (
              <div
                key={`${fav.rank}-${fav.owner}`}
                className="flex items-center justify-between gap-3 border-b border-[#dddbdb] pb-[6px] last:border-b-0 last:pb-0"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <span className="w-6 flex-shrink-0 text-[16px] font-normal text-[#0d782b]">#{fav.rank}</span>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ECECEC] text-sm font-semibold text-[#25676E]">
                    {fav.owner.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-medium leading-[23px] text-[#031317]">{fav.owner}</p>
                    <p className="truncate text-[12px] leading-[16px] tracking-[0.4px] text-[#384d51]">{fav.marketplace}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex-shrink-0 rounded-[20px] border border-[#3aa2b7] px-3 py-1 text-[12px] text-[#3aa2b7] transition-colors hover:bg-[#F0FBFE]"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>
          </div>

          {/* ── Row 2: Content · Potential Clients ──────────────────────────── */}
          <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">

        {/* Left: read-only content cards */}
        <div className="flex flex-col gap-5">
          <ContentCard title="RFC Description">
            <p>{rfc.description}</p>
          </ContentCard>
          <ContentCard title="Eligibility">
            <ul className="list-disc space-y-1 pl-5">
              {rfc.eligibilityPoints.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ContentCard>
          <ContentCard title="PSI List">
            <ul className="list-disc space-y-1 pl-5">
              {rfc.psiList.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ContentCard>
          <section className="rounded-[12px] border border-[#E8EAED] bg-white px-[16px] py-[12px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">
            <h2 className="text-[18px] font-medium leading-7 text-[#354245]">Stakeholders Added</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rfc.stakeholdersAdded.map((s) => <StakeholderChip key={s} value={s} />)}
            </div>
          </section>
        </div>

        {/* Right: Potential Clients — primary interaction panel */}
        <section className="self-start sticky top-6 rounded-[12px] border border-[#E8EAED] bg-white px-[20px] py-[16px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">

          {/* Header */}
          <div className="flex items-baseline justify-between">
            <h2 className="text-[20px] font-medium text-[#384d51]">Potential Clients</h2>
            <span className="text-[13px] text-[#908386]">
              {filteredClients.length} of {rfc.potentialClients.length}
            </span>
          </div>

          {/* Tier filter tabs — no count badges */}
          <div className="mt-4 flex border-b border-[#E8EAED]">
            {TIER_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTierFilter(f)}
                className={clsx(
                  'flex-1 pb-2 pt-1 text-[13px] transition-colors',
                  f === tierFilter
                    ? 'border-b-2 border-[#3aa2b7] font-bold text-[#3aa2b7]'
                    : 'font-normal text-[#656263] hover:text-[#354245]'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Opportunity type chips */}
          <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-[#FAFAFA] px-3 py-2.5">
            <span className="flex-shrink-0 text-[11px] font-medium uppercase tracking-wide text-[#908386]">
              Opportunity
            </span>
            <div className="flex flex-wrap gap-2">
              {OPP_TAGS.map((tag) => {
                const count = oppTagCount(tag);
                const isActive = activeOppTags.has(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleOppTag(tag)}
                    className={clsx(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-all',
                      isActive
                        ? tag === 'IRO+'
                          ? 'border-[#C2610C] bg-[#FFF7ED] text-[#C2610C]'
                          : 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                        : 'border-[#E8EAED] bg-white text-[#516367] hover:border-[#3aa2b7] hover:text-[#25676E]'
                    )}
                  >
                    {tag}
                    <span className="rounded-full bg-black/5 px-1 text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
            {activeOppTags.size > 0 && (
              <button
                type="button"
                onClick={() => setActiveOppTags(new Set())}
                className="ml-auto flex-shrink-0 text-[11px] text-[#908386] underline hover:text-[#516367]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Client list */}
          <div className="mt-3 flex flex-col divide-y divide-[#F3F4F6]">
            {filteredClients.map((client) => {
              const zone = getHealthZone(client.score);
              const scoreColor = healthZone[zone].color;
              const scoreBg = healthZone[zone].bg;
              return (
                <div key={`${client.rank}-${client.company}`} className="flex items-start gap-4 py-3 first:pt-1">

                  {/* Rank badge */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#e3e3e3] text-[13px] font-medium text-[#256f7e]">
                    #{client.rank}
                  </div>

                  {/* Client info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[#516367]">{client.company}</p>
                    <p className="text-[14px] font-medium text-[#031317]">{client.owner}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {client.tags.map((tag) => <Tag key={tag} label={tag} />)}
                      <span className="text-[11px] text-[#516367]">{client.marketplace}</span>
                    </div>
                  </div>

                  {/* Score + menu */}
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-[6px] px-2 py-0.5 text-[13px] font-bold"
                        style={{ color: scoreColor, backgroundColor: scoreBg }}
                      >
                        {client.score}%
                      </span>
                      <ClientMenu />
                    </div>
                    <ScoreBar score={client.score} />
                  </div>
                </div>
              );
            })}

            {filteredClients.length === 0 && (
              <p className="py-8 text-center text-[14px] text-[#908386]">
                No clients match the selected filters.
              </p>
            )}
          </div>
        </section>
          </div>
        </>
      )}
    </div>
  );
}
