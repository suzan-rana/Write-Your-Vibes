import * as z from "zod";
import { CategoryEnum } from "~/utils/category";

export const CreateNewBlogSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  image: z.any().optional().nullable(),
  body: z.string(),
  category: z.nativeEnum(CategoryEnum)
});
export type CreateBlogType = z.infer<typeof CreateNewBlogSchema>;

export const UpdateBlogSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  body: z.string().optional(),
  image: z.string().optional()

});
export type UpdateBlogType = z.infer<typeof UpdateBlogSchema>
