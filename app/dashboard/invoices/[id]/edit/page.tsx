import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import { TCustomerField, TInvoiceSchema } from "@/app/lib/z.schemas";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import React from "react";

const page = async ({ params }: { params: any }) => {
	const invoiceId = params.id;

	const [invoice, customers] = (await Promise.all([
		fetchInvoiceById(invoiceId),
		fetchCustomers()
	])) as [TInvoiceSchema, TCustomerField[]];

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Invoices", href: "/dashboard/invoices" },
					{
						label: "Update Invoice",
						href: `/dashboard/invoices/${invoiceId}/edit`,
						active: true
					}
				]}
			/>
			<EditInvoiceForm invoice={invoice} customers={customers} />
		</main>
	);
};

export default page;
