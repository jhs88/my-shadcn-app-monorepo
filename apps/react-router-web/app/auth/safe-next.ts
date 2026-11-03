/**
 * Keep callback redirects on root-relative app paths, without URL normalization
 * tricks.
 */
export function safeNext(next: string | null): string {
  if (
    !next?.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\") ||
    [...next].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) {
    return "/";
  }

  return next;
}
