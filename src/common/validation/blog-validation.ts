import * as z from "zod";

export const CreateNewBlogSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  image: z.any().optional(),
  body: z.string(),
});
export type CreateBlogType = z.infer<typeof CreateNewBlogSchema>;

export const UpdateBlogSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  image: z.string().optional(),
});
export type UpdateBlogType = z.infer<typeof UpdateBlogSchema>
