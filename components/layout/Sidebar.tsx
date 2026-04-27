'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  BarChart2,
  FileText,
  FileCheck,
  CalendarDays,
  Users,
  Building2,
  Radio,
  Settings,
  ShieldCheck,
  ReceiptText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useMarketplace, MARKETPLACE_OPTIONS } from '@/lib/marketplace-context';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

const primaryNav: NavItem[] = [
  { icon: <BarChart2 size={16} />, label: 'Reports & Analytics', href: '/' },
  {
    icon: <FileText size={16} />,
    label: 'Manage RFCs',
    href: '/manage-rfcs',
    subItems: [
      { label: 'RFC requests', href: '/manage-rfcs' },
      { label: 'Drafts', href: '/manage-rfcs/drafts' },
      { label: 'Published RFC', href: '/manage-rfcs/published' },
    ],
  },
  { icon: <FileCheck size={16} />, label: 'Manage RTCs', href: '/manage-rtcs' },
  { icon: <CalendarDays size={16} />, label: 'Meetings & Scheduler', href: '/meetings' },
  { icon: <Building2 size={16} />, label: 'Clients', href: '/clients' },
  { icon: <Users size={16} />, label: 'Users', href: '/users' },
];

const secondaryNav: NavItem[] = [
  { icon: <Radio size={16} />, label: 'Podcast & News', href: '/podcast' },
  { icon: <Settings size={16} />, label: 'Settings', href: '/settings' },
  { icon: <ShieldCheck size={16} />, label: 'Privacy Policy', href: '/privacy' },
  { icon: <ReceiptText size={16} />, label: 'Terms & Conditions', href: '/terms' },
  { icon: <HelpCircle size={16} />, label: 'Support', href: '/support' },
];

function NavButton({ item, collapsed, pathname }: { item: NavItem; collapsed: boolean; pathname: string }) {
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  const hasSubItems = !!item.subItems?.length;
  const isExpanded = isActive && hasSubItems && !collapsed;

  return (
    <div
      className={clsx(
        isExpanded && 'rounded-2xl border border-white/50 bg-white/25 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
      )}
    >
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={clsx(
          'group relative w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all',
          collapsed ? 'justify-center h-11 w-11 mx-auto' : 'h-11 px-3',
          isActive
            ? 'bg-[#3AA2B7] text-white shadow-sm'
            : 'text-[#062026] hover:bg-white/40'
        )}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && <span className="truncate flex-1">{item.label}</span>}
        {!collapsed && hasSubItems && (
          <ChevronDown
            size={14}
            className={clsx('flex-shrink-0 transition-transform', isExpanded && 'rotate-180')}
          />
        )}
        {collapsed && (
          <span className="absolute left-full ml-2 px-2 py-1 bg-[#062026] text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            {item.label}
          </span>
        )}
      </Link>

      {/* Sub-items */}
      {isExpanded && item.subItems && (
        <div className="mt-2 rounded-xl border border-white/60 bg-white/70 p-2">
          <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6A7282]">
            Manage RFCs
          </div>
          <div className="flex flex-col gap-1">
            {item.subItems.map((sub) => {
              const subActive = pathname === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={clsx(
                    'flex items-center rounded-lg px-2.5 py-2 text-[13px] transition-colors',
                    subActive
                      ? 'bg-[#D8F5FB] font-semibold text-[#1a5561]'
                      : 'font-normal text-[#516367] hover:bg-[#F0FBFE] hover:text-[#062026]'
                  )}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MarketplaceSelector({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const { selectedMarketplaces: selected, setSelectedMarketplaces: setSelected, isAllSelected } = useMarketplace();
  const ref = useRef<HTMLDivElement>(null);

  const allSelected = isAllSelected;
  const noneSelected = selected.length === 0;

  const selectionLabel = allSelected || noneSelected
    ? 'All selected'
    : selected.length === 1
    ? selected[0]
    : `${selected.length} selected`;

  function toggle(m: string) {
    const next = selected.includes(m)
      ? selected.filter((x) => x !== m)
      : [...selected, m];
    setSelected(next);
  }

  function toggleAll() {
    setSelected(allSelected ? [] : [...MARKETPLACE_OPTIONS]);
  }

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={clsx('relative', collapsed ? 'px-2 py-5' : 'px-4 py-5', 'border-b border-[#4AC9E3]/30')}>
      <button
        onClick={() => !collapsed && setOpen((v) => !v)}
        title={collapsed ? 'Marketplaces' : undefined}
        className={clsx(
          'w-full flex items-center gap-2 rounded-lg bg-[#9AE6FA]/60 hover:bg-[#9AE6FA] transition-colors border border-[#4AC9E3]/40 px-3 py-2',
          collapsed && 'justify-center px-2',
          open && 'bg-[#9AE6FA] border-[#4AC9E3]/70'
        )}
      >
        <div className="relative w-7 h-7 rounded-full bg-[#25676E] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          M
          {collapsed && !allSelected && selected.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3AA2B7] text-white text-[9px] font-bold flex items-center justify-center border border-white">
              {selected.length}
            </span>
          )}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-[#231F20]">Marketplace(s)</p>
              <p className="text-[11px] text-[#605759] truncate">{selectionLabel}</p>
            </div>
            <ChevronsUpDown size={14} className={clsx('flex-shrink-0 transition-colors', open ? 'text-[#25676E]' : 'text-[#605759]')} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-full mt-1 z-50 bg-white rounded-xl border border-[#E5E7EB] shadow-xl overflow-hidden">
          <button
            onClick={toggleAll}
            className="w-full flex items-center justify-between px-3 py-2.5 border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
          >
            <span className="text-[12px] font-semibold text-[#231F20]">
              {allSelected ? 'Deselect All' : 'Select All'}
            </span>
            {allSelected && <Check size={13} className="text-[#3AA2B7]" />}
          </button>
          <div className="max-h-56 overflow-y-auto">
            {MARKETPLACE_OPTIONS.map((m) => {
              const checked = selected.includes(m);
              return (
                <button
                  key={m}
                  onClick={() => toggle(m)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F0FBFE] transition-colors text-left"
                >
                  <span
                    className={clsx(
                      'w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-colors',
                      checked ? 'bg-[#3AA2B7] border-[#3AA2B7]' : 'bg-white border-[#D1D5DB]'
                    )}
                  >
                    {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-[12px] text-[#364153]">{m}</span>
                </button>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-[#F3F4F6] bg-[#F9FAFB]">
            <p className="text-[11px] text-[#6A7282]">
              {noneSelected ? 'No marketplace selected' : `${selected.length} of ${MARKETPLACE_OPTIONS.length} selected`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-full transition-all duration-300 ease-in-out flex-shrink-0',
        'bg-gradient-to-b from-[#9AE6FA]/80 to-[#9AE6FA]/60 border-r border-[#4AC9E3]/30',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center hover:bg-[#FAF8F6] transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <MarketplaceSelector collapsed={collapsed} />

      <nav className={clsx('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-4')}>
        <div className="flex flex-col gap-1">
          {primaryNav.map((item) => (
            <NavButton key={item.label} item={item} collapsed={collapsed} pathname={pathname} />
          ))}
        </div>

        {!collapsed && (
          <p className="mt-6 mb-2 px-3 text-[11px] font-semibold text-[#605759] uppercase tracking-wider">
            More Information
          </p>
        )}
        {collapsed && <div className="mt-4 mb-2 border-t border-[#4AC9E3]/30" />}

        <div className="flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <NavButton key={item.label} item={item} collapsed={collapsed} pathname={pathname} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
