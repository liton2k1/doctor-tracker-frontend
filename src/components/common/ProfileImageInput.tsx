"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Trash2, Undo2 } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, validateImage } from "@/lib/formData";
import { getInitials } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export interface ProfileImageValue {
  file: File | null;
  removed: boolean;
}

interface ProfileImageInputProps {
  name: string;
  currentUrl?: string;
  value: ProfileImageValue;
  onChange: (value: ProfileImageValue) => void;
}

export function ProfileImageInput({
  name,
  currentUrl,
  value,
  onChange,
}: ProfileImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (value.file ? URL.createObjectURL(value.file) : undefined),
    [value.file],
  );
  useEffect(
    () => () => (previewUrl ? URL.revokeObjectURL(previewUrl) : undefined),
    [previewUrl],
  );

  const shownUrl = value.file
    ? previewUrl
    : value.removed
      ? undefined
      : currentUrl;
  const hasImage = Boolean(shownUrl);

  const handleFile = (file?: File) => {
    if (!file) return;
    const problem = validateImage(file);
    setError(problem);
    if (!problem) onChange({ file, removed: false });
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    setError(null);

    onChange(
      value.file
        ? { file: null, removed: false }
        : { file: null, removed: true },
    );
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        Profile photo
      </span>
      <div className="flex items-center gap-4">
        <Avatar
          src={shownUrl}
          initials={getInitials(name) || "?"}
          alt="Profile preview"
          className="h-16 w-16 text-lg"
        />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {hasImage ? "Change" : "Upload"}
            </Button>
            {hasImage && (
              <Button size="sm" variant="ghost" onClick={handleRemove}>
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
            {value.removed && !value.file && currentUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onChange({ file: null, removed: false })}
              >
                <Undo2 className="h-3.5 w-3.5" />
                Undo
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500">JPG, PNG or WebP, up to 2MB.</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          aria-label="Choose profile photo"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
