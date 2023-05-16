import Image from "next/image";
import React from "react";
import { cn } from "~/lib/utils";
import RandomAvatar from "../Avatar";

type Props = {
  className: string;
  gender: "Male" | "Female";
  image: string;
};

const ImageContainer = ({ className, ...restProps }: Props) => {
  return (
    <figure
      className={cn(
        "relative block cursor-pointer bg-white transition-all duration-500 hover:bg-blue-400",
        className
      )}
    >
      <RandomAvatar {...restProps} />
    </figure>
  );
};

export default ImageContainer;
