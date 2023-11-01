"use server";

import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import {
	TCreateInvoiceSchema,
	TInvoiceSchema,
	CreateInvoiceSchema,
	InvoiceSchema,
	TUpdateInvoiceSchema,
	UpdateInvoiceSchema
} from "./z.schemas";
import { redirect } from "next/navigation";

export const login = async (email: string, password: string) => {};

export const createNewCustomer = async (customerData: FormData) => {};

export const createNewInvoice = async (invoiceData: FormData) => {
	const invoiceObject = Object.fromEntries(invoiceData.entries());

	const parsedInvoice: TCreateInvoiceSchema = CreateInvoiceSchema.parse({
		customer_id: invoiceObject.customer_id,
		amount: invoiceObject.amount,
		status: invoiceObject.status
	});

	await prisma.invoice.create({
		data: {
			...parsedInvoice,
			amount: parsedInvoice.amount * 100, // convert to cents to prevent floating point errors caused by JavaScript
			date: format(new Date(), "yyyy-MM-dd")
		}
	});

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
};

export const updateInvoice = async (invoiceData: FormData) => {
	const invoiceObject = Object.fromEntries(invoiceData.entries());

	const invoiceId = invoiceObject.id as string;

	const parsedInvoice: TUpdateInvoiceSchema = UpdateInvoiceSchema.parse({
		// id: invoiceObject.id,
		customer_id: invoiceObject.customer_id,
		amount: invoiceObject.amount,
		status: invoiceObject.status
	});

	await prisma.invoice.update({
		where: {
			id: invoiceId
		},
		data: {
			...parsedInvoice,
			date: format(new Date(), "yyyy-MM-dd"),
			amount: parsedInvoice.amount * 100 // convert to cents to prevent floating point errors caused by JavaScript
		}
	});

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
};

export const deleteInvoice = async (invoiceId: string) => {
	await prisma.invoice.delete({
		where: {
			id: invoiceId
		}
	});

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
};
