const V='weekly-budget-v26';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Network first so updates show right away; the saved copy is only used when offline.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===self.location.origin;
  e.respondWith(
    fetch(same?e.request.url:e.request,same?{cache:'no-cache'}:undefined)
      .then(r=>{if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(V).then(c=>c.put(e.request,copy)).catch(()=>{})}return r})
      .catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html')))
  );
});
