import React from "react";
import { cn } from "~/lib/utils";

// @typescript-eslint/no-empty-interface
interface DividerProps extends React.HTMLProps<HTMLDivElement> {
  type?: string;
}

const Divider = ({ className, ...restProps }: DividerProps) => {
  return (
    <div
      className={cn("my-4 h-[2px] w-[100%] rounded-lg bg-slate-800", className)}
      {...restProps}
    ></div>
  );
};

export default Divider;
