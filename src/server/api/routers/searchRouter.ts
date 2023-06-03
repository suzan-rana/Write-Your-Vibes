import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CategoryEnum } from "~/utils/category";
export const searchRouter = createTRPCRouter({
  searchByCategoryAndTags: protectedProcedure
    .input(
      z.object({
        tags: z.array(z.string()).nullable(),
        category_name: z.nativeEnum(CategoryEnum).or(z.literal("All")),
      })
    )
    .query(async ({ ctx, input: { category_name, tags } }) => {
      let where = {};

      if (tags === null || (!tags && category_name === "All")) {
        // If category is "All" and tags are empty or null, return all posts
        where = category_name !== 'All'
          ? {
              category: {
                category_name: category_name,
              },
            }
          : {};
        return await ctx.prisma.post.findMany({
          where,
          take: 10,
          select: {
            id: true,
            image: true,
            title: true,
            subtitle: true,
            createdAt: true,
            category: true,
            _count: {
              select: {
                comment: true,
                reaction: true,
              },
            },
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        });
      } else {
        // If specific category or tags are provided, construct the 'where' condition
        where = {
          category: category_name !== "All" ? { category_name } : undefined,
          tags:
            tags && tags.length > 0
              ? { some: { tag_name: { in: tags } } }
              : undefined,
        };
      }

      return await ctx.prisma.post.findMany({
        take: 10,
        where,
        select: {
          id: true,
          image: true,
          title: true,
          subtitle: true,
          createdAt: true,
          category: true,
          _count: {
            select: {
              comment: true,
              reaction: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),
});
