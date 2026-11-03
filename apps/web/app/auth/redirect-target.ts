export function getRedirectTarget(
  next: string | null,
  requestUrl: string,
): URL {
  const fallback = new URL("/", requestUrl);
  if (!next || next.trim() !== next) return fallback;

  try {
    const decoded = decodeURIComponent(next);
    const decodedPath = decodeURIComponent(next.split(/[?#]/, 1)[0] ?? "");
    if (
      decodedPath.startsWith("//") ||
      /^[a-z][a-z\d+.-]*:/i.test(decodedPath) ||
      decodedPath.includes("\\") ||
      [...decoded].some((character) => {
        const code = character.charCodeAt(0);
        return code < 0x20 || code === 0x7f;
      })
    ) {
      return fallback;
    }

    const destination = new URL(next, requestUrl);
    if (
      destination.origin !== fallback.origin ||
      destination.pathname.startsWith("//")
    ) {
      return fallback;
    }
    return destination;
  } catch {
    // Invalid percent escapes or URL syntax are not redirect destinations.
    return fallback;
  }
}
