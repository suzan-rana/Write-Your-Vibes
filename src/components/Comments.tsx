import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import UserAvatar from "./ui/UserAvatar";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { delay } from "../utils/delay";
import Skeleton from "react-loading-skeleton";

type Props = {};

const Comments = (props: Props) => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { inputValue, setInputValue, isPostingComment, handlePostComment } =
    usePostComment(
      sessionData?.user.id as string,
      router.query["blogId"] as string
    );
  const route = router.query["blogId"]
    ? `/blog/${router.query["blogId"].toString()}/comments`
    : "/blog";
  return (
    <section className="mb-16 min-h-[10rem]">
      <h2>Comments</h2>
      <div className="my-4 flex items-center gap-2 md:gap-6">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tell how you feel"
          className="grow py-6"
        />
        {/* // eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button disabled={isPostingComment} onClick={handlePostComment}>
          <span className="hidden md:block">Comment</span>
          <span className="md:hidden">+</span>
        </Button>
      </div>
      <DisplayComments />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Link href={route}>
        <Button className="bg-transparent text-white underline">
          View all comments
        </Button>
      </Link>
    </section>
  );
};

export default Comments;

const useFetchTopComments = (postId: string) => {
  const { data, isLoading, isFetching, refetch } =
    api.comment.getCommentsForBlogPage.useQuery(
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

export const usePostComment = (authorId: string, postId: string) => {
  const [inputValue, setInputValue] = useState("");
  const commentQuery = api.useContext();
  const { mutateAsync, isLoading: isPostingComment } =
    api.comment.createComment.useMutation({
      async onSuccess(data, variables, context) {
        toast.dismiss("LOADING");
        delay();
        toast.success(data.message);
        await commentQuery.comment.getCommentsForBlogPage.invalidate();
        await commentQuery.comment.getAllBlogPostComments.invalidate();
      },
      onError(error, variables, context) {
        toast.error(
          error.message || "Something went wrong in adding new comment."
        );
      },
    });

  const handlePostComment = async () => {
    if (inputValue === "") {
      toast.error("Please add a comment");
      return;
    }
    toast.loading("Posting comment...", {
      toastId: "LOADING",
    });
    await mutateAsync({
      content: inputValue,
      postId,
      userId: authorId,
    }).then(() => {
      setInputValue("");
    });
  };
  return {
    handlePostComment,
    inputValue,
    setInputValue,
    isPostingComment,
  };
};

const DisplayComments = () => {
  const router = useRouter();
  const { data, isLoading, isFetching } = useFetchTopComments(
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
      <>
        {data?.data.map((comment, index) => (
          <UserAvatar
            image={comment.user.image || ""}
            key={comment.id}
            name={comment.user.name as string}
            sub={comment.content}
          />
        ))}
      </>
    </>
  );
};
