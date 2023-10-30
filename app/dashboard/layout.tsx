import { Metadata } from "next";
import SideNav from "../ui/dashboard/sidenav";

export const metadata: Metadata = {
	title: "Acme - dashboard"
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen w-full flex-col md:flex-row md:overflow-hidden  ">
			<aside className="w-full md:w-64 ">
				<SideNav />
			</aside>
			<main className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</main>
		</div>
	);
}
