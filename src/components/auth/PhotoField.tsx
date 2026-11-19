"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PhotoFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PhotoField({ value, onChange }: PhotoFieldProps) {
  const [previewFailed, setPreviewFailed] = useState(false);

  const updateValue = (nextValue: string) => {
    setPreviewFailed(false);
    onChange(nextValue);
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
              name="photoUrl"
              type="url"
              placeholder="Paste an image link"
              value={value}
              onChange={(event) => updateValue(event.target.value)}
            />
            {/* Add your ImgBB upload button here (POST /api/upload/imgbb) */}
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Direct link to a profile photo (JPG, PNG).
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
    </div>
  );
}
