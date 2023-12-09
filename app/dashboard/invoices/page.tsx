import React, { Suspense } from "react";
import { Invoice } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { Metadata } from "next";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import InvoicesTable from "@/app/ui/invoices/table";
import Pagination from "@/app/ui/invoices/pagination";
import { fetchInvoicesPages } from "@/app/lib/data";

export const metadata: Metadata = {
	title: "Acme - dashboard/invoices"
};

export const revalidate = 60; // revalidate every 180 seconds

const InvoicesPage = async ({
	searchParams
}: {
	searchParams: { query: string; page: number; status: "paid" | "pending" | undefined };
}) => {
	const query = searchParams?.query || "";
	const currentPage = searchParams?.page || 1;
	const status = searchParams?.status;
	const totalPages = await fetchInvoicesPages(query, status);

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between">
				<h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
			</div>
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
				<Search placeholder="Search invoices..." />
				<CreateInvoice />
			</div>
			<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
				<InvoicesTable query={query} currentPage={currentPage} status={status} />
			</Suspense>
			<div className="mt-5 flex w-full justify-center">
				{totalPages <= 0 ? null : <Pagination totalPages={totalPages} />}
			</div>
		</div>
	);
};

export default InvoicesPage;
