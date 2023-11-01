import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import React from "react";

const UpdateInvoiceLoading = () => {
	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Invoices", href: "/dashboard/invoices" },
					{
						label: "Update Invoice",
						href: "/dashboard/invoices",
						active: true
					}
				]}
			/>

			<div className={`animate-ping overflow-hidden text-slate-700`}>
				<div className="space-y-6 rounded-md bg-gray-50 p-4 ">
					<div className="mb-4 ">
						<label htmlFor="customer" className="mb-2 block text-sm font-medium">
							Choose customer
						</label>
						<div className="h-10 w-[90%] animate-pulse rounded-md border border-gray-200 bg-slate-100 px-[14px] py-3" />
					</div>

					<div className="mb-4">
						<label htmlFor="amount" className="mb-2 block text-sm font-medium">
							Choose an amount
						</label>
						<div className=" h-10 w-[90%] animate-pulse rounded-md border border-gray-200 bg-slate-100 px-[14px] py-3" />
					</div>

					{/* Invoice Status */}
					<div>
						<label htmlFor="status" className="mb-2 block text-sm font-medium">
							Set the invoice status
						</label>
						<div className=" h-10 w-[90%] animate-pulse rounded-md border border-gray-200 bg-slate-100 px-[14px] py-3" />
					</div>
				</div>
				<div className="mt-6 flex justify-end gap-4">
					<div className=" h-10 w-[15%] animate-pulse rounded-md border border-gray-200 bg-slate-200 px-[14px] py-3" />
					<div className="h-10 w-[15%] animate-pulse rounded-md border border-gray-200 bg-blue-500 px-[14px] py-3" />
				</div>
			</div>
		</main>
	);
};

export default UpdateInvoiceLoading;
