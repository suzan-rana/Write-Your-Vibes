import React from "react";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon?: string;
}
const FeatureCard = ({ title, subtitle, icon }: FeatureCardProps) => {
  return (
    <article className=" max-w-[16rem] cursor-pointer">
      {icon}
      <h2 className="mb-2 mt-4 max-w-[95%] text-2xl font-semibold">{title}</h2>
      <p className="max-w-[95%] text-base">{subtitle}</p>
    </article>
  );
};


export default FeatureCard;
