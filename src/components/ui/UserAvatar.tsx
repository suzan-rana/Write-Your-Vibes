import Image from "next/image";
import React from "react";

type Props = {
  name: string;
  email?: string;
};

const UserAvatar = ({ name, email }: Props) => {
  return (
    <div className="my-6 flex items-start gap-5 text-gray-300">
      <Avatar />
      <div>
        <h2 className="text-base">{name}</h2>
        {email && <p className="text-sm">{email}</p>}
      </div>
    </div>
  );
};

export default UserAvatar;

const Avatar = () => {
  return (
    <figure className="relative block h-12 w-12 overflow-hidden rounded-full">
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
