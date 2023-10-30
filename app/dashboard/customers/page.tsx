import React from "react";
import { prisma } from "@/app/lib/prisma";
import { Customer, Invoice } from "@prisma/client";
import CustomersTable from "@/app/ui/customers/table";

export type CustomerWithInvoices = Customer & {
  invoices: {
    id: Invoice["id"];
    status: Invoice["status"];
  }[];
}


const getCustomers = async (): Promise<CustomerWithInvoices[]> => {
  const customers = await prisma.customer.findMany({
    include: {
      invoices: {
        select: {
          id: true,
          status: true,
        }
      },

    },
  });

  return customers;
}

const CustomersPage = async() => {
  const customers = await getCustomers() as CustomerWithInvoices[];

  return <div>
    <CustomersTable customers={customers}/>
  </div>;
};

export default CustomersPage;
