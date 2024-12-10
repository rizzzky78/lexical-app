import { ComplexSidebar } from "@/components/atlas/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <ComplexSidebar />
      <SidebarInset className="flex-1">
        <div className="p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold mt-4">Welcome to the Dashboard</h1>
          <p className="mt-2">
            This is the main content area. The sidebar can be toggled using the
            button above.
          </p>
        </div>
      </SidebarInset>
    </div>
  );
}
