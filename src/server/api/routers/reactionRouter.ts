import { CreateReactionSchema } from "~/common/validation/user-validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const reactionRouter = createTRPCRouter({
  createReaction: protectedProcedure
    .input(CreateReactionSchema)
    .mutation(async ({ ctx, input }) => {
        console.log('VALUES...', {
            input
        })
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
