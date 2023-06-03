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
import Reaction from "~/components/ui/Reaction";

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
    <section className="mx-auto mb-28 flex w-[95%] flex-col items-start  gap-4 sm:flex-row sm:gap-12 md:w-auto">
      <Button
        variant={"ghost"}
        onClick={() => router.back()}
        className="md:text-md min-w-[6rem] border-none text-sm underline"
      >
        See all
      </Button>

      {isLoading || isFetching ? (
        <p className="text-center">Loading...</p>
      ) : (
        <article className="w-[100%] grow md:w-[80%]  md:flex-grow-0">
          {data?.data?.createdAt && (
            <p className="md:text-md text-sm">
              Published on{" "}
              {new Intl.DateTimeFormat("en-us", {
                dateStyle: "full",
              }).format(data?.data.createdAt)}
            </p>
          )}
          <h1 className="my-4 text-3xl font-bold md:my-2 md:text-4xl">
            {data?.data?.title}
          </h1>
          <div className="flex flex-col md:w-[90%] md:flex-row md:items-center md:justify-between">
            <UserAvatar
              name={data?.data?.user.name || "Suzan Rana"}
              sub={data?.data?.user.email || "suzan@gmail.com"}
              image={data?.data?.user.image || ""}
            />
            {sessionData?.user.id === data?.data?.authorId ? (
              <div className="hidden md:block">
                <Link href={`/blog/edit/${data?.data?.id}`}>
                  <Button
                    variant={"ghost"}
                    className="min-w-[6rem] border-none underline"
                  >
                    Edit
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
          <BlogImage src={data?.data?.image || ""} />

          <p className="my-8 rounded-md bg-slate-900 px-2 py-2  italic sm:px-5 sm:py-4">
            {data?.data?.subtitle}
          </p>
          <pre
            className={cn(
              "mb-20 max-w-[50rem]  whitespace-break-spaces text-base text-gray-400 sm:text-lg",
              p.className
            )}
          >
            {data?.data?.body}
          </pre>
          <Reaction postId={data?.data?.id} reaction={data?.data?.reaction} />
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

const BlogImage = ({ src }: { src: string }) => {
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const handleImageLoadingError = () => {
    setImageLoadingError(true);
  };
  console.log('SRC...', src)
  return (
    <div>
      <figure
        className={cn(
          "relative block min-h-[10rem] min-w-[10rem]  cursor-pointer overflow-hidden rounded-md bg-white transition-all duration-500 hover:bg-blue-400 md:aspect-video md:min-h-fit md:min-w-[25rem]"
        )}
      >
        {imageLoadingError ? (
          <img
            className="block max-w-[100%]"
            src={
              "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
            }
            alt="Image"
          />
        ) : (
          <Image
            src={
              src ||
              "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
            }
            fill
            onError={handleImageLoadingError}
            alt="Image"
          />
        )}
      </figure>
    </div>
  );
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
