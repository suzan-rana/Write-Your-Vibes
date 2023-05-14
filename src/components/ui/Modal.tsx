import React, { useEffect } from "react";
import ReactPortal from "../ReactPortal";
import Button from "./Button";

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  subtitle: string;
  onSubmitClick: () => void | Function;
  onCancel: () => void | Function;
}

const Modal = ({
  title,
  subtitle,
  onSubmitClick,
  onCancel,
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
      <div className="scroll-0 fixed inset-0 flex items-center justify-center overflow-hidden bg-white/30">
        <dialog
          // {...restProps}
          open={true}
          className="max-w-[35rem] rounded-xl bg-slate-950  px-16 py-12 text-white"
        >
          <h2 className="pb-8 text-center text-2xl font-bold">{title}</h2>
          <p className="text-center text-lg">{subtitle}</p>
          <div className="my-8 flex  flex-row justify-center gap-8">
            <Button onClick={onCancel} className="grow">
              Cancel
            </Button>
            <Button
              onClick={onSubmitClick}
              className="grow bg-red-500 text-white"
            >
              Delete
            </Button>
          </div>
        </dialog>
      </div>
    </ReactPortal>
  );
};

export default Modal;
