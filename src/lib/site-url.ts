/**
 * Get the site URL, preferring NEXT_PUBLIC_SITE_URL environment variable
 * Falls back to window.location.origin in the browser
 * 
 * @returns The site URL (e.g., https://ezcentials.com or http://localhost:9002)
 */
export function getSiteUrl(): string {
  // In server-side context, use environment variable
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://ezcentials.com';
  }
  
  // In client-side context, prefer environment variable, fallback to window.location.origin
  return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
}




















