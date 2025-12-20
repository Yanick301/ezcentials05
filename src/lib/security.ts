/**
 * Security utilities for client-side operations
 */

/**
 * Safely decode base64 string in browser environment
 * Replaces Buffer.from() which is not available in browsers
 */
export function decodeBase64(encoded: string): string {
  try {
    if (typeof window === 'undefined') {
      throw new Error('decodeBase64 can only be used in browser environment');
    }
    // Use atob for browser environment
    return atob(encoded);
  } catch (error) {
    throw new Error(`Failed to decode base64 string: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return defaultValue;
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely get item from localStorage
 */
export function safeGetLocalStorage(key: string, defaultValue: string = ''): string {
  if (!isLocalStorageAvailable()) return defaultValue;
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (error) {
    console.error(`Failed to get localStorage item ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set localStorage item ${key}:`, error);
    return false;
  }
}

/**
 * Validate order ID format
 * Accepts both UUID format (from Supabase) and legacy local_ format
 */
export function isValidOrderId(orderId: string | null): boolean {
  if (!orderId) return false;
  // UUID format (from Supabase): 8-4-4-4-12 hexadecimal characters
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Legacy local_ format for backward compatibility
  const localRegex = /^local_\d+_[a-z0-9]+$/;
  return uuidRegex.test(orderId) || localRegex.test(orderId);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate and sanitize review comment
 */
export function sanitizeReviewComment(comment: string): string {
  if (!comment) return '';
  // Remove potentially dangerous characters and limit length
  return comment
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 2000) // Limit length
    .trim();
}

/**
 * Validate orderId to prevent injection attacks
 */
export function validateOrderId(orderId: string | null | undefined): boolean {
  if (!orderId) return false;
  // Only allow alphanumeric, underscores, hyphens, and the 'local_' prefix
  return /^local_\d+_[a-z0-9]+$/.test(orderId) && orderId.length <= 100;
}

/**
 * Escape HTML entities for safe email content
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

