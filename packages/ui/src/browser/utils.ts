// Helper to get favicon URL from domain
export function getFaviconUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    return `${urlObj.protocol}//${domain}/favicon.ico`;
  } catch {
    return null;
  }
}

// Helper to extract a readable title from URL
export function extractTitleFromUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop();
    if (filename && filename !== "" && filename.includes(".")) {
      return filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    const domain = urlObj.hostname.replace("www.", "");
    const domainParts = domain.split(".");
    if (domainParts.length > 0 && domainParts[0]) {
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }
    return "";
  } catch {
    return "";
  }
}
