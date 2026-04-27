import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { RfcDraftsList } from '@/components/manage-rfcs/RfcRequestsList';

export default function ManageRfcDraftsPage() {
  return (
    <AppShell>
      <div className="flex h-full flex-col bg-[#FAF8F6]">
        <TopNav
          breadcrumb="Manage RFCs – Drafts"
          title="Drafts"
          showExport={false}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <RfcDraftsList />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
