"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { prisma } from "./prisma";
import { CreateInvoiceSchema, UpdateInvoiceSchema, LoginSchema } from "./z.schemas";
import { signIn } from "@/auth";


export async function authenticate(prevState: string | undefined, formData: FormData) {
	try {
		await signIn("credentials", Object.fromEntries(formData));
	} catch (error) {
		if ((error as Error).message.includes("CredentialsSignin")) {
			return "CredentialSignin";
		}
		throw error;
	}
}


export type TInvoiceState = {
	errors?: {
		customer_id?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};
export const createNewInvoice = async (prevState: TInvoiceState, invoiceData: FormData) => {
	const invoiceObject = Object.fromEntries(invoiceData.entries());

	const validatedFields = CreateInvoiceSchema.safeParse({
		customer_id: invoiceObject.customer_id,
		amount: invoiceObject.amount, // amount in dollars
		status: invoiceObject.status
	});

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Create Invoice."
		};
	}

	const { customer_id, amount, status } = validatedFields.data;
	// convert to cents to prevent floating point errors caused by JavaScript
	const amountInCents = amount * 100;

	try {
		await prisma.invoice.create({
			data: {
				customer_id,
				status,
				amount: amountInCents,
				date: format(new Date(), "yyyy-MM-dd")
			}
		});
	} catch (error: any) {
		return {
			message: "Database Error: Failed to Create Invoice."
		};
	}

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
};

export const updateInvoice = async (prevState: TInvoiceState, invoiceData: FormData) => {
	const invoiceObject = Object.fromEntries(invoiceData.entries());

	const invoiceId = invoiceObject.id as string;

	const validatedFields = UpdateInvoiceSchema.safeParse({
		customer_id: invoiceObject.customer_id,
		amount: invoiceObject.amount, //amount in dollars
		status: invoiceObject.status
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Update Invoice."
		};
	}

	const { customer_id, amount, status } = validatedFields.data;
	// convert to cents to prevent floating point errors caused by JavaScript
	const amountInCents = amount * 100;
	try {
		await prisma.invoice.update({
			where: {
				id: invoiceId
			},
			data: {
				customer_id,
				status,
				amount: amountInCents,
				date: format(new Date(), "yyyy-MM-dd")
			}
		});
	} catch (error) {
		return {
			message: "Database Error: Failed to Update Invoice."
		};
	}

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
};

export const deleteInvoice = async (idData: FormData) => {
	const invoiceId = idData.get("id") as string;

	try {
		await prisma.invoice.delete({
			where: {
				id: invoiceId
			}
		});
		revalidatePath("/dashboard/invoices");
		return { message: "Deleted Invoice." };
	} catch (error) {
		return {
			message: "Database Error: Failed to Delete Invoice."
		};
	}
};
