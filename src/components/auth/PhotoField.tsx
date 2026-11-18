"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type PhotoFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function PhotoField({
  value,
  error,
  onChange,
}: PhotoFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const updateValue = (nextValue: string) => {
    setPreviewFailed(false);
    onChange(nextValue);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image is too large", {
        description: "Please choose an image smaller than 5MB.",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/imgbb", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed. Please try again.");
      }

      updateValue(data.url);
      toast.success("Photo uploaded.");
    } catch (uploadError) {
      toast.error("Could not upload photo", {
        description:
          uploadError instanceof Error
            ? uploadError.message
            : "Paste a direct image link instead.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="photo-url">
        Photo{" "}
        <span className="font-normal text-muted-foreground">(optional)</span>
      </Label>

      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-secondary">
          {value && !previewFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Profile preview"
              className="size-full object-cover"
              onError={() => setPreviewFailed(true)}
            />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <Input
              id="photo-url"
              type="url"
              placeholder="Paste an image link"
              value={value}
              onChange={(event) => updateValue(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "photo-url-error" : undefined}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Upload photo"
              className="shrink-0"
            >
              {uploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Paste a link or upload an image (max 5MB).
            </p>
            {value && (
              <button
                type="button"
                onClick={() => updateValue("")}
                className="shrink-0 text-xs font-medium text-destructive hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <FieldError id="photo-url-error" message={error} />
    </div>
  );
}
