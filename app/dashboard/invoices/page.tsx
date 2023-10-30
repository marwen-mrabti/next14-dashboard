import React from "react";
import { Invoice } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Acme - dashboard/invoices"
};

const getInvoices = async (): Promise<Invoice[]> => {
	const invoices = await prisma.invoice.findMany({});

	return invoices;
};

const InvoicesPage = async () => {
	const invoices = await getInvoices();

	return <div>Invoices Page</div>;
};

export default InvoicesPage;
