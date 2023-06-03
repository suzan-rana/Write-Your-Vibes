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
  console.log('IMAGE...', image)
  return (
    <figure
      className={cn(
        "relative block cursor-pointer bg-white transition-all duration-500 hover:bg-blue-400",
        className
      )}
    >
      {imageLoadingError ? (
        <img src={"https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Tigger"} className="max-w-[100%] block" alt="Profile Image"></img>
      ) : (
        <Image src={image} fill alt="Profile Image" onError={handleImageLoadingError}></Image>
      )}
    </figure>
  );
};

export default ImageContainer;
