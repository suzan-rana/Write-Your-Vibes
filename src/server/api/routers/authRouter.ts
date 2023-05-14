import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { RegisterFormSchema } from "~/pages/auth/register";
import { hash } from "argon2";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterFormSchema)
    .mutation(async ({ ctx, input: { email, name, password } }) => {
      // find if user already exists or not
      const userExistence = await ctx.prisma.user.findFirst({
        where: { email: email },
      });

      if (userExistence) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      // if not, hash password
      const hashedPassword = await hash(password);

      return await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    }),
});

// validation
