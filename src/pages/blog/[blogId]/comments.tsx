import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Skeleton from "react-loading-skeleton";
import Comments, { usePostComment } from "~/components/Comments";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Layout from "~/components/ui/Layout";
import SkeletonCard from "~/components/ui/Skeleton/SkeletonCard";
import UserAvatar from "~/components/ui/UserAvatar";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { scrollToTop } from "~/utils/srollToTop";

type Props = {};

const BlogCommentsPage: NextPageWithLayout = (props: Props) => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { inputValue, setInputValue, isPostingComment, handlePostComment } =
    usePostComment(
      sessionData?.user.id as string,
      router.query["blogId"] as string
    );
  const route = router.query["blogId"]
    ? `/blog/${router.query["blogId"].toString()}`
    : "/blog";
  return (
    <main className="flex flex-col gap-10 md:flex-row md:items-start">
      <Button onClick={async () => {
        await router.back()
        scrollToTop()
      }} variant={"ghost"} className="min-w-[6rem] border-none underline">
        See all
      </Button>

      <section className="mb-16 min-h-[10rem] grow">
        <h2>Comments</h2>
        <div className="my-4 flex items-center gap-6">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell how you feel"
            className="py-6"
          />{" "}
          <Button disabled={isPostingComment} onClick={handlePostComment}>
            <span className="hidden sm:block">Comment</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
        <DisplayComments />
      </section>
    </main>
  );
};

export default BlogCommentsPage;
BlogCommentsPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
const DisplayComments = () => {
  const router = useRouter();
  const { data, isLoading, isFetching } = useFetchAllComments(
    router.query["blogId"] as string
  );
  if (isLoading || isFetching) {
    return (
      <div className="">
        <Skeleton
          baseColor="#202020"
          highlightColor="#444"
          containerClassName="flex-1"
          className="mb-2 h-[2rem] w-full grow "
        />
        <Skeleton
          baseColor="#202020"
          highlightColor="#444"
          containerClassName="flex-1"
          className="mb-2 h-[2rem] w-full grow "
        />
      </div>
    );
  }
  return (
    <>
      {" "}
        <>
          {data?.data.map((comment, index) => (
            <UserAvatar
              key={comment.id}
              name={comment.user.name as string}
              sub={comment.content}
              image={comment.user.image || ""}
            />
          ))}
        </>
    </>
  );
};

const useFetchAllComments = (postId: string) => {
  const { data, isLoading, isFetching, refetch } =
    api.comment.getAllBlogPostComments.useQuery(
      {
        id: postId,
      },
      {
        enabled: postId !== undefined,
        refetchOnWindowFocus: false,
      }
    );
  return {
    data,
    isLoading,
    isFetching,
    refetch,
  };
};
