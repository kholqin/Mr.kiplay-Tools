import { isIP } from "node:net";

type CacheEntry = { expiresAt: number; value: unknown };
const MAX_ENTRIES = 256;
const cache = new Map<string, CacheEntry>();

export const DEFAULT_RESOLVER = "system";

export function validateResolver(value?: string) {
  const resolver = (value ?? DEFAULT_RESOLVER).trim();
  if (resolver === DEFAULT_RESOLVER) return resolver;
  if (!isIP(resolver)) throw new Error("Resolver harus berupa alamat IPv4/IPv6 publik atau 'system'");
  if (/^(10\.|127\.|169\.254\.|192\.168\.)/.test(resolver) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(resolver) || resolver === "::1" || resolver.toLowerCase().startsWith("fc") || resolver.toLowerCase().startsWith("fe80:")) throw new Error("Resolver privat, loopback, atau link-local tidak diizinkan");
  return resolver;
}

export function getCached<T>(key: string) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) { cache.delete(key); return undefined; }
  return entry.value as T;
}

export function setCached(key: string, value: unknown, ttlSeconds = 60) {
  const ttl = Math.min(Math.max(ttlSeconds, 5), 3600);
  if (cache.size >= MAX_ENTRIES && !cache.has(key)) cache.delete(cache.keys().next().value as string);
  cache.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
}

export function clearReconCache() { cache.clear(); }
export function getReconCacheStats() { return { entries: cache.size, maxEntries: MAX_ENTRIES }; }
