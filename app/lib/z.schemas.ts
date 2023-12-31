import { z } from "zod";

export const UserSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters long" })
		.max(32, { message: "Name must be less than 32 characters long" }),
	email: z.string().email({ message: "Please enter a valid email" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 8 characters long" })
		.max(32, { message: "Password must be less than 32 characters long" })
});

export const LoginSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email" }),
	password: z.string()
});

export const InvoiceSchema = z.object({
	id: z.string(),
	customer_id: z.string({
		invalid_type_error: "Please select a customer."
	}),
	amount: z.coerce.number().gt(0, { message: "please enter an amount greater than 0" }),
	status: z
		.enum(["pending", "paid"], {
			invalid_type_error: "Please select an invoice status."
		})
		.default("pending"),
	date: z.string()
});

export const CustomerSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	image_url: z.string().url()
});

export const CreateInvoiceSchema = InvoiceSchema.omit({ id: true, date: true });
export const UpdateInvoiceSchema = InvoiceSchema.omit({ id: true, date: true });

//type definitions
export type TUserSchema = z.infer<typeof UserSchema>;
export type TLoginSchema = z.infer<typeof LoginSchema>;

export type TInvoiceSchema = z.infer<typeof InvoiceSchema>;
export type TCreateInvoiceSchema = z.infer<typeof CreateInvoiceSchema>;
export type TUpdateInvoiceSchema = z.infer<typeof UpdateInvoiceSchema>;

export type TCustomerSchema = z.infer<typeof CustomerSchema>;
export type TCustomerField = { id: string; name: string };
export type TCustomerWithInvoices = TCustomerSchema & {
	invoices: TInvoiceSchema[];
};
export type TFormattedCustomer = TCustomerSchema & {
	total_invoices: number;
	total_pending: string;
	total_paid: string;
};
