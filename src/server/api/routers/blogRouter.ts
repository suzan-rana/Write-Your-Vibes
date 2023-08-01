import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  CreateNewBlogSchema,
  UpdateBlogSchema,
} from "~/common/validation/blog-validation";
import * as z from "zod";
import { CategoryEnum } from "~/utils/category";
export const blogRouter = createTRPCRouter({
  // [POST]
  createNewBlog: protectedProcedure
    .input(CreateNewBlogSchema)
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;

      const { title, subtitle, body } = input;
      const tagArray = title.split(" ");

      // slug
      const slug = tagArray.join("-") + "-" + Date.now().toString();
      const authorId = session?.user.id;
      const post = await ctx.prisma.post.create({
        include: {
          category: true,
        },
        data: {
          title,
          category: {
            connectOrCreate: {
              create: {
                category_name: input.category,
              },
              where: {
                category_name: input.category,
              },
            },
          },
          subtitle,
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          image: input.image as string || null,
          body,
          user: {
            connect: {
              id: authorId,
            },
          },
          slug,
          tags: {
            createMany: {
              data: tagArray.map((i) => ({
                tag_name: i,
              })),
            },
          },
        },
      });

      return {
        status: 201,
        data: {
          post,
        },
      };
    }),

  // [GET]
  getAllBlogs: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const blogs = await ctx.prisma.post.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        orderBy: {
          createdAt: "desc",
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
              name: true
            }
          },
          _count: {
            select: {
              comment: true,
              reaction: true,
            },
          },
        },
      });
      const totalBlogCount = await ctx.prisma.post.count({});
      return {
        status: 200,
        data: blogs,
        totalBlogCount,
        totalPages: Math.ceil(totalBlogCount / input.limit),
      };
    }),

  // [GET] by CATEGORY
  getManyBlogsWithCategory: protectedProcedure.query(async ({ ctx, input }) => {
    const blogs = await ctx.prisma.category.findMany({
      orderBy: {
        category_name: "desc",
      },
      include: {

        posts: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            image: true,
            createdAt: true,
            _count: {
              select: {
                reaction: true,
                comment: true,
              },
            },
          },
          take: 2,
          orderBy: {
            createdAt: "desc"
          }
        },
      },
    });
    return {
      status: 200,
      data: blogs,
    };
  }),

  getBlogsByCategory: protectedProcedure
    .input(
      z.object({
        category_name: z.nativeEnum(CategoryEnum),
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const blogs = await ctx.prisma.post.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          category: {
            category_name: input.category_name,
          },
        },
        select: {
          _count: {
            select: {
              reaction: true,
              comment: true,
            },
          },
          id: true,
          title: true,
          subtitle: true,
          image: true,
          createdAt: true,
        },
      });
      const totalBlogCount = await ctx.prisma.post.count({
        where: {
          category: {
            category_name: input.category_name,
          },
        },
      });
      return {
        status: 200,
        data: blogs,
        totalBlogCount,
        totalPages: Math.ceil(totalBlogCount / input.limit),
      };
    }),

  // [GET ONE BLOG BY ID]
  getBlogById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // find blog with id
      const blog = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              gender: true,
            },
          },
          reaction: {
            select: {
              type: true,
              user: {
                select: {
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return {
        status: 200,
        data: blog,
      };
    }),

  // [GET BLOG BY USERID]
  getBlogByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const blogs = await ctx.prisma.post.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              reaction: true,
              comment: true,
            },
          },
        },
        where: {
          authorId: input.userId,
        },
      });
      const totalBlogCount = await ctx.prisma.post.count({
        where: {
          authorId: input.userId,
        },
      });
      return {
        status: 200,
        data: blogs,
        totalBlogCount,
        totalPages: Math.ceil(totalBlogCount / input.limit),
      };
    }),

  // [UPDATE BLOG BY ID]
  updateBlogById: protectedProcedure
    .input(UpdateBlogSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...restInput } = input;
      const blog = await ctx.prisma.post.update({
        data: {
          ...restInput,
        },
        where: {
          id,
        },
      });

      return {
        status: 201,
        data: blog,
        message: "BLOG UPDATED SUCCESSFULLY",
      };
    }),

  // [DELETE BLOG BY BLOGID]
  deleteBlogByBlogId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First, delete all comments associated with the post

      const deleteBlog = await ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
        include: {
          comment: true,
        },
      });

      if (!deleteBlog) throw new TRPCError({ code: "BAD_REQUEST" });

      return {
        status: 201,
        message: "BLOG DELETED SUCCESSFULLY",
      };
    }),
});
