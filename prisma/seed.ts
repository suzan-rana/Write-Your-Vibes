import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Get existing categories

    // Create users
    // Array(10).map(
    for (let index = 0; index <= 10; index++) {
      await prisma.user.create({
        data: {
          name: "Suzan Rana",
          email: `suzan-user-${index}@gmail.com`,
          role: "USER",
          password: await hash("HelloWorld123@"),
          biography: "HI",
          gender: "MALE",
        },
      });
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
