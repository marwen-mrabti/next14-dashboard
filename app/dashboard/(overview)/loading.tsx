import React from "react";
import DashboardSkeleton from "../../ui/skeletons";
import { lusitana } from "@/app/ui/fonts";

const DashboardLoading = () => {
	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
			<DashboardSkeleton />;
		</main>
	);
};

export default DashboardLoading;
