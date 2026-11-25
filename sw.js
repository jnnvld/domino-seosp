// Placar Oficial Dominó SEOSP — funciona sem internet.
const V="seosp-v22";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png",
 "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js",
 "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js",
 "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  // Banco (Firestore/Auth) nunca passa pelo cache do app: o próprio Firebase guarda os dados offline.
  if(u.hostname.includes("firestore.googleapis.com")||u.hostname.includes("identitytoolkit")||u.hostname.includes("securetoken")||u.pathname.includes("/__/auth/"))return;
  if(r.mode==="navigate"||u.pathname.endsWith("/index.html")||u.pathname.endsWith("/")){
    // Página: tenta a versão nova; sem internet, usa a guardada.
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put("./index.html",c));return res;}).catch(()=>caches.match("./index.html")));return;}
  if(u.hostname==="www.gstatic.com"||u.hostname.includes("fonts.g")||u.origin===location.origin){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(V).then(x=>x.put(r,c));}return res;})));}
});
