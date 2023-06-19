import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

type Props = {
  count?: number;
};

const SkeletonBlogPage = ({ count = 5 }: Props) => {
  return (
    <div className="flex flex-1 grow flex-col md:pl-32">
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="my-4 h-[2rem] w-full grow"
      />
      <div className="flex mb-4 gap-8">
        <Skeleton
          baseColor="#202020"
          highlightColor="#444"
          containerClassName="grow-[.3]"
          className="h-[2rem] grow-[.7] rounded-full w-[2rem]"
        />
        <Skeleton
          baseColor="#202020"
          highlightColor="#444"
          containerClassName="grow-[.7]"
          className="h-[2rem] grow-[.7] rounded-full w-[2rem]"
        />
      </div>
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1"
        className="mb-2 h-[25rem] w-full grow "
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="my-1 h-[1rem] w-full grow"
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="my-1 h-[1rem] w-full grow"
      />
      <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="my-1 h-[1rem] grow"
      />
       <Skeleton
        baseColor="#202020"
        highlightColor="#444"
        containerClassName="flex-1 "
        className="my-1 h-[1rem] grow"
      /> 
    </div>
  );
};

export default SkeletonBlogPage;
