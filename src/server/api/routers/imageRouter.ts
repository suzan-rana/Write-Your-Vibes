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
      // const s3Params = getS3Params(extension, Key);
      const uploadUrl = s3.createPresignedPost({
        Bucket: process.env.S3_BUCKET_NAME,
        Fields: {
          key: Key,
          'Content-Type': input.fileType,
        },
        Expires: 120, // seconds
        Conditions: [
          ['content-length-range', 0, 1048576], // up to 1 MB
        ],
      })
      // const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
      return {
        status: 200,
        data: {
          uploadUrl,
          key: Key,
        },
        message: "GIVING YOU A PRESIGNED URL",
      };
    }),
});
