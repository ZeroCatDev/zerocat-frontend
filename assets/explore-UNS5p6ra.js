import{_ as y,J as b,o as p,c as g,w as a,a as t,M as u,L as l,aa as _,K as o,P as f,ab as x,Y as C,T as i,e as j,S as P,R as v,O as L,a2 as S,a3 as k,a4 as w,a1 as I,Q as B,U as T,$ as z,a0 as D}from"./index-B90aKCER.js";import{_ as M}from"./43-lazyload-CBkwrR6M.js";import{a as m,V as h}from"./VRow-D84KqULX.js";import{V}from"./VSelect-CV_AuIsx.js";import{V as N}from"./VChip-CifwzuHU.js";import{V as U}from"./VContainer-C0eSohs8.js";/* empty css              */import"./VCheckboxBtn-DmbOyMhX.js";import"./VSelectionControl-CQtSLUIQ.js";const R={data(){return{orderitems:[{name:"热门的",type:"trending"},{name:"最受欢迎的",type:"popular"},{name:"新建的",type:"recent"}],tagitems:[{name:"全部",type:"*"},{name:"动画",type:"animations"},{name:"艺术",type:"art"},{name:"游戏",type:"games"},{name:"音乐",type:"music"},{name:"故事",type:"stories"},{name:"教程",type:"tutorials"}],search:{order:"trending",tag:"*",limit:18},usetime:0,ProjectsLoading:!1,projects:[],projectscount:0,curPage:1,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getprojects()},methods:{async getprojects(){this.onPageChange(1)},async onPageChange(d,e){e&&(this.projects=[]),this.usetime=Date.now(),this.ProjectsLoading=!0;try{const n=await b.get(`${this.scratch_proxy}/projects/explore/projects?mode=${this.search.order}&q=${this.search.tag}&offset=${d*16-16}&limit=${this.search.limit}&language=zh-cn`);this.projects=this.projects.concat(n.data)}catch(n){console.log(n)}finally{this.ProjectsLoading=!1,this.usetime=Date.now()-this.usetime}this.curPage=d}}},q={class:"mb-2"};function A(d,e,n,E,r,c){return p(),g(U,null,{default:a(()=>[t(f,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:a(()=>[t(u,{href:"https://scratch.mit.edu/explore/projects/all"},{default:a(()=>e[5]||(e[5]=[l("Scratch上的发现页")])),_:1}),t(u,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:a(()=>e[6]||(e[6]=[l("Scratch使用条款")])),_:1})]),default:a(()=>[t(_,{class:"bg-surface-light pt-4"},{default:a(()=>e[4]||(e[4]=[l(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),l("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),l("查看协议全文。 ")])),_:1})]),_:1}),e[9]||(e[9]=o("br",null,null,-1)),t(h,null,{default:a(()=>[t(m,{cols:"3"},{default:a(()=>[t(V,{modelValue:r.search.order,"onUpdate:modelValue":e[0]||(e[0]=s=>r.search.order=s),items:r.orderitems,"item-title":"name","item-value":"type",label:"排序 为："+r.search.order},null,8,["modelValue","items","label"])]),_:1}),t(m,{cols:"3"},{default:a(()=>[t(V,{modelValue:r.search.tag,"onUpdate:modelValue":e[1]||(e[1]=s=>r.search.tag=s),items:r.tagitems,"item-title":"name","item-value":"type",label:"标签 为："+r.search.tag},null,8,["modelValue","items","label"])]),_:1}),t(m,{cols:"3"},{default:a(()=>[t(u,{onClick:e[2]||(e[2]=s=>c.onPageChange(1,!0))},{default:a(()=>e[7]||(e[7]=[l(" 加载 ")])),_:1})]),_:1})]),_:1}),e[10]||(e[10]=o("br",null,null,-1)),e[11]||(e[11]=o("br",null,null,-1)),t(x,{active:r.ProjectsLoading,height:"4",indeterminate:""},null,8,["active"]),o("div",q,[t(N,null,{default:a(()=>[t(C,{icon:"mdi-clock",start:""}),l("本页加载用时"+i(Math.abs(r.usetime/1e3))+"秒 ",1)]),_:1})]),t(h,null,{default:a(()=>[(p(!0),j(v,null,P(r.projects,s=>(p(),g(m,{cols:" 12",md:"3",key:s},{default:a(()=>[t(f,{to:"/app/proxy/"+s.id},{default:a(()=>[t(L,{src:`${r.scratch_proxy}/thumbnails/${s.id}`,cover:"","lazy-src":M},null,8,["src"]),t(S,null,{default:a(()=>[t(k,null,{default:a(()=>[l(i(s.title),1)]),_:2},1024),t(w,null,{default:a(()=>[l(i(s.description||"简介未找到"),1)]),_:2},1024)]),_:2},1024),t(I,null,{default:a(()=>[t(B,null,{prepend:a(()=>[t(T,{image:`${this.scratch_proxy}/avatars/${s.author.id}`},null,8,["image"])]),default:a(()=>[t(z,null,{default:a(()=>[l(i(s.author.username),1)]),_:2},1024),t(D,null,{default:a(()=>[l(i(s.author.id),1)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[12]||(e[12]=o("br",null,null,-1)),t(u,{onClick:e[3]||(e[3]=s=>c.onPageChange(r.curPage+1,!1))},{default:a(()=>e[8]||(e[8]=[l("继续加载")])),_:1})]),_:1})}const H=y(R,[["render",A]]);export{H as default};
