import AuthGuard from "@/components/auth/AuthGuard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { RecordDetailsProvider } from "@/components/dashboard/RecordDetailsProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <RecordDetailsProvider>
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
          </SidebarInset>
        </RecordDetailsProvider>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default DashboardLayout;
