import {
	CustomerField,
	CustomersTable,
	InvoiceForm,
	InvoicesTable,
	LatestInvoiceRaw,
	User
} from "./definitions";

import { formatCurrency } from "./utils";
import { prisma } from "./prisma";
import { Revenue } from "@prisma/client";
import { TLatestInvoice } from "../ui/dashboard/latest-invoices";
// Add noStore() to the start of the data fetching function to prevent the response from being cached.
// This is equivalent to in fetch(..., {cache: 'no-store'}).
import { unstable_noStore as noStore } from "next/cache";

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

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
	noStore();
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
		const invoices = await prisma.invoice.findMany({
			select: {
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
			},
			where: {
				OR: [
					{ customer: { name: { contains: query, mode: "insensitive" } } },
					{ customer: { email: { contains: query, mode: "insensitive" } } },
					{ amount: { equals: parseFloat(query) } }
					// { date: { contains: query, mode: "insensitive" } },
					// { status: { contains: query, mode: "insensitive" } }
				]
			},
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

/*
export async function fetchInvoicesPages(query: string) {
	try {
		const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

		const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch total number of invoices.");
	}
}

export async function fetchInvoiceById(id: string) {
	try {
		const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

		const invoice = data.rows.map((invoice) => ({
			...invoice,
			// Convert amount from cents to dollars
			amount: invoice.amount / 100
		}));

		return invoice[0];
	} catch (error) {
		console.error("Database Error:", error);
	}
}

export async function fetchCustomers() {
	try {
		const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

		const customers = data.rows;
		return customers;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch all customers.");
	}
}

export async function fetchFilteredCustomers(query: string) {
	try {
		const data = await sql<CustomersTable>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

		const customers = data.rows.map((customer) => ({
			...customer,
			total_pending: formatCurrency(customer.total_pending),
			total_paid: formatCurrency(customer.total_paid)
		}));

		return customers;
	} catch (err) {
		console.error("Database Error:", err);
		throw new Error("Failed to fetch customer table.");
	}
}

export async function getUser(email: string) {
	try {
		const user = await sql`SELECT * from USERS where email=${email}`;
		return user.rows[0] as User;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}
*/
