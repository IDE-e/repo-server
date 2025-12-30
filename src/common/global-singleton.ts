export function getGlobalSingleton<T>(key: string, init: () => T): T {
  const g = globalThis as unknown as Record<string, any>;
  if (!g[key]) g[key] = init();
  return g[key] as T;
}
