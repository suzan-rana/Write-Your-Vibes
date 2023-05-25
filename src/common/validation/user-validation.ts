import * as z from "zod";
export const UpdateProfileSchema = z.object({
  name: z.string(),
  biography: z.string(),
  image: z.string(),
  gender: z.enum(["Male", "Female"]),
});

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>


export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});
export type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>
