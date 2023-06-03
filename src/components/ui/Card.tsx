import Image from "next/image";
import React, { useState } from "react";

interface CardProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  createdAt: Date;
  count: {
    comment?: number;
    reaction?: number;
  };
}
const Card = ({ title, subtitle, imageSrc, createdAt, count }: CardProps) => {
  return (
    <article className="grow-1 min-h-[20rem] cursor-pointer sm:w-[27rem]">
      <CardImage src={imageSrc} />
      <h2 className="mb-2 max-w-[95%] text-xl font-semibold sm:mt-4 sm:text-2xl">
        {title}
      </h2>
      <p className="max-w-[95%] text-sm line-clamp-2 sm:text-base">
        {subtitle}
      </p>
      <p className="my-2 max-w-[95%] text-sm sm:text-base">
        {count?.reaction ? <span className="text-red-400">{count.reaction} reactions</span> : null}{" "}
        {(count?.reaction && count?.comment) ? "& ": <span className="text-red-400" >New!</span>}
        {count?.comment ? <span className="text-red-400">{count.comment} comments</span> : null}{" "}
      </p>
      <p className="max-w-[95%] italic">
        {new Intl.DateTimeFormat("en-us", {
          dateStyle: "full",
        }).format(createdAt)}
      </p>
    </article>
  );
};

export default Card;
// https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75

const CardImage = ({ src }: { src?: string }) => {
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const handleImageLoadingError = () => {
    setImageLoadingError(true);
  };
  return (
    <figure className="relative z-10 block min-h-[14rem] max-w-[28rem] overflow-hidden rounded-md">
      {imageLoadingError ? (
        <img
          alt="Blog Image"
          src={
            "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
          }
          className="block max-w-[100%] object-cover object-center"
        />
      ) : (
        <Image
          fill
          className="block max-w-[100%] object-contain object-center"
          alt="Blog Image"
          onError={handleImageLoadingError}
          src={
            // src
            //   ? src
            //   :
            "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
          }
        />
      )}
    </figure>
  );
};
