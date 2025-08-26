
// functions/src/lib/cj-url.ts

interface BuildCjDeepLinkArgs {
  pid: string;
  linkId: string;
  destinationUrl: string;
  sid?: string;
  domain?: string;
}

export function buildCjDeepLink({
  pid,
  linkId,
  destinationUrl,
  sid,
  domain = "https://www.anrdoezrs.net"
}: BuildCjDeepLinkArgs): string {
  if (!pid || !linkId || !destinationUrl) {
    console.error("Missing required parameters for CJ deep link generation.");
    // Return the original URL as a fallback, though it won't be tracked.
    return destinationUrl;
  }
  
  const encodedUrl = encodeURIComponent(destinationUrl);
  const base = `${domain}/click-${pid}-${linkId}?url=${encodedUrl}`;
  
  return sid ? `${base}&sid=${encodeURIComponent(sid)}` : base;
}
