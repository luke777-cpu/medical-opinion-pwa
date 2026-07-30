const CACHE="medical-opinion-v1.2";
const LOCAL=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 // 앱 화면(HTML)은 네트워크 우선: 배포 후 구버전 고착 방지, 오프라인이면 캐시로 대체
 if(e.request.mode==="navigate"){
  e.respondWith(fetch(e.request).then(r=>{
   const copy=r.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));
   return r;
  }).catch(()=>caches.match("./index.html")));
  return;
 }
 // 나머지 정적 자원은 캐시 우선
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
  if(r.ok&&new URL(e.request.url).origin===self.location.origin){
   const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
  }
  return r;
 }).catch(()=>Response.error())));
});
