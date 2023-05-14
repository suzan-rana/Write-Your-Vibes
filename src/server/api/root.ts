import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/authRouter";
import { blogRouter } from "./routers/blogRouter";
import { commentRouter } from "./routers/commentRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  blog: blogRouter,
  comment: commentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
