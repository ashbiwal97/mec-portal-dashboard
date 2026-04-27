import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { EditRfcPage } from '@/components/manage-rfcs/EditRfcPage';

export default async function EditRfcRoutePage(props: PageProps<'/manage-rfcs/[id]/edit'>) {
  const { id } = await props.params;
  const isDraft = id.startsWith('draft-');
  const breadcrumb = isDraft ? 'Manage RFCs – Drafts – Continue Edit' : 'Manage RFCs – RFC requests – Edit RFC';
  const title = isDraft ? 'Continue Edit' : 'Edit RFC';

  return (
    <AppShell>
      <div className="h-full flex flex-col bg-[#FAF8F6]">
        <TopNav
          breadcrumb={breadcrumb}
          title={title}
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
