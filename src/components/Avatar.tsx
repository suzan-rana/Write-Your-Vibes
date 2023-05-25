import React from "react";
import { AvatarProps, BigHead } from "@bigheads/core";
import { femaleAvatarOptions, maleAvatarOptions } from "~/lib/bigheads";

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
          body="chest"
          eyebrows="angry"
          eyes="happy"
          facialHair="none2"
          graphic="none"
          lashes={false}
          lipColor="pink"
          mask={false}
          mouth="grin"
          skinTone="red"
          {...JSON.parse(image)}
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
          clothingColor="red"
          {...JSON.parse(image)}
        />
      )}
    </>
  );
};

export default RandomAvatar;
