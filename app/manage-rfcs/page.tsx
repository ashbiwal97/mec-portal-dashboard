import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { RfcRequestsList } from '@/components/manage-rfcs/RfcRequestsList';

export default function ManageRfcsPage() {
  return (
    <AppShell>
      <div className="h-full flex flex-col bg-[#FAF8F6]">
        <TopNav
          breadcrumb="Manage RFCs – RFC requests"
          title="RFC requests"
          showExport={false}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <RfcRequestsList />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
