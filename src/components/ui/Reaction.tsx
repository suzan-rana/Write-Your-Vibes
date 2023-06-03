import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaSadCry } from "react-icons/fa";
import { IoHappySharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { CreateReactionType } from "~/common/validation/user-validation";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { ReactionEnum } from "~/utils/category";

import { type inferRouterOutputs } from "@trpc/server";
import { type TRPCClientErrorLike } from "@trpc/react-query";
import { UseTRPCQuerySuccessResult } from "@trpc/react-query/shared";
import { AppRouter } from "~/server/api/root";
import { useSession } from "next-auth/react";
import ReactPortal from "../ReactPortal";
import UserAvatar from "./UserAvatar";
import Icons from "./Icon";

type BlogReactionType = NonNullable<
  UseTRPCQuerySuccessResult<
    inferRouterOutputs<AppRouter>["blog"]["getBlogById"]["data"],
    TRPCClientErrorLike<AppRouter>
  >["data"]
>["reaction"];

interface ReactionInterface {
  reaction: BlogReactionType;
  postId: string;
}

const findReactionOfUser = (reaction: BlogReactionType, userId: string) => {
  if (!reaction) {
    return null;
  }
  return (
    (reaction.find((r) => r.user.id === userId)
      ?.type as keyof typeof ReactionEnum) || null
  );
};

const Reaction = ({ postId }: ReactionInterface) => {
  const { data } = useSession();
  const utils = api.useContext();
  const {
    data: reaction,
    isLoading,
    isFetching,
  } = api.reaction.getReactionByBlogId.useQuery(
    {
      postId,
    },
    {
      onSuccess(reaction) {
        setReacted(findReactionOfUser(reaction, data?.user.id || ''));
      },
    }
  );
  const [reacted, setReacted] = useState<keyof typeof ReactionEnum | null>(
    findReactionOfUser(reaction!, data?.user.id || '')
  );
  const { mutate } = api.reaction.createReaction.useMutation({
    async onSuccess(data, variables, context) {
      await utils.reaction.getReactionByBlogId.invalidate({
        postId: postId,
      });
    },
  });
  const handleReactionClick = (type: keyof typeof ReactionEnum) => {
    setReacted(type);
    toast.info(`Thanks for the reaction, Author will love it.`);
    mutate({
      postId,
      type,
    });
  };

  const [showReactions, setShowReactions] = useState(false);

  if (!reaction) {
    return <></>;
  }
  return (
    <article className="my-10">
      {reaction.length !== 0 && (
        <p
          className="cursor-pointer pb-2 text-red-400 underline"
          onClick={() => {
            setShowReactions(true);
          }}
        >
          {" "}
          {reaction.length} reactions!
        </p>
      )}
      {showReactions && (
        <ShowReactions
          onClose={() => setShowReactions(false)}
          reaction={reaction}
        />
      )}
      <section className="mb-4 flex w-fit gap-1 rounded-lg bg-slate-900 px-4 py-3">
        {reactionArray.map(
          (
            reaction: Record<
              "name" | "icon",
              typeof ReactionEnum | React.ReactNode
            >,
            index
          ) => (
            <div
              onClick={() => {
                handleReactionClick(reaction.name as keyof typeof ReactionEnum);
              }}
              className={cn(
                "cursor-pointer rounded-lg px-2 py-2 hover:bg-gray-700",
                reacted === reaction.name && "bg-gray-700"
              )}
              key={index}
            >
              {reaction.icon as React.ReactNode}
            </div>
          )
        )}
      </section>
      {reacted ? (
        <p>
          {" "}
          You <span className="text-red-400">{reacted}-ed</span> the post.{" "}
        </p>
      ) : (
        <p> Give author some love!</p>
      )}
    </article>
  );
};
export default Reaction;

const reactionArray: Array<
  Record<"name" | "icon", typeof ReactionEnum | React.ReactNode>
> = [
  {
    name: "HEART",
    icon: <AiFillHeart color="red" className="h-10 w-10" />,
  },
  {
    name: "HAPPY",
    icon: <IoHappySharp color="yellow" className="h-10 w-10" />,
  },

  {
    name: "SAD",
    icon: <FaSadCry color="yellow" className="h-10  w-10" />,
  },
];

const ShowReactions = ({
  reaction,
  onClose,
}: Pick<ReactionInterface, "reaction"> & { onClose: () => void }) => {
  const handleScroll = () => {
    console.log('%cBEING ABLE TO SCROLL EVEN IF MODAL IS TURNED ON, IS A FEATURE: NOT A BUG! HAHA.', 'font-size: 40px; font-family: "Poppins", sans-serif; color: tomato;background: white; padding: 20px; text-transform: lowercase');

  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white/10">
        <section className="w-[90%] rounded-lg border-[2px]  border-slate-600 bg-slate-800 px-8 py-6 text-white md:w-[40%] md:px-8 md:py-6">
          <div className="flex justify-between ">
            <h2 className="text-lg font-semibold text-gray-200 sm:text-xl">
              Reactions
            </h2>
            <Icons.close
              onClick={onClose}
              className="h-[2rem]  w-[2rem] cursor-pointer text-red-500"
            />
          </div>
          <div>
            {reaction.map((r, i) => (
              <UserAvatar
                key={r.user.id}
                image={r.user.image!}
                name={r.user.name!}
                sub={
                  <p>
                    <span className="lowercase text-red-400">{r.type}-ed</span>{" "}
                    the post!
                  </p>
                }
              />
            ))}
          </div>
        </section>
      </div>
    </ReactPortal>
  );
};
