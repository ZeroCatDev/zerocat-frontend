import{_ as V,J as y,o as d,c,w as s,a as t,M as n,L as l,a7 as b,K as o,P as g,a9 as _,W as x,T as i,e as C,S as j,R as P,O as v,$ as L,a0 as S,a1 as k,Z as w,Q as I,U as B,X as T,Y as z}from"./index-CKXrJDOz.js";import{_ as D}from"./43-lazyload-CBkwrR6M.js";import{a as u,V as h}from"./VRow-BM72lIds.js";import{V as f}from"./VSelect-CiNHHwEs.js";import{V as M}from"./VChip-C5rSDCkt.js";import{V as N}from"./VContainer-BTDJiuwb.js";/* empty css              */import"./VCheckboxBtn-BYlkLyAU.js";import"./VSelectionControl-DeFiw9vy.js";const U={data(){return{orderitems:[{name:"热门的",type:"trending"},{name:"最受欢迎的",type:"popular"},{name:"新建的",type:"recent"}],tagitems:[{name:"全部",type:"*"},{name:"动画",type:"animations"},{name:"艺术",type:"art"},{name:"游戏",type:"games"},{name:"音乐",type:"music"},{name:"故事",type:"stories"},{name:"教程",type:"tutorials"}],search:{order:"trending",tag:"*",limit:18},usetime:0,ProjectsLoading:!1,projects:[],projectscount:0,curPage:1,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getprojects()},methods:{async getprojects(){this.onPageChange(1)},async onPageChange(m,e){e==!0&&(this.projects=[]),this.usetime=Date.now(),this.ProjectsLoading=!0,this.projects=this.projects.concat(await y({url:this.scratch_proxy+`/projects/explore/projects?mode=${this.search.order}&q=${this.search.tag}&offset=${m*16-16}&limit=${this.search.limit}&language=zh-cn`,method:"get"})),this.curPage=m,this.ProjectsLoading=!1,this.usetime=Date.now()-this.usetime}}},R={class:"mb-2"};function Z(m,e,q,A,r,p){return d(),c(N,null,{default:s(()=>[t(g,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:s(()=>[t(n,{href:"https://scratch.mit.edu/explore/projects/all"},{default:s(()=>e[5]||(e[5]=[l("Scratch上的发现页")])),_:1}),t(n,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:s(()=>e[6]||(e[6]=[l("Scratch使用条款")])),_:1})]),default:s(()=>[t(b,{class:"bg-surface-light pt-4"},{default:s(()=>e[4]||(e[4]=[l(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),l("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),l("查看协议全文。 ")])),_:1})]),_:1}),e[9]||(e[9]=o("br",null,null,-1)),t(h,null,{default:s(()=>[t(u,{cols:"3"},{default:s(()=>[t(f,{modelValue:r.search.order,"onUpdate:modelValue":e[0]||(e[0]=a=>r.search.order=a),items:r.orderitems,"item-title":"name","item-value":"type",label:"排序 为："+r.search.order},null,8,["modelValue","items","label"])]),_:1}),t(u,{cols:"3"},{default:s(()=>[t(f,{modelValue:r.search.tag,"onUpdate:modelValue":e[1]||(e[1]=a=>r.search.tag=a),items:r.tagitems,"item-title":"name","item-value":"type",label:"标签 为："+r.search.tag},null,8,["modelValue","items","label"])]),_:1}),t(u,{cols:"3"},{default:s(()=>[t(n,{onClick:e[2]||(e[2]=a=>p.onPageChange(1,!0))},{default:s(()=>e[7]||(e[7]=[l(" 加载 ")])),_:1})]),_:1})]),_:1}),e[10]||(e[10]=o("br",null,null,-1)),e[11]||(e[11]=o("br",null,null,-1)),t(_,{active:r.ProjectsLoading,height:"4",indeterminate:""},null,8,["active"]),o("div",R,[t(M,null,{default:s(()=>[t(x,{icon:"mdi-clock",start:""}),l("本页加载用时"+i(Math.abs(r.usetime/1e3))+"秒 ",1)]),_:1})]),t(h,null,{default:s(()=>[(d(!0),C(P,null,j(r.projects,a=>(d(),c(u,{cols:" 12",md:"3",key:a},{default:s(()=>[t(g,{to:"/app/proxy/"+a.id},{default:s(()=>[t(v,{src:`${r.scratch_proxy}/thumbnails/${a.id}`,cover:"","lazy-src":D},null,8,["src"]),t(L,null,{default:s(()=>[t(S,null,{default:s(()=>[l(i(a.title),1)]),_:2},1024),t(k,null,{default:s(()=>[l(i(a.description||"简介未找到"),1)]),_:2},1024)]),_:2},1024),t(w,null,{default:s(()=>[t(I,null,{prepend:s(()=>[t(B,{image:`${this.scratch_proxy}/avatars/${a.author.id}`},null,8,["image"])]),default:s(()=>[t(T,null,{default:s(()=>[l(i(a.author.username),1)]),_:2},1024),t(z,null,{default:s(()=>[l(i(a.author.id),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[12]||(e[12]=o("br",null,null,-1)),t(n,{onClick:e[3]||(e[3]=a=>p.onPageChange(r.curPage+1,!1))},{default:s(()=>e[8]||(e[8]=[l("继续加载")])),_:1})]),_:1})}const G=V(U,[["render",Z]]);export{G as default};
