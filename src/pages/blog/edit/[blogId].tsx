import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  UpdateBlogSchema,
  UpdateBlogType,
} from "~/common/validation/blog-validation";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Layout from "~/components/ui/Layout";
import TextArea from "~/components/ui/TextArea";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

type Props = {};

const EditPostPage = (props: Props) => {
  const { register, handleSubmit } = useForm<
    Omit<UpdateBlogType, "id" | "image">
  >({
    resolver: zodResolver(UpdateBlogSchema.omit({ id: true, image: true })),
  });

  const { query, ...router } = useRouter();

  const { data, isLoading, isFetching } = api.blog.getBlogById.useQuery(
    {
      id: query?.["blogId"] ? query?.["blogId"].toString() : "",
    },
    {
      enabled: query["blogId"] !== undefined,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const blogQuery = api.useContext();

  const { mutate, isLoading: isSaving } = api.blog.updateBlogById.useMutation({
    async onSuccess(data) {
      toast.success(data.message || "POST UPDATED SUCCESSSFULLY.");
      await blogQuery.blog.getBlogById.invalidate({
        id: query?.["blogId"].toString(),
      });
      await blogQuery.blog.getBlogByUserId.invalidate()
      await blogQuery.blog.invalidate()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const route = query["blogId"]
        ? `/blog/${query["blogId"].toString()}`
        : "/blog";
      await router.push(route);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (!query["blogId"]) return <>Something went wrong.</>;

  // handle submit
  const onSubmit: SubmitHandler<Omit<UpdateBlogType, "id" | "image">> = (
    data
  ) => {
    if (data.title === "") {
      toast.error("Please add a title");
      return;
    }
    if (data.subtitle === "") {
      toast.error("Please add a subtitle.");
      return;
    }
    if (!data.body) {
      toast.error("Please add something to your body.");
      return;
    }
    if (data.title.length >= 100) {
      toast.error("Please add a title that is less than 50 characters.");
      return;
    }
    mutate({
      ...data,
      id: query["blogId"]?.toString() as string,
    });
  };

  return (
    <>
      {isLoading || isFetching ? (
        <p className="my-20 text-center">Loading...</p>
      ) : (
        <section>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto ml-2 mt-32 min-h-[80vh]  md:ml-2 md:mt-12  "
            style={{
              marginInline: "auto",
            }}
          >
            <div className="flex justify-between">
              <Link href={"/blog"}>
                <Button
                  type="button"
                  disabled={isSaving}
                  variant={"ghost"}
                  className="min-w-[6rem] border-none underline"
                >
                  Cancel
                </Button>
              </Link>
              <Button className="hidden min-w-[9rem] sm:block">
                Save post
              </Button>
            </div>
            <section className="mb-4 flex items-center justify-center gap-4">
              <Input
                placeholder="YOUR TITLE HERE"
                defaultValue={data?.data?.title}
                {...register("title")}
                className="border-none  border-transparent text-3xl font-bold outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
              />
            </section>
            <Input
              {...register("subtitle")}
              placeholder="Your subtitle here"
              defaultValue={data?.data?.subtitle}
              className="border-none  border-transparent text-lg text-gray-400 outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
            />
            <TextArea
              {...register("body")}
              placeholder="YOUR TEXT HERE"
              className="min-h-[70vh]  "
              defaultValue={data?.data?.body}
            />
            {/* <Button
              type="submit"
              className={cn("mb-20 ml-6 block text-center sm:hidden")}
            >
              Save post
            </Button> */}
          </form>
        </section>
      )}
    </>
  );
};

export default EditPostPage;
EditPostPage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
