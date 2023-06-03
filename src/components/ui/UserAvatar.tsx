import Image from "next/image";
import React, { useState } from "react";
import RandomAvatar from "../Avatar";
import { cn } from "~/lib/utils";
import { url } from "inspector";

export type AProps = {
  name: string;
  sub?: string | React.ReactElement;
} & AvatarProps;

const UserAvatar = ({ name, sub, ...restProps }: AProps) => {
  return (
    <div className="my-6 flex cursor-pointer items-start gap-5 text-gray-300">
      <Avatar {...restProps} />
      <div>
        <h2 className="text-md md:text-base">{name}</h2>
        {sub && <p className="text-xs md:text-sm">{sub}</p>}
      </div>
    </div>
  );
};

interface AvatarProps {
  image: string;
  className?: string;
}

export default UserAvatar;

export const Avatar = ({ className, image, ...restProps }: AvatarProps) => {
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const handleImageLoadingError = () => {
    setImageLoadingError(true);
  };
  console.log("IMAGE", image);
  return (
    <figure
      className={cn(
        "relative block h-12 w-12 overflow-hidden rounded-full",
        className
      )}
    >
      {image ? (
        <>
          {" "}
          {imageLoadingError ? (
            <img
              src={
                "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Tigger"
              }
              style={{
                maxWidth: "100%",
                display: "block",
              }}
              alt=""
            />
          ) : (
            <Image src={image} fill alt="" onError={handleImageLoadingError} />
          )}
        </>
      ) : (
        <img
          src={
            "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Tigger"
          }
          style={{
            maxWidth: "100%",
            display: "block",
          }}
          alt=""
        />
      )}
    </figure>
  );
};
