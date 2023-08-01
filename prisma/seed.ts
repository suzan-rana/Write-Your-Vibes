import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Get existing categories

    // Create users
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        role: "ADMIN",
        password: await hash("HelloWorld123@"),
        biography: "HI",
        gender: "MALE",
      },
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
