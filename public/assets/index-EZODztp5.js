// Graceful compatibility fallback for clients with stale cached index.html
console.warn("Köhnə keşlənmiş versiya aşkarlandı. Səhifə avtomatik yenilənir...");
if (!sessionStorage.getItem("stale_bundle_refresh")) {
  sessionStorage.setItem("stale_bundle_refresh", "1");
  window.location.reload();
}
