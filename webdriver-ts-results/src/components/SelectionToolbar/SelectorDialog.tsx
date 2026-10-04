import React, { useRef, useState } from "react";
import { XIcon } from "lucide-react";

interface Props {
  buttonLabel: string;
  title: string;
  wide?: boolean;
  children: React.ReactNode;
}

const SelectorDialog = ({ buttonLabel, title, wide = false, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <>
      <button type="button" className="btn btn--primary" onClick={open}>
        {buttonLabel}
      </button>
      <dialog
        ref={dialogRef}
        className={`selector-dialog ${wide ? "selector-dialog--wide" : ""}`}
        aria-label={title}
        onClose={() => setIsOpen(false)}
        onClick={handleBackdropClick}
      >
        <div className="selector-dialog__header">
          <h2>{title}</h2>
          <button type="button" className="btn btn--icon" onClick={close} aria-label="Close">
            <XIcon size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="selector-dialog__body">{isOpen && children}</div>
      </dialog>
    </>
  );
};

export default SelectorDialog;
