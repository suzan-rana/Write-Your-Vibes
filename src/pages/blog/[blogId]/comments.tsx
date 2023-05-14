import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Comments, { usePostComment } from "~/components/Comments";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Layout from "~/components/ui/Layout";
import UserAvatar from "~/components/ui/UserAvatar";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

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
    <main className="flex items-start gap-10">
      <Link href={route}>
        <Button
          variant={"ghost"}
          className="min-w-[6rem] border-none underline"
        >
          See all
        </Button>
      </Link>
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
            Comment
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
  return (
    <>
      {" "}
      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          {data?.data.map((comment, index) => (
            <UserAvatar
              key={comment.id}
              name={comment.author.name as string}
              email={comment.content}
            />
          ))}
        </>
      )}
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
