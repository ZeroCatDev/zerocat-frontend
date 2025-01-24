import{a as S,b as v,c as k,r as I,l as x,D as L}from"./project-kwvXAjHz.js";import{_ as N,o as a,c,w as e,a as s,a3 as m,L as l,aa as p,a7 as j,M as d,a1 as P,e as V,S as h,R as y,P as f,K as w,T as u,a5 as F,Q as _,$ as C,a0 as D}from"./index-B90aKCER.js";import{V as Q}from"./VForm-B5rF0L3y.js";import{V as T}from"./VAlert-txCO3voB.js";import{V as g}from"./VContainer-C0eSohs8.js";import"./db-DbzbaeFF.js";/* empty css              */const B={data(){return{inputValue:"",projects:[],allProjects:[],status:"",ProjectID:0,liveQuerySubscription:null,allProjectsSubscription:null}},methods:{async fetchProjects(){const o=this.inputValue.split(",").map(b=>Number(b.trim())),t=await S(o);typeof t=="object"&&!Array.isArray(t)?this.projects=[t]:this.projects=t},async addProject(){const o={id:Number(this.ProjectID),title:"测试项目",description:"这是一个测试项目",authorid:1,type:"text",licence:"MIT",state:"public",view_count:0,time:new Date().toISOString(),tags:[],source:"test"};this.status=await v(o)},async removeProject(){this.status=await k(Number(this.ProjectID)),this.ProjectID=0},async refreshProject(){this.status=await I(Number(this.ProjectID))},startLiveFetch(){const o=this.inputValue.split(",").map(t=>Number(t.trim()));this.liveQuerySubscription&&this.liveQuerySubscription.unsubscribe(),this.liveQuerySubscription=x(o,t=>{this.projects=t}),this.allProjectsSubscription&&this.allProjectsSubscription.unsubscribe(),this.allProjectsSubscription=L(t=>{this.allProjects=t})}},mounted(){this.startLiveFetch()},beforeDestroy(){this.liveQuerySubscription&&this.liveQuerySubscription.unsubscribe(),this.allProjectsSubscription&&this.allProjectsSubscription.unsubscribe()}},A={class:"d-flex gap-2"};function M(o,t,b,U,i,n){return a(),c(g,null,{default:e(()=>[s(f,{border:""},{default:e(()=>[s(m,null,{default:e(()=>t[2]||(t[2]=[l("实时获取缓存的项目数据")])),_:1}),s(p,null,{default:e(()=>[s(j,{modelValue:i.inputValue,"onUpdate:modelValue":t[0]||(t[0]=r=>i.inputValue=r),label:"输入项目ID",class:"mb-4"},null,8,["modelValue"]),s(d,{onClick:n.startLiveFetch,color:"primary",class:"mb-4"},{default:e(()=>t[3]||(t[3]=[l("实时获取数据")])),_:1},8,["onClick"]),s(P,null,{default:e(()=>[(a(!0),V(y,null,h(i.projects,r=>(a(),c(_,{key:r.id},{default:e(()=>[s(C,null,{default:e(()=>[l(u(r.title||"未缓存"),1)]),_:2},1024),s(D,null,{default:e(()=>[l(u(r.description||""),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1}),s(f,{class:"mt-4",border:""},{default:e(()=>[s(m,null,{default:e(()=>t[4]||(t[4]=[l("添加缓存的项目数据")])),_:1}),s(p,null,{default:e(()=>[s(Q,null,{default:e(()=>[s(j,{modelValue:i.ProjectID,"onUpdate:modelValue":t[1]||(t[1]=r=>i.ProjectID=r),label:"项目ID",type:"number",required:""},null,8,["modelValue"]),w("div",A,[s(d,{onClick:n.addProject,color:"primary"},{default:e(()=>t[5]||(t[5]=[l("添加")])),_:1},8,["onClick"]),s(d,{onClick:n.removeProject,color:"error"},{default:e(()=>t[6]||(t[6]=[l("删除")])),_:1},8,["onClick"]),s(d,{onClick:n.refreshProject,color:"info"},{default:e(()=>t[7]||(t[7]=[l("刷新")])),_:1},8,["onClick"])]),i.status?(a(),c(T,{key:0,type:i.status.includes("成功")?"success":"error",class:"mt-4"},{default:e(()=>[l(u(i.status),1)]),_:1},8,["type"])):F("",!0)]),_:1})]),_:1})]),_:1}),s(f,{class:"mt-4",border:""},{default:e(()=>[s(m,null,{default:e(()=>t[8]||(t[8]=[l("所有缓存的项目数据")])),_:1}),s(p,null,{default:e(()=>[s(P,null,{default:e(()=>[(a(!0),V(y,null,h(i.allProjects,r=>(a(),c(_,{key:r.id},{default:e(()=>[s(C,null,{default:e(()=>[l(u(r.title||"未缓存"),1)]),_:2},1024),s(D,null,{default:e(()=>[l(u(r.description||""),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})}const H=N(B,[["render",M]]);export{H as default};
