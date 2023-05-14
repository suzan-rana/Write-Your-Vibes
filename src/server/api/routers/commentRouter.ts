import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import * as z from "zod";

const CreateCommentSchema = z.object({
  content: z.string(),
  userId: z.string(),
  postId: z.string(),
});

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(CreateCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { content, postId, userId } = input;
      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });
      return {
        data: comment,
        status: 201,
        message: "COMMENT ADDED SUCCESSFULLY.",
      };
    }),

  // [GET 4 COMMENTS]
  getCommentsForBlogPage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
        include: {
          author: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });
      return {
        data: comments,
        status: 200,
      };
    }),

  // [GET ALL BLOG POST COMMENTS]
  getAllBlogPostComments: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });
      return {
        data: comments,
        status: 200,
      };
    }),
});
