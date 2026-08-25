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

export type MediaKind = "gallery" | "projects" | "product" | "profile" | "social";

export function mediaFolder(kind: MediaKind) {
  return kind;
}

export function storageObjectPath(kind: MediaKind, file: File) {
  const ext = EXTENSIONS[file.type] || "jpg";
  return `${mediaFolder(kind)}/${crypto.randomUUID()}.${ext}`;
}

/** Resolve a portfolio-media storage object path from a public URL. Only returns `profile/` paths. */
export function profileStoragePathFromUrl(url: string): string | null {
  const value = url.trim();
  if (!value) return null;

  const publicMarker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const markerIndex = value.indexOf(publicMarker);
  let path = "";

  if (markerIndex !== -1) {
    path = decodeURIComponent(value.slice(markerIndex + publicMarker.length).split(/[?#]/)[0] || "");
  } else if (value.startsWith("profile/")) {
    path = value.split(/[?#]/)[0] || "";
  } else {
    return null;
  }

  if (!path.startsWith("profile/") || path.includes("..") || path.includes("//")) {
    return null;
  }

  return path;
}
