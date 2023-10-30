import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import  {
  invoices,
  customers,
  revenue,
  users,
} from  '../app/lib/placeholder-data.js'
import bcrypt from 'bcrypt';

/*
async function seedUsers() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "invoices" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
*/



async function seedUsers() {
  try {
    const usersHashed = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

    const insertedUsers = await prisma.user.createMany({
      data: usersHashed,
    });

    return {

      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}


async function seedCustomers() {
  try {

    const insertedCustomers = await prisma.customer.createMany({
      data: customers,
    });



    return {

      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}



async function seedInvoices() {
  try {


    const insertedInvoices = await prisma.invoice.createMany({
      data: invoices,
    });




    return {

      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}






async function seedRevenue() {
  try {
    const insertedRevenue = await prisma.revenue.createMany({
      data: revenue,
    });

    return {

      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

(async () => {
  // await seedUsers();
  await seedCustomers();
  // await seedInvoices();
  // await seedRevenue();
})();
