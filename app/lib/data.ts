import { formatCurrency } from "./utils";
import { prisma } from "./prisma";
import { Prisma, Revenue } from "@prisma/client";
import { TLatestInvoice } from "../ui/dashboard/latest-invoices";
// Add noStore() to the start of the data fetching function to prevent the response from being cached.
// This is equivalent to in fetch(..., {cache: 'no-store'}).
import { unstable_noStore as noStore } from "next/cache";
import { TCustomerWithInvoices, TFormattedCustomer, TInvoiceSchema } from "./z.schemas";

export const fetchRevenues = async (): Promise<Revenue[] | []> => {
	noStore();
	try {
		const revenues = await prisma.revenue.findMany({});
		return revenues;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch the revenues data.");
	}
};

export async function fetchLatestInvoices() {
	noStore();
	try {
		const invoices = await prisma.invoice.findMany({
			include: {
				customer: {
					select: {
						name: true,
						email: true,
						image_url: true
					}
				}
			},
			orderBy: {
				date: "desc"
			},
			take: 5
		});

		const latestInvoices = invoices.map((invoice) => ({
			id: invoice.id,
			amount: formatCurrency(invoice.amount),
			date: invoice.date,
			customer: {
				name: invoice.customer.name,
				email: invoice.customer.email,
				image_url: invoice.customer.image_url
			}
		}));
		return latestInvoices as TLatestInvoice[];
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch the latest invoices.");
	}
}

export async function fetchCardData() {
	noStore();
	try {
		const [invoicesCount, customersCount, totalPaidInvoices, totalPendingInvoices] =
			await Promise.all([
				prisma.invoice.count(),
				prisma.customer.count(),
				prisma.invoice.count({
					where: {
						status: "paid"
					}
				}),
				prisma.invoice.count({
					where: {
						status: "pending"
					}
				})
			]);

		return {
			invoicesCount,
			customersCount,
			totalPaidInvoices,
			totalPendingInvoices
		};
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to card data.");
	}
}

export async function fetchInvoiceById(id: string) {
	try {
		const invoice = (await prisma.invoice.findUnique({
			where: {
				id: id
			},
			select: {
				id: true,
				customer_id: true,
				amount: true,
				status: true,
				date: true
			}
		})) as TInvoiceSchema;

		return { ...invoice, amount: invoice.amount / 100 };
	} catch (error) {
		console.error("Database Error:", error);
	}
}

export async function fetchCustomers() {
	try {
		const customers = await prisma.customer.findMany({
			select: {
				id: true,
				name: true
			},
			orderBy: {
				name: "asc"
			}
		});

		return customers;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch all customers.");
	}
}

export const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
	query: string | undefined,
	currentPage: number,
	status: "paid" | "pending" | undefined
) {
	noStore(); // Prevents the response from being cached.
	const offset = (currentPage - 1) * ITEMS_PER_PAGE || 0;

	const selectFields = {
		id: true,
		amount: true,
		date: true,
		status: true,
		customer: {
			select: {
				name: true,
				email: true,
				image_url: true
			}
		}
	};

	let whereClause: Prisma.InvoiceWhereInput = query
		? {
				AND: [
					{ status: status },
					{
						OR: [
							{ customer: { name: { contains: query, mode: "insensitive" } } },
							{ customer: { email: { contains: query, mode: "insensitive" } } }
						]
					}
				]
		  }
		: !query && status
		? { status: status }
		: {};

	try {
		const invoices = await prisma.invoice.findMany({
			select: selectFields,
			where: whereClause,
			orderBy: {
				date: "desc"
			},
			take: ITEMS_PER_PAGE,
			skip: offset
		});

		return invoices;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch invoices.");
	}
}

export async function fetchFilteredCustomers(query: string, currentPage: number) {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE || 0;

	try {
		let whereClause: Prisma.CustomerWhereInput = query
			? {
					OR: [
						{ name: { contains: query, mode: "insensitive" } },
						{ email: { contains: query, mode: "insensitive" } }
					]
			  }
			: {};

		const customers = (await prisma.customer.findMany({
			where: whereClause,
			select: {
				id: true,
				name: true,
				email: true,
				image_url: true,
				invoices: {
					select: {
						id: true,
						amount: true,
						status: true
					}
				}
			},
			orderBy: {
				name: "asc"
			},
			take: ITEMS_PER_PAGE,
			skip: offset
		})) as TCustomerWithInvoices[];

		const formatCustomers = (customers: TCustomerWithInvoices[]) => {
			return customers.map((customer) => {
				const total_invoices = customer.invoices.length;
				const total_pending = customer.invoices.reduce((total, invoice) => {
					if (invoice.status === "pending") {
						return total + invoice.amount;
					}
					return total;
				}, 0);
				const total_paid = customer.invoices.reduce((total, invoice) => {
					if (invoice.status === "paid") {
						return total + invoice.amount;
					}
					return total;
				}, 0);

				return {
					...customer,
					total_invoices,
					total_pending: formatCurrency(total_pending),
					total_paid: formatCurrency(total_paid)
				};
			});
		};

		const formattedCustomers: TFormattedCustomer[] = formatCustomers(customers);
		return formattedCustomers;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch customer table.");
	}
}

export async function fetchInvoicesPages(query: string, status: "paid" | "pending" | undefined) {
	let whereClause: Prisma.InvoiceWhereInput = query
		? {
				AND: [
					{ status: status },
					{
						OR: [
							{ customer: { name: { contains: query, mode: "insensitive" } } },
							{ customer: { email: { contains: query, mode: "insensitive" } } }
						]
					}
				]
		  }
		: !query && status
		? { status: status }
		: {};

	try {
		const count = await prisma.invoice.count({
			where: whereClause
		});

		const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch total number of invoices.");
	}
}

export async function fetchCustomersPages(query: string) {
	let whereClause: Prisma.CustomerWhereInput = query
		? {
				OR: [
					{ name: { contains: query, mode: "insensitive" } },
					{ email: { contains: query, mode: "insensitive" } }
				]
		  }
		: {};

	try {
		const count = await prisma.customer.count({
			where: whereClause
		});

		const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch total number of invoices.");
	}
}

export async function getUser(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		});
		return user;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}
