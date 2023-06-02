import { useState } from "react";
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
  return (
    (reaction.find((r) => r.user.id === userId)
      ?.type as keyof typeof ReactionEnum) || null
  );
};

const Reaction = ({ postId, reaction }: ReactionInterface) => {
  const { data } = useSession();
  const [reacted, setReacted] = useState<keyof typeof ReactionEnum | null>(
    findReactionOfUser(reaction, data?.user.id!)
  );
  const { mutate } = api.reaction.createReaction.useMutation();
  const handleReactionClick = (type: keyof typeof ReactionEnum) => {
    setReacted(type);
    toast.info(`Thanks for the reaction, Author will love it.`);
    mutate({
      postId,
      type,
    });
  };

  const [showReactions, setShowReactions] = useState(false);
  return (
    <article className="my-10">
      {reaction.length && (
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
  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white/10">
        <section className="w-[50%] rounded-lg border-[2px]  border-slate-600 bg-slate-800 px-8 py-6 text-white md:w-[40%] md:px-8 md:py-6">
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
