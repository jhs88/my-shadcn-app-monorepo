// Docs: https://supabase.com/docs/guides/storage/image-transformations#nextjs-loader
export default function supabaseLoader({ src, width, quality }) {
  const url = new URL(
    `https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/${src}`,
  );
  url.searchParams.set("width", String(width));
  url.searchParams.set("quality", String(quality ?? 75));
  return url.href;
}
