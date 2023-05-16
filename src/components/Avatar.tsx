import React from "react";
import { AvatarProps, BigHead } from "@bigheads/core";
import { femaleAvatarOptions, maleAvatarOptions } from "~/lib/bigheads";
import { useSession } from "next-auth/react";

interface RandomAvatarProps extends AvatarProps {
  gender: "Male" | "Female";
  image: string;
}

const RandomAvatar = ({ gender, image, ...restProps }: RandomAvatarProps) => {
  if(!image) return <></>
  return (
    <>
      {gender === "Male" ? (
        <BigHead
          accessory="none"
          body="chest"
          eyebrows="angry"
          eyes="happy"
          facialHair="none2"
          graphic="none"
          hat="none"
          lashes={false}
          lipColor="pink"
          mask={false}
          mouth="grin"
          skinTone="red"
          {...JSON.parse(image)}
          // {...restProps}
          clothing="tankTop"
          clothingColor="green"
        ></BigHead>
      ) : (
        <BigHead
          accessory="shades"
          body="chest"
          eyebrows="angry"
          eyes="happy"

          facialHair="none"
          graphic="none"
          hat="none"
          hairColor="orange"
          hair="long"
          lashes={false}
          lipColor="pink"
          mask={false}
          mouth="tongue"
          clothing="dress"
          clothingColor="red"
          {...JSON.parse(image)}
          // {...restProps}
        />
      )}
    </>
  );
};

export default RandomAvatar;
