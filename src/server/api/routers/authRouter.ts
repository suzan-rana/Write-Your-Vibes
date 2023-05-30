import { TRPCError } from "@trpc/server";
import { RegisterFormSchema } from "~/pages/auth/register";
import { hash } from "argon2";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

      return await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          gender,
          image: null,
          biography: `My name is ${name} and I like to do interesting things!`,
        },
      });
    }),
});

// validation
