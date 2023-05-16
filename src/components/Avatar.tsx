import React from "react";
import {  AvatarProps, BigHead } from "@bigheads/core";
import { femaleAvatarOptions, maleAvatarOptions } from "~/lib/bigheads";

interface RandomAvatarProps extends AvatarProps {
  isMale: boolean;
}

const RandomAvatar = ({ isMale, ...restProps }: RandomAvatarProps) => {
  const getRandomOption = (options: any[]) => {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  const randomMaleAvatar = getRandomOption(maleAvatarOptions);
  const randomFemaleAvatar = getRandomOption(femaleAvatarOptions);

  return (
    <div>
      {isMale ? (
        <BigHead
          // {...restProps}
          accessory="none"
          body="chest"
          eyebrows="angry"
          eyes="happy"
          facialHair="mediumBeard"
          graphic="none"
          hat="none"
          lashes={false}
          lipColor="pink"
          mask={false}
          mouth="grin"
          {...randomMaleAvatar}
        ></BigHead>
      ) : (
        <BigHead
          accessory="none"
          body="chest"
          eyebrows="angry"
          eyes="happy"
          facialHair="none"
          graphic="none"
          hat="none"
          lashes={false}
          lipColor="pink"
          mask={false}
          mouth="grin"
          {...randomFemaleAvatar}
        />
      )}
    </div>
  );
};

export default RandomAvatar;
