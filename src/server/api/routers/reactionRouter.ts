import { CreateReactionSchema } from "~/common/validation/user-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const reactionRouter = createTRPCRouter({
  getReactionByBlogId: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.reaction.findMany({
        where: {
          postId: input.postId,
        },

        include: {
          user: {
            select: {
              name: true,
              image: true,
              id: true,
            },
          },
        },
      });
    }),
  createReaction: protectedProcedure
    .input(CreateReactionSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("VALUES...", {
        input,
      });
      return await ctx.prisma.reaction.upsert({
        create: {
          type: input.type,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
        update: {
          type: input.type,
        },
      });
    }),
});
export default reactionRouter;
