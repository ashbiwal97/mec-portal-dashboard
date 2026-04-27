import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { PublishedRfcDetailsPage } from '@/components/manage-rfcs/PublishedRfcDetailsPage';

export default async function PublishedRfcDetailsRoutePage(
  props: PageProps<'/manage-rfcs/published/[id]'>
) {
  const searchParams = await props.searchParams;
  const activeTab =
    searchParams.tab === 'rtc-detail'
      ? 'rtc-detail'
      : searchParams.tab === 'rtcs'
        ? 'rtcs'
        : 'details';
  const title =
    activeTab === 'rtc-detail'
      ? 'RTC details'
      : activeTab === 'rtcs'
        ? 'RTC list'
        : 'RFC details';

  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#FAF8F6]">
        <TopNav
          breadcrumb={`Manage RFCs – Published RFC – ${title}`}
          title={title}
          showExport={false}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <PublishedRfcDetailsPage />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
