import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { EditRfcPage } from '@/components/manage-rfcs/EditRfcPage';

export default function ContinueEditDraftPage() {
  return (
    <AppShell>
      <div className="h-full flex flex-col bg-[#FAF8F6]">
        <TopNav
          breadcrumb="Manage RFCs – Drafts – Continue Edit"
          title="Continue Edit"
          showExport={false}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <EditRfcPage />
          </main>
        </div>
      </div>
    </AppShell>
  );
}
