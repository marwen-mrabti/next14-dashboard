import { fetchCustomers } from "@/app/lib/data";
import Form from "@/app/ui/invoices/create-form";
import React from "react";

export type TCustomerField = {
	id: string;
	name: string;
};

const CreateInvoicePage = async () => {
	const customers = (await fetchCustomers()) as TCustomerField[];

	return (
		<div>
			<Form customers={customers} />
		</div>
	);
};

export default CreateInvoicePage;
