import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import "./modal.css";
export function Modal({
  title,
  children,
  onClose,
  sheet = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  sheet?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const drag = useRef<number | null>(null);
  useEffect(() => {
    const el = dialog.current!;
    const old = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.showModal();
    el.focus();
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      if (old?.isConnected) old.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={sheet ? "modal bottom-sheet" : "modal small-modal"}
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      onCancel={(e) => {
        e.preventDefault();
        close.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            close.current();
        }
      }}
    >
      {sheet && (
        <button
          className="sheet-drag"
          aria-label="상세 닫기"
          onClick={onClose}
          onPointerDown={(e) => {
            drag.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            if (drag.current !== null && e.clientY - drag.current > 50)
              onClose();
            drag.current = null;
          }}
        />
      )}
      {children}
    </dialog>
  );
}
