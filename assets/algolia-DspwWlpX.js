var ee=Object.defineProperty;var te=(t,e,r)=>e in t?ee(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var S=(t,e,r)=>te(t,typeof e!="symbol"?e+"":e,r);import{_ as re,G as ae,r as C,o as V,c as H,w as p,a as g,a0 as ne,Y as se,e as oe,U as ie,T as le,L as ce,O as $,Q as I,N as ue,a1 as de,R as me,ah as fe,af as he,W as U,ag as ge}from"./index-ClYup7uH.js";import{_ as pe}from"./43-lazyload-CBkwrR6M.js";import{V as B,a as F}from"./VRow-DmykgyR8.js";import{V as ye}from"./VPagination-B831KQwe.js";import{V as _e}from"./VContainer-DWnX6OiG.js";/* empty css              */function Pe(){function t(e){return new Promise(r=>{let a=new XMLHttpRequest;a.open(e.method,e.url,!0),Object.keys(e.headers).forEach(s=>a.setRequestHeader(s,e.headers[s]));let n=(s,o)=>setTimeout(()=>{a.abort(),r({status:0,content:o,isTimedOut:!0})},s),c=n(e.connectTimeout,"Connection timeout"),i;a.onreadystatechange=()=>{a.readyState>a.OPENED&&i===void 0&&(clearTimeout(c),i=n(e.responseTimeout,"Socket timeout"))},a.onerror=()=>{a.status===0&&(clearTimeout(c),clearTimeout(i),r({content:a.responseText||"Network request failed",status:a.status,isTimedOut:!1}))},a.onload=()=>{clearTimeout(c),clearTimeout(i),r({content:a.responseText,status:a.status,isTimedOut:!1})},a.send(e.data)})}return{send:t}}function be(t){let e;const r=`algolia-client-js-${t.key}`;function a(){return e===void 0&&(e=t.localStorage||window.localStorage),e}function n(){return JSON.parse(a().getItem(r)||"{}")}function c(s){a().setItem(r,JSON.stringify(s))}function i(){const s=t.timeToLive?t.timeToLive*1e3:null,o=n(),f=Object.fromEntries(Object.entries(o).filter(([,m])=>m.timestamp!==void 0));if(c(f),!s)return;const d=Object.fromEntries(Object.entries(f).filter(([,m])=>{const _=new Date().getTime();return!(m.timestamp+s<_)}));c(d)}return{get(s,o,f={miss:()=>Promise.resolve()}){return Promise.resolve().then(()=>(i(),n()[JSON.stringify(s)])).then(d=>Promise.all([d?d.value:o(),d!==void 0])).then(([d,m])=>Promise.all([d,m||f.miss(d)])).then(([d])=>d)},set(s,o){return Promise.resolve().then(()=>{const f=n();return f[JSON.stringify(s)]={timestamp:new Date().getTime(),value:o},a().setItem(r,JSON.stringify(f)),o})},delete(s){return Promise.resolve().then(()=>{const o=n();delete o[JSON.stringify(s)],a().setItem(r,JSON.stringify(o))})},clear(){return Promise.resolve().then(()=>{a().removeItem(r)})}}}function we(){return{get(t,e,r={miss:()=>Promise.resolve()}){return e().then(n=>Promise.all([n,r.miss(n)])).then(([n])=>n)},set(t,e){return Promise.resolve(e)},delete(t){return Promise.resolve()},clear(){return Promise.resolve()}}}function E(t){const e=[...t.caches],r=e.shift();return r===void 0?we():{get(a,n,c={miss:()=>Promise.resolve()}){return r.get(a,n,c).catch(()=>E({caches:e}).get(a,n,c))},set(a,n){return r.set(a,n).catch(()=>E({caches:e}).set(a,n))},delete(a){return r.delete(a).catch(()=>E({caches:e}).delete(a))},clear(){return r.clear().catch(()=>E({caches:e}).clear())}}}function j(t={serializable:!0}){let e={};return{get(r,a,n={miss:()=>Promise.resolve()}){const c=JSON.stringify(r);if(c in e)return Promise.resolve(t.serializable?JSON.parse(e[c]):e[c]);const i=a();return i.then(s=>n.miss(s)).then(()=>i)},set(r,a){return e[JSON.stringify(r)]=t.serializable?JSON.stringify(a):a,Promise.resolve(a)},delete(r){return delete e[JSON.stringify(r)],Promise.resolve()},clear(){return e={},Promise.resolve()}}}function ve(t){const e={value:`Algolia for JavaScript (${t})`,add(r){const a=`; ${r.segment}${r.version!==void 0?` (${r.version})`:""}`;return e.value.indexOf(a)===-1&&(e.value=`${e.value}${a}`),e}};return e}function Te(t,e,r="WithinHeaders"){const a={"x-algolia-api-key":e,"x-algolia-application-id":t};return{headers(){return r==="WithinHeaders"?a:{}},queryParameters(){return r==="WithinQueryParameters"?a:{}}}}function Se({algoliaAgents:t,client:e,version:r}){const a=ve(r).add({segment:e,version:r});return t.forEach(n=>a.add(n)),a}function xe(){return{debug(t,e){return Promise.resolve()},info(t,e){return Promise.resolve()},error(t,e){return Promise.resolve()}}}var G=2*60*1e3;function Q(t,e="up"){const r=Date.now();function a(){return e==="up"||Date.now()-r>G}function n(){return e==="timed out"&&Date.now()-r<=G}return{...t,status:e,lastUpdate:r,isUp:a,isTimedOut:n}}var K=class extends Error{constructor(e,r){super(e);S(this,"name","AlgoliaError");r&&(this.name=r)}},X=class extends K{constructor(e,r,a){super(e,a);S(this,"stackTrace");this.stackTrace=r}},Ae=class extends X{constructor(t){super("Unreachable hosts - your application id may be incorrect. If the error persists, please reach out to the Algolia Support team: https://alg.li/support.",t,"RetryError")}},R=class extends X{constructor(e,r,a,n="ApiError"){super(e,a,n);S(this,"status");this.status=r}},Ee=class extends K{constructor(e,r){super(e,"DeserializationError");S(this,"response");this.response=r}},Ne=class extends R{constructor(e,r,a,n){super(e,r,n,"DetailedApiError");S(this,"error");this.error=a}};function Ce(t){const e=t;for(let r=t.length-1;r>0;r--){const a=Math.floor(Math.random()*(r+1)),n=t[r];e[r]=t[a],e[a]=n}return e}function ke(t,e,r){const a=Oe(r);let n=`${t.protocol}://${t.url}${t.port?`:${t.port}`:""}/${e.charAt(0)==="/"?e.substring(1):e}`;return a.length&&(n+=`?${a}`),n}function Oe(t){return Object.keys(t).filter(e=>t[e]!==void 0).sort().map(e=>`${e}=${encodeURIComponent(Object.prototype.toString.call(t[e])==="[object Array]"?t[e].join(","):t[e]).replace(/\+/g,"%20")}`).join("&")}function qe(t,e){if(t.method==="GET"||t.data===void 0&&e.data===void 0)return;const r=Array.isArray(t.data)?t.data:{...t.data,...e.data};return JSON.stringify(r)}function Ve(t,e,r){const a={Accept:"application/json",...t,...e,...r},n={};return Object.keys(a).forEach(c=>{const i=a[c];n[c.toLowerCase()]=i}),n}function $e(t){try{return JSON.parse(t.content)}catch(e){throw new Ee(e.message,t)}}function je({content:t,status:e},r){try{const a=JSON.parse(t);return"error"in a?new Ne(a.message,e,a.error,r):new R(a.message,e,r)}catch{}return new R(t,e,r)}function Re({isTimedOut:t,status:e}){return!t&&~~e===0}function Je({isTimedOut:t,status:e}){return t||Re({isTimedOut:t,status:e})||~~(e/100)!==2&&~~(e/100)!==4}function Le({status:t}){return~~(t/100)===2}function ze(t){return t.map(e=>Y(e))}function Y(t){const e=t.request.headers["x-algolia-api-key"]?{"x-algolia-api-key":"*****"}:{};return{...t,request:{...t.request,headers:{...t.request.headers,...e}}}}function De({hosts:t,hostsCache:e,baseHeaders:r,logger:a,baseQueryParameters:n,algoliaAgent:c,timeouts:i,requester:s,requestsCache:o,responsesCache:f}){async function d(l){const u=await Promise.all(l.map(h=>e.get(h,()=>Promise.resolve(Q(h))))),P=u.filter(h=>h.isUp()),b=u.filter(h=>h.isTimedOut()),x=[...P,...b];return{hosts:x.length>0?x:l,getTimeout(h,v){return(b.length===0&&h===0?1:b.length+3+h)*v}}}async function m(l,u,P=!0){const b=[],x=qe(l,u),w=Ve(r,l.headers,u.headers),h=l.method==="GET"?{...l.data,...u.data}:{},v={...n,...l.queryParameters,...h};if(c.value&&(v["x-algolia-agent"]=c.value),u&&u.queryParameters)for(const y of Object.keys(u.queryParameters))!u.queryParameters[y]||Object.prototype.toString.call(u.queryParameters[y])==="[object Object]"?v[y]=u.queryParameters[y]:v[y]=u.queryParameters[y].toString();let N=0;const J=async(y,k)=>{const A=y.pop();if(A===void 0)throw new Ae(ze(b));const O={...i,...u.timeouts},z={data:x,headers:w,method:l.method,url:ke(A,l.path,v),connectTimeout:k(N,O.connect),responseTimeout:k(N,P?O.read:O.write)},D=q=>{const W={request:z,response:q,host:A,triesLeft:y.length};return b.push(W),W},T=await s.send(z);if(Je(T)){const q=D(T);return T.isTimedOut&&N++,a.info("Retryable failure",Y(q)),await e.set(A,Q(A,T.isTimedOut?"timed out":"down")),J(y,k)}if(Le(T))return $e(T);throw D(T),je(T,b)},Z=t.filter(y=>y.accept==="readWrite"||(P?y.accept==="read":y.accept==="write")),L=await d(Z);return J([...L.hosts].reverse(),L.getTimeout)}function _(l,u={}){const P=l.useReadTransporter||l.method==="GET";if(!P)return m(l,u,P);const b=()=>m(l,u);if((u.cacheable||l.cacheable)!==!0)return b();const w={request:l,requestOptions:u,transporter:{queryParameters:n,headers:r}};return f.get(w,()=>o.get(w,()=>o.set(w,b()).then(h=>Promise.all([o.delete(w),h]),h=>Promise.all([o.delete(w),Promise.reject(h)])).then(([h,v])=>v)),{miss:h=>f.set(w,h)})}return{hostsCache:e,requester:s,timeouts:i,logger:a,algoliaAgent:c,baseHeaders:r,baseQueryParameters:n,hosts:t,request:_,requestsCache:o,responsesCache:f}}var M="5.19.0";function We(t){return[{url:`${t}-dsn.algolia.net`,accept:"read",protocol:"https"},{url:`${t}.algolia.net`,accept:"write",protocol:"https"}].concat(Ce([{url:`${t}-1.algolianet.com`,accept:"readWrite",protocol:"https"},{url:`${t}-2.algolianet.com`,accept:"readWrite",protocol:"https"},{url:`${t}-3.algolianet.com`,accept:"readWrite",protocol:"https"}]))}function He({appId:t,apiKey:e,authMode:r,algoliaAgents:a,...n}){const c=Te(t,e,r),i=De({hosts:We(t),...n,algoliaAgent:Se({algoliaAgents:a,client:"Lite",version:M}),baseHeaders:{"content-type":"text/plain",...c.headers(),...n.baseHeaders},baseQueryParameters:{...c.queryParameters(),...n.baseQueryParameters}});return{transporter:i,appId:t,apiKey:e,clearCache(){return Promise.all([i.requestsCache.clear(),i.responsesCache.clear()]).then(()=>{})},get _ua(){return i.algoliaAgent.value},addAlgoliaAgent(s,o){i.algoliaAgent.add({segment:s,version:o})},setClientApiKey({apiKey:s}){!r||r==="WithinHeaders"?i.baseHeaders["x-algolia-api-key"]=s:i.baseQueryParameters["x-algolia-api-key"]=s},searchForHits(s,o){return this.search(s,o)},searchForFacets(s,o){return this.search(s,o)},customPost({path:s,parameters:o,body:f},d){if(!s)throw new Error("Parameter `path` is required when calling `customPost`.");const u={method:"POST",path:"/{path}".replace("{path}",s),queryParameters:o||{},headers:{},data:f||{}};return i.request(u,d)},getRecommendations(s,o){if(s&&Array.isArray(s)&&(s={requests:s}),!s)throw new Error("Parameter `getRecommendationsParams` is required when calling `getRecommendations`.");if(!s.requests)throw new Error("Parameter `getRecommendationsParams.requests` is required when calling `getRecommendations`.");const _={method:"POST",path:"/1/indexes/*/recommendations",queryParameters:{},headers:{},data:s,useReadTransporter:!0,cacheable:!0};return i.request(_,o)},search(s,o){if(s&&Array.isArray(s)&&(s={requests:s.map(({params:u,...P})=>P.type==="facet"?{...P,...u,type:"facet"}:{...P,...u,facet:void 0,maxFacetHits:void 0,facetQuery:void 0})}),!s)throw new Error("Parameter `searchMethodParams` is required when calling `search`.");if(!s.requests)throw new Error("Parameter `searchMethodParams.requests` is required when calling `search`.");const _={method:"POST",path:"/1/indexes/*/queries",queryParameters:{},headers:{},data:s,useReadTransporter:!0,cacheable:!0};return i.request(_,o)}}}function Ie(t,e,r){return He({appId:t,apiKey:e,timeouts:{connect:1e3,read:2e3,write:3e4},logger:xe(),requester:Pe(),algoliaAgents:[{segment:"Browser"}],authMode:"WithinQueryParameters",responsesCache:j(),requestsCache:j({serializable:!1}),hostsCache:E({caches:[be({key:`${M}-${t}`}),j()]}),...r})}const Ue="/assets/Algolia-logo-blue-BPCoiGTx.svg",Be={setup(){ae({title:"Algolia Search"})},data(){return{algolia_index_name:"zerocat",algolia_app_id:"EC82GCN8JL",algolia_api_key:"bb7a110561bf44209973e461d82987b9",searchClient:Ie("EC82GCN8JL","bb7a110561bf44209973e461d82987b9")}}};function Fe(t,e,r,a,n,c){const i=C("ais-search-box"),s=C("ais-hits"),o=C("ais-pagination"),f=C("ais-instant-search");return n.algolia_app_id&&n.algolia_api_key&&n.algolia_index_name?(V(),H(_e,{key:0},{default:p(()=>[g(f,{"search-client":n.searchClient,"index-name":n.algolia_index_name},{default:p(()=>[g(i,null,{default:p(({isSearchStalled:d,refine:m})=>[g(ne,{clearable:"",label:"键入以搜索",variant:"solo-filled",onInput:_=>m(_.target.value)},{loader:p(()=>[g(se,{active:d,indeterminate:""},null,8,["active"])]),_:2},1032,["onInput"])]),_:1}),g(s,null,{default:p(({items:d})=>[g(B,null,{default:p(()=>[(V(!0),oe(le,null,ie(d,m=>(V(),H(F,{cols:"12",xs:"12",sm:"6",md:"4",lg:"3",xl:"2",xxl:"2",key:m.objectID},{default:p(()=>[g(me,{to:"/projects/"+m.id,style:{"aspect-ratio":"4/3"},rounded:"lg"},{default:p(()=>[g(I,{src:"https://s4-1.wuyuan.1r.ink/scratch_slt/"+m.id,class:"align-end","lazy-src":pe,height:"100%",gradient:"to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)",cover:""},{default:p(()=>[g(fe,null,{default:p(()=>[g(he,null,{default:p(()=>[$(U(m.title),1)]),_:2},1024),g(ge,null,{default:p(()=>[$(U(m.description),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["src"])]),_:2},1032,["to"])]),_:2},1024))),128))]),_:2},1024)]),_:1}),g(B,null,{default:p(()=>[g(F,null,{default:p(()=>[g(o,null,{default:p(({currentRefinement:d,nbPages:m,refine:_})=>[g(ye,{length:m,rounded:"circle","v-model":d,"onUpdate:modelValue":l=>_(l),onInput:l=>_(l)},null,8,["length","v-model","onUpdate:modelValue","onInput"])]),_:1})]),_:1})]),_:1})]),_:1},8,["search-client","index-name"]),e[0]||(e[0]=ce("br",null,null,-1)),e[1]||(e[1]=$("Search by ")),g(ue,{variant:"text",href:"https://algolia.com/",target:"_blank",rel:"noopener noreferrer"},{default:p(()=>[g(I,{src:Ue,height:"1.5rem",width:"5rem"})]),_:1})]),_:1})):de("",!0)}const et=re(Be,[["render",Fe]]);export{et as default};