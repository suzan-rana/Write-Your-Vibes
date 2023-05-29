import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import * as z from "zod";
import { verify, hash } from "argon2";
import { UpdatePasswordSchema, UpdateProfileSchema } from "~/common/validation/user-validation";


export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, biography, image, gender } = input;
      const updatedUser = await ctx.prisma.user.update({
        data: {
          name,
          biography,
          image,
          gender,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      if (updatedUser) {
        return {
          status: 201,
          data: updatedUser,
          message: "Profile updated successfully.",
        };
      }
    }),

  // changing user password
  changePassword: protectedProcedure
    .input(UpdatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { newPassword, oldPassword } = input;

      // check if old pass is correct
      const userOldPass = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          password: true,
        },
      });

      if (!userOldPass) {
        return {
          status: 401,
          message: "Unauthorized, You are not allowed to change password.",
          data: null,
        };
      }

      const isPasswordCorrect = await verify(
        userOldPass?.password,
        oldPassword
      );

      if (!isPasswordCorrect) {
        return {
          status: 401,
          message: "Unauthorized, Old Password is Wrong!",
          data: null,
        };
      }
      const newHashedPassword = await hash(newPassword);

      // now save to database
      const savePassword = await ctx.prisma.user.update({
        data: {
          password: newHashedPassword,
        },
        where: {
          id: ctx.session.user.id,
        },
      });

      if (savePassword) {
        return {
          status: 201,
          message: "Password changed successfully",
        };
      } else {
        return {
          status: 500,
          message: "Something went wrong updating your password.",
        };
      }
    }),
});
