import React from "react";
import { Metadata } from "next";
import CustomersTable from "@/app/ui/customers/table";
import { ITEMS_PER_PAGE, fetchCustomersPages, fetchFilteredCustomers } from "@/app/lib/data";
import { TFormattedCustomer } from "@/app/lib/z.schemas";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/invoices/pagination";

export const metadata: Metadata = {
	title: "Acme - dashboard/customers"
};

const CustomersPage = async ({ searchParams }: { searchParams: any }) => {
	const query = searchParams?.query || "";
	const currentPage = searchParams?.page || 1;

	const customers: TFormattedCustomer[] = await fetchFilteredCustomers(query, currentPage);
	const totalPages = await fetchCustomersPages(query);

	return (
		<main>
			<div className="flex w-full items-center justify-between">
				<h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
			</div>
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
				<Search placeholder="Search invoices..." />
			</div>
			<CustomersTable customers={customers} />
			<div className="mt-5 flex w-full justify-center">
				{totalPages <= 0 ? null : <Pagination totalPages={totalPages} />}
			</div>
		</main>
	);
};

export default CustomersPage;
