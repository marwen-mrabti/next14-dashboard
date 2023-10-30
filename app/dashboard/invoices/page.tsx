import React from "react";
import { Invoice } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

const getInvoices = async (): Promise<Invoice[]> => {
	const invoices = await prisma.invoice.findMany({});

	return invoices;
};

const InvoicesPage = async () => {
	const invoices = await getInvoices();
	console.log(invoices);
	return <div>Invoices Page</div>;
};

export default InvoicesPage;
