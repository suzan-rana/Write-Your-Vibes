import Image from "next/image";
import React from "react";
import { cn } from "~/lib/utils";

type Props = {
  src: string;
  className: string;
};

const ImageContainer = ({ src, className }: Props) => {
  return (
    <figure className={cn("relative block", className)}>
      <Image src={src} alt="My image" fill />
    </figure>
  );
};

export default ImageContainer;
