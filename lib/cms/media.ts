export const MEDIA_BUCKET = "portfolio-media";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Images must be 5MB or smaller.";
  }
  return null;
}

export function mediaFolder(kind: "gallery" | "projects" | "profile" | "social") {
  return kind;
}

export function storageObjectPath(kind: "gallery" | "projects" | "profile" | "social", file: File) {
  const ext = EXTENSIONS[file.type] || "jpg";
  return `${mediaFolder(kind)}/${crypto.randomUUID()}.${ext}`;
}
