import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { AppSidebar } from '@/components/app-sidebar';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ManLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = await cookieStore.then((cookieStore) => {
    return cookieStore.get('accessToken')?.value;
  });
  if (!token) {
    return redirect('/login');
  }
  const payload = await verifyToken(token);
  if (!payload || payload.role.level !== 1) return redirect('/logout');
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar user={payload} />
          <SidebarInset className="p-3">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
