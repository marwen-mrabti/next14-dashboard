import { fetchCustomers } from "@/app/lib/data";
import { TCustomerField } from "@/app/lib/z.schemas";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateInvoiceForm from "@/app/ui/invoices/create-form";

const CreateInvoicePage = async () => {
	const customers = (await fetchCustomers()) as TCustomerField[];

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Invoices", href: "/dashboard/invoices" },
					{
						label: "Create Invoice",
						href: "/dashboard/invoices/create",
						active: true
					}
				]}
			/>
			<CreateInvoiceForm customers={customers} />
		</main>
	);
};

export default CreateInvoicePage;
