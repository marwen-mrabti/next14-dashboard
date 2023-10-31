import React, { Suspense } from "react";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import { lusitana } from "../../ui/fonts";
import LatestInvoices from "../../ui/dashboard/latest-invoices";
import Cards from "../../ui/dashboard/cards";
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/app/ui/skeletons";

//revalidate works only in production
export const revalidate = 180; // revalidate every 180 seconds

const DashboardPage = async () => {
	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<Suspense fallback={<CardsSkeleton />}>
					<Cards />
				</Suspense>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
				<Suspense fallback={<RevenueChartSkeleton />}>
					<RevenueChart />
				</Suspense>

				<Suspense fallback={<LatestInvoicesSkeleton />}>
					<LatestInvoices />
				</Suspense>
			</div>
		</main>
	);
};

export default DashboardPage;

//? above we are streaming each component individually, but we can also stream the whole page where loading.tsx is the fallback component for the whole page and we can use Promise.all([]) to fetch all the data at once
