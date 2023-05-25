import React from "react";

type Props = {
  name: string;
  sub: string;
};

const MessageCard = ({ name, sub }: Props) => {
  return (
    <div className="flex cursor-pointer items-center gap-2 justify-around rounded-md px-8 pl-4 py-3 text-gray-300 hover:bg-gray-600/30">
      <div className="h-10 w-10 rounded-full bg-white"></div>
      <div className="px-4">
        <h2 className="text-base">{name}</h2>
        {sub && <p className="pt-1 text-sm">{sub}</p>}
      </div>
    </div>
  );
};

export default MessageCard;
