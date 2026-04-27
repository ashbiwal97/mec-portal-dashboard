'use client';

import { Bell, Download, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

interface TopNavProps {
  onExport?: () => void;
  breadcrumb?: string;
  title?: string;
  showExport?: boolean;
}

export function TopNav({
  onExport,
  breadcrumb = 'Reports & Analytics',
  title = 'Reports & Analytics',
  showExport = true,
}: TopNavProps) {
  return (
    <header className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center flex-shrink-0 z-10 shadow-sm">
      {/* Logo area — matches sidebar width */}
      <div className="w-64 flex-shrink-0 h-full flex items-center px-6 bg-gradient-to-r from-[#9AE6FA]/60 to-[#9AE6FA]/30 border-r border-[#4AC9E3]/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#25676E] flex items-center justify-center text-white text-xs font-bold tracking-tight">
            ME
          </div>
          <div>
            <p className="text-sm font-bold text-[#062026] leading-none">MEConnects</p>
            <p className="text-[10px] text-[#605759] leading-none mt-0.5">Director Portal</p>
          </div>
        </div>
      </div>

      {/* Main header content */}
      <div className="flex-1 flex items-center justify-between px-6 gap-4">
        {/* Breadcrumb + Page title */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#605759] mb-0.5">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#25676E] font-medium">{breadcrumb}</span>
          </nav>
          <h1 className="text-xl font-semibold text-[#231F20] leading-none">{title}</h1>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          {/* Universal search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908386]" />
            <input
              type="search"
              placeholder="Universal search…"
              className="h-9 w-64 pl-9 pr-4 bg-[#FAF8F6] border border-[#E5E7EB] rounded-lg text-sm text-[#231F20] placeholder:text-[#908386] focus:outline-none focus:ring-2 focus:ring-[#3AA2B7] focus:border-transparent"
            />
          </div>

          {/* Notification */}
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FAF8F6] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#605759]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3AA2B7] ring-1 ring-white" />
          </button>

          {/* Export CTA — only on dashboard */}
          {showExport && (
            <Button onClick={onExport} icon={<Download size={14} />} size="md">
              Export Report
            </Button>
          )}

          {/* Avatar */}
          <Avatar name="Admin User" size="md" />
        </div>
      </div>
    </header>
  );
}
