import Image from "next/image";
import React from "react";
import RandomAvatar from "../Avatar";
import { cn } from "~/lib/utils";

export type AProps = {
  name: string;
  sub?: string;
} & AvatarProps;

const UserAvatar = ({ name, sub, ...restProps }: AProps) => {
  return (
    <div className="my-6 flex items-start gap-5 text-gray-300">
      <Avatar {...restProps} />
      <div>
        <h2 className="text-base">{name}</h2>
        {sub && <p className="text-sm">{sub}</p>}
      </div>
    </div>
  );
};

interface AvatarProps {
  image: string;
  className?:string;
}

export default UserAvatar;

export const Avatar = ({className,image, ...restProps }: AvatarProps) => {
  return (
    <figure className={cn("relative block h-12 w-12 overflow-hidden rounded-full", className)}>
      <Image src={image} fill alt="Profile image"/>
    </figure>
  );
};
