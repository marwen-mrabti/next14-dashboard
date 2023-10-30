import {
	CustomerField,
	CustomersTable,
	InvoiceForm,
	InvoicesTable,
	LatestInvoiceRaw,
	User,
	Revenue
} from "./definitions";
import { formatCurrency } from "./utils";
import { prisma } from "./prisma";
import { TLatestInvoice } from "../ui/dashboard/latest-invoices";
import { TCardData } from "../ui/dashboard/cards";

export async function fetchLatestInvoices() {
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

/*
const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
		const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

		return invoices.rows;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch invoices.");
	}
}

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
