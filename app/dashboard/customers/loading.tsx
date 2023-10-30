import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CustomersTableSkeleton } from "@/app/ui/skeletons";
import React from "react";

const CustomersLoading = () => {
	return (
		<div className="w-full">
			<h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>Customers</h1>
			<Search placeholder="Search customers..." />
			<CustomersTableSkeleton />
		</div>
	);
};

export default CustomersLoading;
