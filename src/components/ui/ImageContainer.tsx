import Image from "next/image";
import React, { useState } from "react";
import { cn } from "~/lib/utils";
import RandomAvatar from "../Avatar";

type Props = {
  className: string;
  gender: "Male" | "Female";
  image: string;
};

const ImageContainer = ({ className, image, ...restProps }: Props) => {
  const [imageLoadingError, setImageLoadingError] = useState(false);
  const handleImageLoadingError = () => {
    setImageLoadingError(true);
  };
  return (
    <picture
      className={cn(
        "relative overflow-hidden border flex cursor-pointer items-center justify-center bg-white transition-all duration-500 hover:bg-blue-400",
        className
      )}
      style={{ textAlign: "center" }}
    >
      {imageLoadingError ? (
        <img
          src={
            "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Tigger"
          }
          className="max-h-full max-w-full object-cover"
          alt="Profile Image"
          style={{ display: "inline-block" }}
        />
      ) : (
        <Image
          src={
            image ||
            "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Tigger"
          }
          fill
          className="object-cover object-center  w-full min-h-full"
          alt="Profile Image"
          onError={handleImageLoadingError}
        />
      )}
    </picture>
  );
};

export default ImageContainer;
