"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminModalProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminModal({ triggerLabel, title, description, children }: AdminModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button type="button" onClick={() => dialogRef.current?.showModal()}>
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        onSubmit={() => dialogRef.current?.close()}
        className="backdrop:bg-black/60 fixed inset-0 z-50 m-auto w-[min(92vw,64rem)] rounded-2xl border bg-background p-0 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div>
            <h3 className="text-xl font-black">{title}</h3>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => dialogRef.current?.close()} aria-label="Close dialog">
            <X />
          </Button>
        </div>
        <div className="max-h-[80svh] overflow-y-auto p-5">{children}</div>
      </dialog>
    </>
  );
}