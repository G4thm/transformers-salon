"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Crop, ImagePlus, RotateCcw, ZoomIn, ZoomOut, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ImageCropFieldProps = {
  name?: string;
  label: string;
  currentImageUrl?: string;
  aspect?: number;
  helperText?: string;
  required?: boolean;
};

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = url;
  });
}

async function getCroppedFile(imageSrc: string, cropPixels: Area, fileName: string, fileType: string) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to crop image.");
  }

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Unable to export cropped image."));
      }
    }, fileType || "image/jpeg", 0.95);
  });

  return new File([blob], fileName, { type: blob.type || fileType || "image/jpeg" });
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
    <div className="grid gap-3 rounded-xl border bg-card/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{helperText}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="size-4" />
          Select image
        </Button>
      </div>
      <input ref={fileInputRef} name={name} type="file" accept="image/*" required={required} className="hidden" onChange={handleFileChange} />
      <div className="overflow-hidden rounded-lg border bg-background/80" style={{ aspectRatio: aspect }}>
        {preview ? (
          <div className="relative h-full w-full">
            <Image src={preview} alt={label} fill unoptimized className="object-cover" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <Crop className="size-6" />
            <span className="text-sm">No image selected yet</span>
          </div>
        )}
      </div>

      {isOpen && imageSrc ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="grid w-full max-w-4xl gap-4 rounded-2xl border bg-background p-4 shadow-2xl lg:grid-cols-[1fr_280px]">
            <div>
              <div className="relative h-[60svh] overflow-hidden rounded-xl border bg-black/90">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
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
              <div className="space-y-3">
                <p className="text-sm font-semibold">Crop preview</p>
                <p className="text-sm text-muted-foreground">Position the image inside the frame, then save the cropped version back into the form.</p>
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