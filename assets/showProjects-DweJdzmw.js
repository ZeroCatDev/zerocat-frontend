import{a as f}from"./project-7MLv3q61.js";import{a as y}from"./user-DL5oupWM.js";import{_ as g}from"./43-lazyload-CBkwrR6M.js";import{_ as V,o as r,c as n,w as t,e as i,R as h,S as m,a as s,P as p,O as I,a2 as C,a3 as k,L as c,T as l,a4 as x,a6 as A,M as w,a5 as j}from"./index-Bxp1Qw7I.js";import{a as P,V as b}from"./VRow-CvoeiI8T.js";const B={props:{projectIds:{type:Array,required:!0},actions:{type:Array}},data(){return{projects:[],authorIds:[],authors:{}}},watch:{projectIds:{handler(){this.fetchProjects()},immediate:!0,deep:!0}},methods:{async fetchProjects(){const a=await f(this.projectIds);this.projects=a.map(o=>({...o,author:{display_name:"加载中..."}})),this.updateAuthorIds()},updateAuthorIds(){this.authorIds=[...new Set(this.projects.map(a=>a.authorid))],this.fetchAuthors()},async fetchAuthors(){const a=await y(this.authorIds),o={};a.forEach(u=>{o[u.id]=u}),this.authors=o,this.updateProjectAuthors()},updateProjectAuthors(){this.projects=this.projects.map(a=>({...a,author:this.authors[a.authorid]||{display_name:"未知用户"}}))}}};function S(a,o,u,$,_,v){return r(),n(b,null,{default:t(()=>[(r(!0),i(h,null,m(_.projects,e=>(r(),n(P,{key:e.id,cols:"12",xs:"12",sm:"6",md:"4",lg:"3",xl:"2",xxl:"2"},{default:t(()=>[s(p,{rounded:"lg",border:""},{default:t(()=>[s(p,{to:`/${e.author.username}/${e.name}`,style:{"aspect-ratio":"4/3"},rounded:"lg"},{default:t(()=>[s(I,{src:"https://s4-1.wuyuan.1r.ink/scratch_slt/"+e.id,class:"align-end","lazy-src":g,height:"100%",gradient:"to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)",cover:""},{default:t(()=>[s(C,null,{default:t(()=>[s(k,null,{default:t(()=>[c(l(e.title||"未缓存"),1)]),_:2},1024),s(x,null,{default:t(()=>[c(l(e.description||""),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["src"])]),_:2},1032,["to"]),u.actions?(r(),n(A,{key:0},{default:t(()=>[(r(!0),i(h,null,m(u.actions,d=>(r(),i("div",{key:d.name},[s(w,{onClick:N=>d.function(e.id,e)},{default:t(()=>[c(l(d.name),1)]),_:2},1032,["onClick"])]))),128))]),_:2},1024)):j("",!0)]),_:2},1024)]),_:2},1024))),128))]),_:1})}const q=V(B,[["render",S]]);export{q as _};
