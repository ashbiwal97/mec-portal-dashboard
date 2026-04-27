'use client';

import { useMemo, useState } from 'react';
import {
  Building2,
  CalendarDays,
  ClipboardClock,
  Clock3,
  Copy,
  Diff,
  FileText,
  ImagePlus,
  MapPin,
  Paperclip,
  PenLine,
  PencilRuler,
  Plus,
  UserRound,
  Wallet,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import { allRfcItems } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';

function formatCreatedDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function daysSince(dateString: string) {
  const start = new Date(`${dateString}T00:00:00Z`).getTime();
  const end = new Date('2025-03-23T00:00:00Z').getTime();
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="px-4 py-2">
      <div className="mb-2 flex items-center gap-2 text-[#516367]">
        <span className="flex-shrink-0">{icon}</span>
        <span className="text-[13px] leading-5">{label}</span>
      </div>
      <p className="text-[16px] font-medium leading-6 text-[#031317]">{value}</p>
    </div>
  );
}

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#E8EAED] px-1 py-5">
      <div className="mb-4">
        <h3 className="text-[18px] font-medium leading-7 text-[#354245]">{title}</h3>
        {description && <p className="mt-1 text-[13px] leading-5 text-[#6A7282]">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-none rounded-[8px] border border-[#DDDBDB] px-4 py-3 text-[14px] leading-6 text-[#354245] shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:border-[#3AA2B7] focus:outline-none focus:ring-2 focus:ring-[#B6EAF5]"
    />
  );
}

function ReadList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-[14px] leading-5 text-[#605759]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function RichTextBox({
  value,
  onChange,
  placeholder,
  rows,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#DDDBDB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none border-0 px-4 py-3 text-[14px] leading-6 text-[#354245] focus:outline-none"
      />
      <div className="flex items-center gap-3 border-t border-[#DDDBDB] bg-[#DCF5FD]/70 px-4 py-2 text-[#516367]">
        <Paperclip size={14} />
        <ImagePlus size={14} />
        <PencilRuler size={14} />
        <PenLine size={14} />
      </div>
    </div>
  );
}

function StakeholderInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-11 items-center justify-between rounded-[8px] border border-[#DDDBDB] bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Stakeholder Name (Email)"
        className="w-full border-0 bg-transparent text-[14px] text-[#605759] focus:outline-none"
      />
      <Copy size={16} className="ml-3 flex-shrink-0 text-[#6A7282]" />
    </div>
  );
}

function FeatureToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-7 w-12 items-center rounded-full border transition-colors',
        checked ? 'border-[#3AA2B7] bg-[#3AA2B7]' : 'border-[#D7E6EA] bg-[#EAF0F2]'
      )}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.18)] transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

