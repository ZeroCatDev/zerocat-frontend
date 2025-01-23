import{_ as V,J as y,o as d,c,w as a,a as t,N as n,O as l,a8 as b,L as o,R as g,aa as _,X as x,W as i,e as C,U as j,T as P,Q as v,a0 as L,a1 as S,a2 as k,$ as w,S as I,M as B,Y as T,Z as N}from"./index-Qi9VjfBV.js";import{_ as z}from"./43-lazyload-CBkwrR6M.js";import{a as u,V as h}from"./VRow-DRlg5WzI.js";import{V as f}from"./VSelect-Cn1Kx352.js";import{V as D}from"./VChip-CDSrfsSa.js";import{V as M}from"./VContainer-Cbfw6pTU.js";/* empty css              */import"./VCheckboxBtn-CAGiBwNR.js";import"./VSelectionControl-BFBQ0sPb.js";const U={data(){return{orderitems:[{name:"热门的",type:"trending"},{name:"最受欢迎的",type:"popular"},{name:"新建的",type:"recent"}],tagitems:[{name:"全部",type:"*"},{name:"动画",type:"animations"},{name:"艺术",type:"art"},{name:"游戏",type:"games"},{name:"音乐",type:"music"},{name:"故事",type:"stories"},{name:"教程",type:"tutorials"}],search:{order:"trending",tag:"*",limit:18},usetime:0,ProjectsLoading:!1,projects:[],projectscount:0,curPage:1,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getprojects()},methods:{async getprojects(){this.onPageChange(1)},async onPageChange(m,e){e==!0&&(this.projects=[]),this.usetime=Date.now(),this.ProjectsLoading=!0,this.projects=this.projects.concat(await y({url:this.scratch_proxy+`/projects/explore/projects?mode=${this.search.order}&q=${this.search.tag}&offset=${m*16-16}&limit=${this.search.limit}&language=zh-cn`,method:"get"})),this.curPage=m,this.ProjectsLoading=!1,this.usetime=Date.now()-this.usetime}}},R={class:"mb-2"};function Z(m,e,q,A,r,p){return d(),c(M,null,{default:a(()=>[t(g,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:a(()=>[t(n,{href:"https://scratch.mit.edu/explore/projects/all"},{default:a(()=>e[5]||(e[5]=[l("Scratch上的发现页")])),_:1}),t(n,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:a(()=>e[6]||(e[6]=[l("Scratch使用条款")])),_:1})]),default:a(()=>[t(b,{class:"bg-surface-light pt-4"},{default:a(()=>e[4]||(e[4]=[l(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),l("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),l("查看协议全文。 ")])),_:1})]),_:1}),e[9]||(e[9]=o("br",null,null,-1)),t(h,null,{default:a(()=>[t(u,{cols:"3"},{default:a(()=>[t(f,{modelValue:r.search.order,"onUpdate:modelValue":e[0]||(e[0]=s=>r.search.order=s),items:r.orderitems,"item-title":"name","item-value":"type",label:"排序 为："+r.search.order},null,8,["modelValue","items","label"])]),_:1}),t(u,{cols:"3"},{default:a(()=>[t(f,{modelValue:r.search.tag,"onUpdate:modelValue":e[1]||(e[1]=s=>r.search.tag=s),items:r.tagitems,"item-title":"name","item-value":"type",label:"标签 为："+r.search.tag},null,8,["modelValue","items","label"])]),_:1}),t(u,{cols:"3"},{default:a(()=>[t(n,{onClick:e[2]||(e[2]=s=>p.onPageChange(1,!0))},{default:a(()=>e[7]||(e[7]=[l(" 加载 ")])),_:1})]),_:1})]),_:1}),e[10]||(e[10]=o("br",null,null,-1)),e[11]||(e[11]=o("br",null,null,-1)),t(_,{active:r.ProjectsLoading,height:"4",indeterminate:""},null,8,["active"]),o("div",R,[t(D,null,{default:a(()=>[t(x,{icon:"mdi-clock",start:""}),l("本页加载用时"+i(Math.abs(r.usetime/1e3))+"秒 ",1)]),_:1})]),t(h,null,{default:a(()=>[(d(!0),C(P,null,j(r.projects,s=>(d(),c(u,{cols:" 12",md:"3",key:s},{default:a(()=>[t(g,{to:"/app/proxy/"+s.id},{default:a(()=>[t(v,{src:`${r.scratch_proxy}/thumbnails/${s.id}`,cover:"","lazy-src":z},null,8,["src"]),t(L,null,{default:a(()=>[t(S,null,{default:a(()=>[l(i(s.title),1)]),_:2},1024),t(k,null,{default:a(()=>[l(i(s.description||"简介未找到"),1)]),_:2},1024)]),_:2},1024),t(w,null,{default:a(()=>[t(I,null,{prepend:a(()=>[t(B,{image:`${this.scratch_proxy}/avatars/${s.author.id}`},null,8,["image"])]),default:a(()=>[t(T,null,{default:a(()=>[l(i(s.author.username),1)]),_:2},1024),t(N,null,{default:a(()=>[l(i(s.author.id),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[12]||(e[12]=o("br",null,null,-1)),t(n,{onClick:e[3]||(e[3]=s=>p.onPageChange(r.curPage+1,!1))},{default:a(()=>e[8]||(e[8]=[l("继续加载")])),_:1})]),_:1})}const H=V(U,[["render",Z]]);export{H as default};
