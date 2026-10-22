export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ProfileChange {
  file: File | null;
  removeProfile: boolean;
}

export function buildFormData(
  values: object,
  profile?: ProfileChange,
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value === "" || value === undefined || value === null) continue;
    formData.append(key, String(value));
  }

  if (profile?.file) formData.append("file", profile.file);
  else if (profile?.removeProfile) formData.append("removeProfile", "true");

  return formData;
}

export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    return "Use a JPG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 2MB or smaller.";
  return null;
}
