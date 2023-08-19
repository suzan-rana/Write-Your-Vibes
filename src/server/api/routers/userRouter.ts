import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import * as z from "zod";
import { verify, hash } from "argon2";
import {
  UpdatePasswordSchema,
  UpdateProfileSchema,
} from "~/common/validation/user-validation";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getPersonalDetails: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        biography: true,
        image: true,
        email: true,
        gender: true,
      },
    });
  }),
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
  // [GET]
  getAllUsers: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        where: {
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          gender: true,
          _count: {
            select: {
              post: true,
            },
          },
        },
      });
      const totalUserCount = await ctx.prisma.user.count({
        where: {
          role: 'USER'
        }
      });
      return {
        status: 200,
        data: users,
        totalUserCount,
        totalPages: Math.ceil(totalUserCount / input.limit),
      };
    }),
  deleteUserByUserId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First, delete all comments associated with the post

      const deleteUser = await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
        include: {
          comment: true,
        },
      });

      if (!deleteUser) throw new TRPCError({ code: "BAD_REQUEST" });

      return {
        status: 201,
        message: "User DELETED SUCCESSFULLY",
      };
    }),
});
