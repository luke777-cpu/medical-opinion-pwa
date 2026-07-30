const CACHE="medical-opinion-v1.1";
const LOCAL=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
  if(r.ok&&new URL(e.request.url).origin===self.location.origin){
   const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
  }
  return r;
 }).catch(()=>e.request.mode==="navigate"?caches.match("./index.html"):Response.error())));
});
