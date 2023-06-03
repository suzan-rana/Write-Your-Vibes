import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const PRINCESS_SEN = await prisma.user.create({
    data: {
      name: "Princess Sen",
      biography: "Hello, I am Princess Sen",
      email: "princess_sen@gmail.com",
      gender: "MALE",
      image: null,
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$XyoNwxjZGZ0/Qdu8LBcz8w$KRksP1ScjGUQM1RYAFEjiK4WNJYSdpqe9/jptORNbWE",
      post: {
        create: {
          title: "Who are we in this accursed world.",
          body: "Hello, accursed world",
          image: "",
          slug: `who-we-are-in-this-accursed-world-${Date.now()}`,
          subtitle: "Hey guys how areyou?",
          tags: {
            create: {
              tag_name: "FIRST-BLOG-POST",
            },
          },
          category: {
            connectOrCreate: {
              create: {
                category_name: "SCIENCE_AND_TECH",
              },
              where: {
                category_name: "SCIENCE_AND_TECH",
              },
            },
          },
        },
      },
    },
  });
  console.log("PRINCESS SEN CREATED", PRINCESS_SEN);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
