import React from "react";
import RevenueChart from "../ui/dashboard/revenue-chart";
import { prisma } from "../lib/prisma";
import { Revenue } from "@prisma/client";
import { lusitana } from "../ui/fonts";
import { fetchCardData, fetchLatestInvoices } from "../lib/data";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import Cards, { Card } from "../ui/dashboard/cards";

const getRevenue = async (): Promise<Revenue[] | []> => {
	const revenues = await prisma.revenue.findMany({});
	return revenues;
};

const DashboardPage = async () => {
	const [revenues, latestInvoices, cardData] = await Promise.all([
		getRevenue(),
		fetchLatestInvoices(),
		fetchCardData()
	]);

	return (
		<main>
			<h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{!cardData ? null : <Cards cardData={cardData} />}
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
				{!revenues.length ? null : <RevenueChart revenues={revenues} />}
				{!latestInvoices.length ? null : <LatestInvoices latestInvoices={latestInvoices} />}
			</div>
		</main>
	);
};

export default DashboardPage;