export function EditRfcPage() {
  const params = useParams<{ id: string }>();
  const rfc = allRfcItems.find((item) => item.id === params?.id);
  const isDraft = params?.id?.startsWith('draft-') ?? false;

  const baseEligibilityItems = useMemo(() => {
    if (!rfc) return [];
    return rfc.eligibility
      .split(/&|,|Only/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [rfc]);

  const basePsiItems = useMemo(() => {
    if (!rfc) return [];
    return [
      `${rfc.productName} stakeholder shortlist`,
      `${rfc.location} target market validation`,
    ];
  }, [rfc]);

  const [description, setDescription] = useState(() => rfc?.description ?? '');
  const [eligibilityText, setEligibilityText] = useState(() => baseEligibilityItems.join('\n'));
  const [psiText, setPsiText] = useState(() => basePsiItems.join('\n'));
  const [stakeholders, setStakeholders] = useState<string[]>(() =>
    rfc ? [`${rfc.owner} (${rfc.owner.toLowerCase().replace(/\s+/g, '.')}@meconnects.com)`, ''] : []
  );
  const [featured, setFeatured] = useState(() => Boolean(rfc?.featured));
  const [teaserToTeaser, setTeaserToTeaser] = useState(() =>
    rfc ? `${rfc.title}\n\n${rfc.description}` : ''
  );
  const [teaser, setTeaser] = useState(() =>
    rfc ? `${rfc.productName} for ${rfc.location} with ${rfc.timeline} delivery and ${rfc.budget} budget range.` : ''
  );

  if (!rfc) {
    return (
      <div className="rounded-[12px] bg-white px-8 py-16 text-center shadow-[2px_2px_8px_0_rgba(0,0,0,0.1)]">
        <FileText size={22} className="mx-auto mb-4 text-[#3AA2B7]" />
        <h2 className="text-[24px] font-medium text-[#031317]">RFC not found</h2>
        <p className="mt-2 text-[16px] text-[#605759]">The selected RFC could not be loaded.</p>
      </div>
    );
  }

  const isClosed = rfc.status === 'Closed';
  const eligibilityItems = eligibilityText.split('\n').map((item) => item.trim()).filter(Boolean);
  const psiItems = psiText.split('\n').map((item) => item.trim()).filter(Boolean);
  const secondaryCtaLabel = isDraft ? 'Save Draft' : 'Save Changes';
  const primaryCtaLabel = isDraft ? 'Send draft for review' : 'Send for review';
  const descriptionSectionCopy = isDraft
    ? 'This draft is editable by default so authors can refine the request without extra clicks.'
    : 'This section is editable by default so reviewers can refine the request without extra clicks.';

  function updateStakeholder(index: number, value: string) {
    setStakeholders((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-between gap-4 pb-1">
        <div>
          <h2 className="text-[24px] font-medium leading-8 text-[#031317]">{rfc.title}</h2>
          <p className="mt-1 text-[16px] leading-6 text-[#384D51]">{rfc.rfcNumber}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            className="h-10 border-[#3AA2B7] px-4 text-[14px] leading-5 text-[#3AA2B7] hover:bg-[#F0FBFE] hover:border-[#3AA2B7]"
          >
            {secondaryCtaLabel}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={isClosed}
            className="h-10 px-4 text-[14px] leading-5"
          >
            {primaryCtaLabel}
          </Button>
        </div>
      </div>

      <div className="rounded-[12px] bg-white px-3 py-4 shadow-[2px_2px_8px_0_rgba(0,0,0,0.1)]">
        <div className="mb-4 flex flex-col gap-3 border-b border-[#E8EAED] px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6A7282]">Visibility settings</p>
            <p className="mt-1 text-[14px] leading-5 text-[#516367]">
              Featured RFCs are prioritised in the Published RFC section once the item is live.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[14px] font-semibold text-[#031317]">Feature this RFC</p>
              <p className="text-[12px] leading-4 text-[#6A7282]">
                {featured ? 'Marked as featured' : 'Not featured'}
              </p>
            </div>
            <FeatureToggle checked={featured} onChange={setFeatured} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem icon={<Building2 size={16} />} label="Organisation Name" value={rfc.productName} />
          <DetailItem icon={<MapPin size={16} />} label="Location" value={rfc.location.split(',').at(-1)?.trim() ?? rfc.location} />
          <DetailItem icon={<ClipboardClock size={16} />} label="RFC Activation" value={formatCreatedDate(rfc.createdAt)} />
          <DetailItem icon={<UserRound size={16} />} label="Anonymous" value={rfc.status === 'Closed' ? 'No' : 'Yes'} />
        </div>
        <div className="my-3 h-px bg-[#E8EAED]" />
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailItem icon={<Wallet size={16} />} label="Budget" value={rfc.budget.replace('–', '-')} />
          <DetailItem icon={<CalendarDays size={16} />} label="Delivery Location" value={rfc.location} />
          <DetailItem icon={<Diff size={16} />} label="RTCs raised" value={String(Math.max(1, eligibilityItems.length + 3))} />
          <DetailItem icon={<Clock3 size={16} />} label="Response time" value={`${daysSince(rfc.createdAt)} days`} />
        </div>
      </div>

      <SectionShell
        title="RFC Description"
        description={descriptionSectionCopy}
      >
        <TextArea value={description} onChange={setDescription} rows={4} />
      </SectionShell>

      <SectionShell
        title="Eligibility"
        description="Use one line per eligibility point to keep the list easy to scan."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <EditListLike value={eligibilityText} onChange={setEligibilityText} placeholder="Add one eligibility point per line" />
          <div className="rounded-[8px] border border-dashed border-[#CDEEF5] px-4 py-3">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6A7282]">Preview</p>
            <ReadList items={eligibilityItems} />
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="PSI list"
        description="Keep these points specific so internal matching teams can act on them quickly."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <EditListLike value={psiText} onChange={setPsiText} placeholder="Add one PSI item per line" />
          <div className="rounded-[8px] border border-dashed border-[#CDEEF5] px-4 py-3">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6A7282]">Preview</p>
            <ReadList items={psiItems} />
          </div>
        </div>
      </SectionShell>

      <SectionShell
        title="Stakeholders added"
        description="Add or refine stakeholder contacts that should be looped into the request."
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stakeholders.map((stakeholder, index) => (
              <StakeholderInput
                key={index}
                value={stakeholder}
                onChange={(value) => updateStakeholder(index, value)}
              />
            ))}
          </div>
          <button
            onClick={() => setStakeholders((prev) => [...prev, ''])}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#231F20]"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </SectionShell>

      <SectionShell
        title="Teaser to teaser"
        description="Use this area for the fuller narrative version intended for internal framing."
      >
        <RichTextBox
          value={teaserToTeaser}
          onChange={setTeaserToTeaser}
          placeholder="Enter teaser here"
          rows={7}
        />
      </SectionShell>

      <SectionShell
        title="Teaser"
        description="Keep this version concise and sharp for shorter placements or previews."
      >
        <RichTextBox
          value={teaser}
          onChange={setTeaser}
          placeholder="Enter teaser here"
          rows={7}
        />
      </SectionShell>
    </div>
  );
}

function EditListLike({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      className="w-full resize-none rounded-[8px] border border-[#DDDBDB] px-4 py-3 text-[14px] leading-6 text-[#354245] shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:border-[#3AA2B7] focus:outline-none focus:ring-2 focus:ring-[#B6EAF5]"
    />
  );
}
