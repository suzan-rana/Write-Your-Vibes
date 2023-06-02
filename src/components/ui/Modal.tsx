import React, { useEffect } from "react";
import ReactPortal from "../ReactPortal";
import Button from "./Button";
import { cn } from "~/lib/utils";
import { AnimatePresence, Variants, motion } from "framer-motion";

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  subtitle?: string;
  onSubmitClick: (event?: any) => void | Function;
  onCancel: () => void | Function;
  customBody?: React.ReactNode;
  submitText?: string;
  cancelText?: string;
}

const Modal = ({
  title,
  subtitle,
  onSubmitClick,
  onCancel,
  customBody,
  submitText,
  cancelText,
  ...restProps
}: ModalProps) => {
  useEffect(() => {
    // if (!document) return;
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.height = "auto";
      document.body.style.overflow = "visible";
    };
  }, []);
  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white/10">
        <motion.div
          variants={modalAnimationVariants}
          initial="initial"
          animate="animate"
          exit={"exit"}
          className="rounded-lg border-[2px] border-slate-600  bg-slate-800 w-[90%] md:w-[40%] px-8 py-6 md:px-16 md:py-12 text-white"
        >
          <h2 className="pb-8 text-center text-xl md:text-2xl font-bold">{title}</h2>
          {customBody ? (
            customBody
          ) : (
            <p className="text-center text-lg">{subtitle}</p>
          )}
          <div className="my-8 flex  flex-row justify-center gap-8">
            <Button type="button" onClick={onCancel} className="grow">
              {cancelText ? cancelText : "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={onSubmitClick}
              className={cn(
                "grow  text-white",
                submitText === "Save" ? "bg-green-600" : "bg-red-500"
              )}
            >
              {submitText ? submitText : "Delete"}
            </Button>
          </div>
        </motion.div>
      </div>
    </ReactPortal>
  );
};

export default Modal;

const modalAnimationVariants: Variants = {
  initial: {
    y: '-50vh',
    scale: 0,
    opacity: 0,
  },
  animate: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      ease: "linear",
      // duration: .5
    },
  },
};
