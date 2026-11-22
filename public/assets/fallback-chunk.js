// Auto-reload fallback for stale/missing dynamic chunks
if (typeof window !== 'undefined') {
  console.warn('[Chunk Fallback] Missing chunk requested. Reloading to get latest version...');
  const lastReload = parseInt(sessionStorage.getItem('chunk_fallback_reload') || '0', 10);
  const now = Date.now();
  if (now - lastReload > 10000) {
    sessionStorage.setItem('chunk_fallback_reload', now.toString());
    window.location.reload();
  }
}
