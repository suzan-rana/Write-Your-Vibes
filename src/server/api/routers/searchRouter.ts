import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CategoryEnum } from "~/utils/category";

export const searchRouter = createTRPCRouter({
  searchByCategoryAndTags: protectedProcedure
    .input(
      z.object({
        tags: z.array(z.string()).nullable(),
        category_name: z
          .nativeEnum(CategoryEnum)
          .or(z.string().refine((value) => value === "All")),
      })
    )
    .query(async ({ ctx, input: { category_name, tags } }) => {
      if (tags === null || !tags && category_name === 'All') {
        return await ctx.prisma.post.findMany({
          select: {
            id: true,
            image: true,
            title: true,
            subtitle: true,
            createdAt: true,
            category: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        });
      }
      return await ctx.prisma.post.findMany({
        where: {
          category: {
            category_name: category_name,
          },
          tags: {
            some: {
              tag_name: {
                in: tags,
              },
            },
          },
        },
        select: {
          id: true,
          image: true,
          title: true,
          subtitle: true,
          createdAt: true,
          category: true,
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
