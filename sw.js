const CACHE_NAME='dr-smoothie-v3';
const PRECACHE=['/'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Never cache API calls or YouTube
  if(url.hostname.includes('anthropic.com')||url.hostname.includes('supabase')||url.hostname.includes('youtube')||url.hostname.includes('workers.dev'))return;
  // Cache-first for fonts
  if(url.hostname.includes('googleapis.com')||url.hostname.includes('gstatic.com')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));return res;
    })));return;
  }
  // Network-first for navigation
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{
      const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));return res;
    }).catch(()=>caches.match('/index.html')));return;
  }
  // Cache-first for everything else
  e.respondWith(caches.match(e.request).then(r=>{
    if(r)return r;
    return fetch(e.request).then(res=>{
      if(res.ok&&e.request.method==='GET'){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));}
      return res;
    }).catch(()=>{
      if(e.request.headers.get('accept')?.includes('text/html'))return caches.match('/index.html');
      return new Response('Offline',{status:503});
    });
  }));
});
