import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

type Props = {
  count?: number;
};

const SkeletonCard = ({ count = 5 }: Props) => {
  return (
    <div className="flex flex-1 flex-col grow">
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1"
        className="mb-2 h-[12rem] grow w-full "
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="h-[1rem] my-1 grow w-full"
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="h-[1rem] my-1 grow w-full"
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="h-[1rem] my-1 grow"
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="h-[1rem] grow"
      />
    </div>
  );
};

export default SkeletonCard;
