import{_ as i,c as l,o as s,w as t,a as r,a1 as d,e as u,M as p,N as f,L as h,a2 as _,H as o,O as n,a3 as m,Q as w}from"./index-DhXuRan5.js";import{V as g}from"./VContainer-CPEWPjzm.js";/* empty css              */const x={data(){return{news:[],loading:!1,scratch_proxy:"https://scratch.192325.xyz"}},methods:{async fetchNews(){this.loading=!0;try{const a=await w.get(this.scratch_proxy+"/news");this.news=a.data}catch(a){console.log(a)}finally{this.loading=!1}}},mounted(){this.fetchNews()}};function y(a,V,L,k,c,N){return s(),l(g,null,{default:t(()=>[r(d,null,{default:t(()=>[(s(!0),u(p,null,f(c.news,e=>(s(),l(h,{key:e.id,href:e.url,target:"_blank","prepend-avatar":e.image},{default:t(()=>[r(_,null,{default:t(()=>[o(n(e.headline),1)]),_:2},1024),r(m,null,{default:t(()=>[o(n(e.copy)+" - "+n(e.stamp),1)]),_:2},1024)]),_:2},1032,["href","prepend-avatar"]))),128))]),_:1})]),_:1})}const b=i(x,[["render",y]]);export{b as default};
