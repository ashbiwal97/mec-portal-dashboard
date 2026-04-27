import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { PublishedRfcList } from '@/components/manage-rfcs/PublishedRfcList';

export default function ManagePublishedRfcPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#FAF8F6]">
        <TopNav
          breadcrumb="Manage RFCs – Published RFC"
          title="Published RFC"
          showExport={false}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <PublishedRfcList />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
