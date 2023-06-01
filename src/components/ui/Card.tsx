import Image from "next/image";
import React, { useState } from "react";

interface CardProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  createdAt: Date;
}
const Card = ({ title, subtitle, imageSrc, createdAt }: CardProps) => {
  return (
    <article className="grow-1 min-h-[20rem] cursor-pointer sm:w-[27rem]">
      <CardImage src={imageSrc} />
      <h2 className="mb-2 mt-4 max-w-[95%] text-2xl font-semibold">{title}</h2>
      <p className="max-w-[95%] text-base">{subtitle}</p>
      <p className="mt-2 max-w-[95%]">
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
  console.log('IMAGE', src)
  return (
    <figure className="relative z-10 block min-h-[15rem] max-w-[28rem] overflow-hidden rounded-md">
      {imageLoadingError ? (
        <img
          alt="Blog Image"
          src={
            "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
          }
        />
      ) : (
        <Image
          fill
          alt="Blog Image"
          onError={handleImageLoadingError}
          src={
            src
              ? src
              : "https://tx.shadcn.com/_next/image?url=%2Fimages%2Fblog%2Fblog-post-1.jpg&w=828&q=75"
          }
        />
      )}
    </figure>
  );
};
