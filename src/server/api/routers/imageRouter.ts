import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getRandomKey, getS3Params, s3 } from "~/lib/s3";

export const imageRouter = createTRPCRouter({
  getPreSignedUrl: protectedProcedure
    .input(
      z.object({
        fileType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { Key, extension } = getRandomKey(input.fileType);
      const s3Params = getS3Params(extension, Key);
      console.log('S3PARAMS...', s3Params)
      const uploadUrl = s3.getSignedUrl("putObject", s3Params);
      return {
        status: 200,
        data: {
          uploadUrl,
          key: Key,
        },
        message: "BLOG UPDATED SUCCESSFULLY",
      };
    }),
});
