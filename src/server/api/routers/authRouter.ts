import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { RegisterFormSchema } from "~/pages/auth/register";
import { hash } from "argon2";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { randomFemaleAvatar, randomMaleAvatar } from "~/lib/bigheads";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterFormSchema)
    .mutation(async ({ ctx, input: { email, name, password, gender } }) => {
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

      // gender - male ? randomMaleAvatar : randomFemaleAvatar
      const image = gender === 'Female' ?  JSON.stringify(randomFemaleAvatar) : JSON.stringify(randomMaleAvatar)

      return await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          gender,
          image
        },
      });
    }),
});

// validation
