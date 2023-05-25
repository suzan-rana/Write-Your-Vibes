import React from "react";

type Props = {
  name: string;
  sub: string;
};

const MessageCard = ({ name, sub }: Props) => {
  return (
    <div className="flex items-start  py-3 cursor-pointer hover:bg-gray-600 px-4 rounded-md text-gray-300">
        <div className="rounded-full bg-white w-10 h-10" ></div>
      <div className="px-4">
        <h2 className="text-base">{name}</h2>
        {sub && <p className="text-sm pt-1">{sub}</p>}
      </div>
    </div>
  );
};

export default MessageCard;
