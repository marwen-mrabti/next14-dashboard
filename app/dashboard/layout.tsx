import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row md:overflow-hidden  ">
      <aside className="w-full md:w-64 ">
        <SideNav />
      </aside>
      <main className="flex-grow md:overflow-y-auto p-6 md:p-12">{children}</main>
    </div>
  );
}
