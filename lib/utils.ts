export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}
