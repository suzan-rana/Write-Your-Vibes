// filename: db-reset.ts

// use: npx ts-node db-reset.ts

// add more tables if Required
const tableNames = ['Table1', 'Table2'];


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

main().finally(async () => {
  await prisma.$disconnect();
})