"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Save, Trash2, CheckSquare, Square, Upload, Loader2 } from "lucide-react";
import { bulkDeleteGalleryItems, deleteGalleryItem, upsertGalleryItem } from "@/app/actions/admin";
import { ImageCropField } from "@/components/image-crop-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryItem = {
  id: string;
  title: string;
  alt_text: string | null;
  image_path: string;
  category: string | null;
  enabled: boolean;
  display_order: number;
};

type Props = {
  items: GalleryItem[];
};

export function GalleryManager({ items }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const bulkFormRef = useRef<HTMLFormElement>(null);

  const allIds = items.map((i) => i.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkDelete() {
    if (!bulkFormRef.current) return;
    startTransition(() => {
      const formData = new FormData(bulkFormRef.current!);
      bulkDeleteGalleryItems(formData);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          aria-label="Select all gallery images"
        >
          {allSelected ? (
            <CheckSquare className="size-4 text-primary" />
          ) : (
            <Square className="size-4" />
          )}
          {allSelected ? "Deselect all" : "Select all"}
        </button>

        {someSelected && (
          <>
            <span className="text-xs text-muted-foreground">
              {selected.size} selected
            </span>

            {/* Hidden form for bulk delete */}
            <form ref={bulkFormRef} action={bulkDeleteGalleryItems} className="hidden">
              <input type="hidden" name="ids" value={[...selected].join(",")} />
            </form>

            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="gap-1.5 ml-auto"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Delete selected ({selected.size})
            </Button>
          </>
        )}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <Upload className="size-10 opacity-40" />
          <p className="text-sm font-semibold">No gallery images yet</p>
          <p className="text-xs">Use the &ldquo;Add gallery image&rdquo; button above to upload photos.</p>
        </div>
      )}

      {/* Grid view */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <div
              key={item.id}
              className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30 shadow-[0_0_0_3px_rgb(249_115_22_/_20%)]"
                  : "hover:border-primary/40 hover:shadow-md"
              }`}
            >
              {/* Image thumbnail */}
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_path}
                  alt={item.alt_text ?? item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Selection overlay */}
                <button
                  type="button"
                  onClick={() => toggleOne(item.id)}
                  aria-label={isSelected ? "Deselect image" : "Select image"}
                  className="absolute inset-0 flex items-start justify-start p-2"
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-md border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/70 bg-black/30 text-white opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected && <CheckSquare className="size-4" />}
                  </span>
                </button>
                {/* Enabled badge */}
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    item.enabled
                      ? "bg-emerald-500/90 text-white"
                      : "bg-zinc-700/80 text-white/70"
                  }`}
                >
                  {item.enabled ? "Live" : "Hidden"}
                </span>
              </div>

              {/* Info + actions */}
              <div className="flex flex-col gap-2 p-3">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                {item.category && (
                  <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {item.category}
                  </span>
                )}

                {/* Edit form (collapsed by default, expands on click) */}
                <details className="group/details text-xs">
                  <summary className="cursor-pointer select-none text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                    Edit details ▸
                  </summary>
                  <form
                    action={upsertGalleryItem}
                    encType="multipart/form-data"
                    className="mt-2 flex flex-col gap-2"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="image_path" value={item.image_path} />
                    <Input name="title" defaultValue={item.title} placeholder="Title" className="h-8 text-xs" />
                    <Input name="category" defaultValue={item.category ?? ""} placeholder="Category" className="h-8 text-xs" />
                    <label className="flex items-center gap-2 text-xs font-semibold">
                      <input name="enabled" type="checkbox" defaultChecked={item.enabled} className="size-3.5 accent-primary" />
                      Visible on site
                    </label>
                    <ImageCropField
                      label="Replace image"
                      currentImageUrl={item.image_path}
                      aspect={1}
                      helperText="Pick a new image or leave to keep current."
                    />
                    <Button type="submit" size="sm" className="gap-1 h-8 text-xs">
                      <Save className="size-3" />
                      Save
                    </Button>
                  </form>
                </details>

                {/* Quick delete */}
                <form action={deleteGalleryItem} className="mt-auto">
                  <input type="hidden" name="id" value={item.id} />
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="h-7 w-full gap-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
