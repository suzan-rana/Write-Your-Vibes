import React, { SetStateAction, useState } from "react";
import { NextPageWithLayout, p } from "../../_app";
import Layout from "~/components/ui/Layout";
import Button from "~/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import UserAvatar from "~/components/ui/UserAvatar";
import ImageContainer from "~/components/ui/ImageContainer";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";
import Modal from "~/components/ui/Modal";
import { toast } from "react-toastify";
import Comments from "~/components/Comments";
import Image from "next/image";

("use client");

type Props = {};

const BlogItemPage: NextPageWithLayout = (props: Props) => {
  const { data: sessionData } = useSession();
  const [deleteBlogModal, setDeleteBlogModal] = useState(false);
  const { query, ...router } = useRouter();
  const { data, isLoading, isFetching } = api.blog.getBlogById.useQuery(
    {
      id: query?.["blogId"] ? query?.["blogId"].toString() : "",
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: query?.["blogId"] !== undefined,
    }
  );

  const { handleDeleteBlog, isDeletingBlog } = useDeleteBlog(
    query?.["blogId"] as string,
    setDeleteBlogModal
  );

  if (!query["blogId"]) return <>Something went wrong.</>;

  // delete modal

  const handleDeleteButtonClick = () => {
    setDeleteBlogModal((prev) => !prev);
  };

  const handleClose = () => {
    setDeleteBlogModal(false);
  };

  if (isDeletingBlog) {
    return <p className="my-20 text-center text-2xl">Deleting the blog...</p>;
  }

  return (
    <section className="mb-28 flex flex-col items-start gap-3 sm:flex-row sm:gap-12">
      <Link href={"/blog"}>
        <Button
          variant={"ghost"}
          className="min-w-[6rem] border-none underline"
        >
          See all
        </Button>
      </Link>
      {isLoading || isFetching ? null : (
        <article className="grow">
          {data?.data?.createdAt && (
            <p>
              Published on{" "}
              {new Intl.DateTimeFormat("en-us", {
                dateStyle: "full",
              }).format(data?.data.createdAt)}
            </p>
          )}
          <h1 className="my-2 text-4xl font-bold">{data?.data?.title}</h1>
          <div className="flex w-[95%] items-center justify-between">
            <UserAvatar
              name={data?.data?.user.name || "Suzan Rana"}
              sub={data?.data?.user.email || "suzan@gmail.com"}
              image={data?.data?.user.image || ""}
              gender={data?.data?.user.gender as "Male" | "Female"}
            />
            {sessionData?.user.id === data?.data?.authorId ? (
              <div>
                <Link href={`/blog/edit/${data?.data?.id as string}`}>
                  <Button
                    variant={"ghost"}
                    className="min-w-[6rem] border-none underline"
                  >
                    Edit Post
                  </Button>
                </Link>
                <Button
                  onClick={handleDeleteButtonClick}
                  variant={"ghost"}
                  className="min-w-[6rem] border-none text-red-500 underline"
                >
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
          <figure
            className={cn(
              "relative block min-h-[25rem] w-[45rem] max-w-[100%] cursor-pointer overflow-hidden rounded-md bg-white transition-all duration-500 hover:bg-blue-400"
            )}
          >
            <Image
              src={
                data?.data?.image ||
                "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
              }
              fill
              alt="Image"
            />
          </figure>

          <p className="my-8">{data?.data?.subtitle}</p>
          <pre
            className={cn(
              "mb-20 max-w-[50rem] whitespace-break-spaces text-gray-400",
              p.className
            )}
          >
            {data?.data?.body}
          </pre>
          <Comments />
        </article>
      )}

      {deleteBlogModal && (
        <>
          <Modal
            onCancel={handleClose}
            onSubmitClick={() => {
              handleDeleteBlog();
            }}
            title="Do you want to delete this post?"
            subtitle="Are you absolutely sure that you want to delete this post. Deleting this post will mean you will never regain access to this post and will be lost permanently"
          />
        </>
      )}
    </section>
  );
};

export default BlogItemPage;
BlogItemPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

const useDeleteBlog = (
  id: string,
  setDeleteBlogModal: React.Dispatch<SetStateAction<boolean>>
) => {
  const router = useRouter();
  const { mutate, isLoading: isDeletingBlog } =
    api.blog.deleteBlogByBlogId.useMutation({
      async onSuccess(data, variables, context) {
        toast.success(data.message || "BLOG DELETED SUCCESSFULLY.");
        setDeleteBlogModal(false);
        await router.push("/blog");
      },
      onError(error, variables, context) {
        toast.error(error.message || "SOMETHING WENT WRONG DELETING THE BLOG.");
      },
    });

  const handleDeleteBlog = () => {
    mutate({
      id,
    });
  };
  return { handleDeleteBlog, isDeletingBlog };
};
