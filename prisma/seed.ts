import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Get existing categories
    const categories : any = await prisma.category.findMany();

    // Create users
    const u: any = await prisma.user.createMany({
      data: Array.from({ length: 5 }).map((_, index) => ({
        name: `User ${index + 1}`,
        email: `user${index + 1}_${Date.now()}_${Math.random() * 5}@gmail.com`,
        password: "password123",
        gender: "Male",
        biography: "Lorem ipsum dolor sit amet.",
      })),
      skipDuplicates: true,
    });

    const users = await prisma.user.findMany()

    console.log('USERS', users)
    // Create posts for each user
    for (const user of users) {
      const posts = await prisma.post.createMany({
        data: Array.from({ length: 10 }).map((_, index) => ({
          title: `Post ${index + 1}`,
          subtitle: "Lorem ipsum dolor sit amet.",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: "https://example.com/image.jpg",
          slug: `post-${index + 1}`,
          authorId: user.id,
          categoryId: categories[index % categories.length].id ,
        })),
        skipDuplicates: true,
      });

      console.log(`Created 10 posts for User ${user.id}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
