"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { ImagePlus, RotateCcw, ZoomIn, ZoomOut, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type ImageCropFieldProps = {
  name?: string;
  label: string;
  currentImageUrl?: string;
  aspect?: number;
  helperText?: string;
  required?: boolean;
};

const ASPECT_PRESETS = [
  { label: "Portrait", ratio: 9 / 16, display: "9:16" },
  { label: "Square", ratio: 1, display: "1:1" },
  { label: "Landscape", ratio: 4 / 3, display: "4:3" },
  { label: "Wide", ratio: 16 / 9, display: "16:9" },
  { label: "Banner", ratio: 5 / 3, display: "5:3" },
];

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = url;
  });
}

// Max dimension for output — keeps uploads well under Vercel's 4.5 MB body limit.
const MAX_OUTPUT_PX = 1200;

async function getCroppedFile(imageSrc: string, cropPixels: Area, fileName: string, fileType: string) {
  const image = await loadImage(imageSrc);

  // Scale down if either dimension exceeds MAX_OUTPUT_PX
  const scale = Math.min(1, MAX_OUTPUT_PX / Math.max(cropPixels.width, cropPixels.height));
  const outW = Math.round(cropPixels.width * scale);
  const outH = Math.round(cropPixels.height * scale);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to crop image.");
  }

  canvas.width = outW;
  canvas.height = outH;
  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outW,
    outH,
  );

  // Always output as JPEG at 0.82 quality — good visual quality, small file size
  const outputType = "image/jpeg";
  const outputName = fileName.replace(/\.[^.]+$/, "") + ".jpg";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Unable to export cropped image."));
      }
    }, outputType, 0.82);
  });

  return new File([blob], outputName, { type: outputType });
}

function clampZoom(value: number) {
  return Math.min(3, Math.max(1, value));
}

export function ImageCropField({
  name = "image_file",
  label,
  currentImageUrl,
  aspect = 4 / 3,
  helperText = "Choose an image, crop the visible area, then save.",
  required,
}: ImageCropFieldProps) {
  const [activeAspect, setActiveAspect] = useState(aspect);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [displayPreview, setDisplayPreview] = useState<string | null>(currentImageUrl ?? null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const preview = useMemo(() => displayPreview ?? currentImageUrl ?? null, [currentImageUrl, displayPreview]);

  function closeEditor() {
    setIsOpen(false);
    setImageSrc(null);
    setSelectedFileName(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setSelectedFileName(file.name);
    setImageSrc(previewUrl);
    setIsOpen(true);
  }

  async function handleUseCrop() {
    if (!imageSrc || !croppedAreaPixels || !fileInputRef.current || !selectedFileName) {
      return;
    }

    const currentFile = fileInputRef.current.files?.[0];
    const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels, selectedFileName, currentFile?.type ?? "image/jpeg");
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(croppedFile);
    fileInputRef.current.files = dataTransfer.files;
    setDisplayPreview(URL.createObjectURL(croppedFile));
    setIsOpen(false);
    setImageSrc(null);
    setSelectedFileName(null);
  }

  return (
    <div className="grid gap-3">
      <input ref={fileInputRef} name={name} type="file" accept="image/*" required={required} className="hidden" onChange={handleFileChange} />

      {/* Fixed-size clickable preview box */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative overflow-hidden rounded-xl border-2 border-dashed border-border bg-background/80 transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{ width: '240px', height: '180px', maxWidth: '100%' }}
        aria-label="Select image"
      >
        {preview ? (
          // Use plain <img> so blob: URLs (local file picks) are supported
          <span className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="h-full w-full object-cover" />
          </span>
        ) : (
          // Empty placeholder
          <span className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="size-8 opacity-50 transition-opacity group-hover:opacity-80" />
            <span className="text-xs font-semibold">Click to upload</span>
          </span>
        )}
        {/* Hover overlay */}
        {preview && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <ImagePlus className="size-6 text-white" />
            <span className="text-xs font-semibold text-white">Change image</span>
          </span>
        )}
      </button>

      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {isOpen && imageSrc ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="grid w-full max-w-4xl gap-4 rounded-2xl border bg-background p-4 shadow-2xl lg:grid-cols-[1fr_280px]">
            <div>
              <div className="relative h-[60svh] overflow-hidden rounded-xl border bg-black/90">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={activeAspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                  showGrid={false}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setZoom((value) => clampZoom(value - 0.2))}>
                  <ZoomOut className="size-4" />
                  Zoom out
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setZoom((value) => clampZoom(value + 0.2))}>
                  <ZoomIn className="size-4" />
                  Zoom in
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setCrop({ x: 0, y: 0 })}>
                  <RotateCcw className="size-4" />
                  Reset crop
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card/60 p-4">
              <div className="space-y-4">
                <p className="text-sm font-semibold">Crop preview</p>
                <p className="text-sm text-muted-foreground">Position the image inside the frame, then save the cropped version back into the form.</p>

                {/* Aspect ratio presets */}
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Aspect ratio</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ASPECT_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => { setActiveAspect(preset.ratio); setCrop({ x: 0, y: 0 }); setZoom(1); }}
                        className={[
                          "flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 text-center text-[10px] font-semibold transition-all duration-150 hover:border-primary/60 hover:bg-primary/10",
                          Math.abs(activeAspect - preset.ratio) < 0.01
                            ? "border-primary bg-primary/15 text-primary shadow-sm"
                            : "border-border bg-background/60 text-muted-foreground",
                        ].join(" ")}
                      >
                        {/* Mini aspect ratio visual */}
                        <span
                          className="mb-0.5 block rounded-sm border-2 border-current opacity-70"
                          style={{
                            width: preset.ratio >= 1 ? 20 : Math.round(20 * preset.ratio),
                            height: preset.ratio <= 1 ? 14 : Math.round(14 / preset.ratio),
                          }}
                        />
                        {preset.display}
                        <span className="block text-[9px] font-normal opacity-70">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-3 text-xs text-muted-foreground">
                  The file will upload as {selectedFileName ?? "the selected image"}.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={closeEditor}>
                  <X className="size-4" />
                  Cancel
                </Button>
                <Button type="button" className="flex-1" onClick={() => void handleUseCrop()}>
                  Use crop
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}