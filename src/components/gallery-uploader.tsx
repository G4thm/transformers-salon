"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, CheckCircle2, XCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertGalleryItem } from "@/app/actions/admin";

/** Compress + resize a File to JPEG ≤ 1200px, ~0.80 quality */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      let { width, height } = img;
      if (Math.max(width, height) > MAX) {
        const scale = MAX / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
            resolve(new File([blob], name, { type: "image/jpeg" }));
          } else {
            resolve(file); // fallback: send as-is
          }
        },
        "image/jpeg",
        0.80,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

type FileStatus = { name: string; status: "pending" | "uploading" | "done" | "error"; error?: string };

export function GalleryUploader({ category }: { category?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [catValue, setCatValue] = useState(category ?? "");
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [statuses, setStatuses] = useState<FileStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [done, setDone] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setDone(false);
    setStatuses([]);
    // Release old previews
    setPreviews((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.url)); return []; });
    setPreviews(files.map((f) => ({ file: f, url: URL.createObjectURL(f) })));
  }

  async function handleUpload() {
    if (!previews.length) return;
    setIsUploading(true);
    setStatuses(previews.map((p) => ({ name: p.file.name, status: "pending" })));

    for (let i = 0; i < previews.length; i++) {
      const { file } = previews[i];
      setStatuses((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "uploading" } : s));
      try {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.append("image_file", compressed, compressed.name);
        fd.append("category", catValue);
        fd.append("enabled", "on");
        // Call the server action via bound formData
        await upsertGalleryItem(fd);
        setStatuses((prev) => prev.map((s, idx) => idx === i ? { ...s, status: "done" } : s));
      } catch (err) {
        setStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: "error", error: String(err) } : s,
          ),
        );
      }
    }

    setIsUploading(false);
    setDone(true);
    // Reset after 2s
    setTimeout(() => {
      setPreviews((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.url)); return []; });
      setStatuses([]);
      setDone(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 2000);
  }

  return (
    <div className="grid gap-4">
      {/* Drop zone / file picker */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-background/60 py-10 transition hover:border-primary/60 hover:bg-primary/5"
        disabled={isUploading}
      >
        <Upload className="size-8 text-muted-foreground transition group-hover:text-primary" />
        <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground">
          Click to select images
        </span>
        <span className="text-xs text-muted-foreground">Hold Ctrl / Cmd to select multiple • Auto-compressed before upload</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {/* Category */}
      <label className="grid gap-1 text-sm font-semibold">
        Category <span className="font-normal text-muted-foreground">(optional)</span>
        <Input
          value={catValue}
          onChange={(e) => setCatValue(e.target.value)}
          placeholder="e.g. men, women, bridal"
          disabled={isUploading}
        />
      </label>

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {previews.map((p, i) => {
            const st = statuses[i];
            return (
              <div key={p.url} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.file.name} className="h-full w-full object-cover" />
                {st && (
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/50`}>
                    {st.status === "uploading" && <Loader2 className="size-5 animate-spin text-white" />}
                    {st.status === "done" && <CheckCircle2 className="size-5 text-emerald-400" />}
                    {st.status === "error" && <XCircle className="size-5 text-red-400" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload button */}
      {previews.length > 0 && !done && (
        <Button type="button" onClick={handleUpload} disabled={isUploading} className="gap-2">
          {isUploading ? (
            <><Loader2 className="size-4 animate-spin" /> Uploading {previews.length} image{previews.length !== 1 ? "s" : ""}…</>
          ) : (
            <><ImagePlus className="size-4" /> Upload {previews.length} image{previews.length !== 1 ? "s" : ""}</>
          )}
        </Button>
      )}

      {done && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" /> All images uploaded! Refreshing…
        </p>
      )}
    </div>
  );
}
