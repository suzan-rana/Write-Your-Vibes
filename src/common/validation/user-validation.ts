import * as z from "zod";
import { ReactionEnum } from "~/utils/category";
export const UpdateProfileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name should be a string.",
      description: "Name is required string field.",
    })
    .regex(/^[a-zA-Z]+$/, {
      message: "Name must contain only alphabetical characters."
    })
    .min(2, "Name should be atleast 2characters long."),
  biography: z.string(),
  image: z.string().nullable(),
  gender: z.enum(["Male", "Female"]),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});
export type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>;

export const CreateReactionSchema = z.object({
  postId: z.string(),
  type: z.nativeEnum(ReactionEnum),
});
export type CreateReactionType = z.infer<typeof CreateReactionSchema>;
