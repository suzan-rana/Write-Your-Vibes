import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

const textAreaVariants = cva(
  "mx-2   text-gray-400 my-6 w-[100%] resize-none border-none bg-transparent outline-none pr-12 pl-2"
);
interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, children, ...restProps }, ref) => {
    return (
      <textarea
        className={cn(textAreaVariants({ className }))}
        {...restProps}
        ref={ref}
      >
        {children}
      </textarea>
    );
  }
);
TextArea.displayName = 'TextArea'
export default TextArea;
