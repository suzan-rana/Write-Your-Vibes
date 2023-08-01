import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export const buttonVariants = cva(
  "rounded-md  border-[1px] border-black/70 text-sm  bg-white px-4 py-2 sm:px-4 sm:py-3 text-black transition-all cursor-pointer hover:border-white hover:bg-black/70 hover:text-slate-100 ",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        ghost:
          "bg-black text-white border-white border hover:text-slate-900 hover:bg-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8",
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
const Button = ({
  variant,
  size,
  className,
  disabled,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...restProps}
    />
  );
};
export default Button;
