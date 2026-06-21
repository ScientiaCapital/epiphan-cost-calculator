"use client";

import { useEffect } from "react";

interface DetailsDrawerProps {
  open: boolean;
  title: string;
  /** When set, scroll this element id into view after the drawer opens. */
  scrollToId?: string | null;
  onClose: () => void;
  children: React.ReactNode;
}

/** Right-side slide-over for the "proof" content (full cost breakdown, product
 *  cards, methodology). Keeps the cockpit itself to one no-scroll screen — the
 *  detail is one click away and scrolls inside the drawer. */
export function DetailsDrawer({ open, title, scrollToId, onClose, children }: DetailsDrawerProps) {
  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Deep-link: once open, scroll the requested category into view (after the
  // slide-in transition so the layout has settled).
  useEffect(() => {
    if (!open || !scrollToId) return;
    const t = setTimeout(() => {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
    return () => clearTimeout(t);
  }, [open, scrollToId]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 bg-teal-deep/45 transition-opacity duration-200 z-40 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed top-0 right-0 h-full w-[480px] max-w-[92vw] bg-surface-2 shadow-[0_10px_24px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.06)] z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between h-[52px] px-4 bg-ink text-white flex-none">
          <span className="font-semibold text-[14px]">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="text-indigo-soft hover:text-white text-[20px] leading-none cursor-pointer"
          >
            &times;
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </aside>
    </>
  );
}
