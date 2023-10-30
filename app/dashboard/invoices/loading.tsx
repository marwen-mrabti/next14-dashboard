import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import React from "react";

const InvoicesLoading = () => {
	return (
		<div className="w-full">
			<h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Invoices</h1>
			<Search placeholder="Search customers..." />
			<InvoicesTableSkeleton />
		</div>
	);
};

export default InvoicesLoading;
