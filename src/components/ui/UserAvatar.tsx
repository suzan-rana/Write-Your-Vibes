import Image from "next/image";
import React from "react";
import RandomAvatar from "../Avatar";

type Props = {
  name: string;
  sub?: string;
};

const UserAvatar = ({ name, sub }: Props) => {
  return (
    <div className="my-6 flex items-start gap-5 text-gray-300">
      <Avatar />
      <div>
        <h2 className="text-base">{name}</h2>
        {sub && <p className="text-sm">{sub}</p>}
      </div>
    </div>
  );
};

export default UserAvatar;

const Avatar = () => {
  return (
    <figure className="relative block h-12 w-12 overflow-hidden rounded-full">
      {/* <RandomAvatar isMale={true} /> */}
      <Image
        src={
          "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg"
        }
        fill
        alt="Avatar"
      />
    </figure>
  );
};
