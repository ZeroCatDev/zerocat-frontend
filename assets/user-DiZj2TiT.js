import{g as I,a as k,r as S,b as L,l as N,D as g}from"./user-DSlOuMVw.js";import{_ as x,o as a,c as d,w as s,a as t,O as l,Z as V,N as f,aa as U,e as y,T as h,S as _,L as F,U as o,$ as Q,R as v,ac as C,ad as D}from"./index-DhpedWYV.js";import{c as p,a as c,V as b}from"./VCard-Bq0scLDL.js";import{V as w}from"./VForm-4uE3wKJM.js";import{V as T}from"./VAlert-QBMYYMrU.js";import{V as B}from"./VContainer-ggZyUeBF.js";import"./db-C932T-P3.js";/* empty css              */const A={data(){return{inputValue:"",users:[],status:"",UserID:0,liveQuerySubscription:null,allUsers:[]}},methods:{async fetchUserInfo(){const u=this.inputValue.split(",").map(n=>Number(n.trim())),e=await Promise.all(u.map(n=>I(n)));this.users=e},async addUser(){const u={id:Number(this.UserID),display_name:"测试用户",motto:"这是一个测试",images:[],regTime:new Date().toISOString(),sex:"未知",username:"testuser"};this.status=await k(u)},async removeUser(){this.status=await S(Number(this.UserID)),this.UserID=0},async refreshUser(){this.status=await L(Number(this.UserID))},startLiveFetch(){const u=this.inputValue.split(",").map(e=>Number(e.trim()));this.liveQuerySubscription&&this.liveQuerySubscription.unsubscribe(),this.liveQuerySubscription=N(u,e=>{this.users=e})},startLiveFetchAll(){this.liveQuerySubscription&&this.liveQuerySubscription.unsubscribe(),this.liveQuerySubscription=g(u=>{this.allUsers=u})}},mounted(){this.startLiveFetch(),this.startLiveFetchAll()},beforeDestroy(){this.liveQuerySubscription&&this.liveQuerySubscription.unsubscribe()}},O={class:"d-flex gap-2"};function q(u,e,n,E,i,m){return a(),d(B,null,{default:s(()=>[t(b,{border:""},{default:s(()=>[t(p,null,{default:s(()=>e[2]||(e[2]=[l("实时获取缓存的用户数据")])),_:1}),t(c,null,{default:s(()=>[t(V,{modelValue:i.inputValue,"onUpdate:modelValue":e[0]||(e[0]=r=>i.inputValue=r),label:"输入用户ID",class:"mb-4"},null,8,["modelValue"]),t(f,{onClick:m.fetchUserInfo,color:"primary",class:"mb-4"},{default:s(()=>e[3]||(e[3]=[l("获取用户信息")])),_:1},8,["onClick"]),t(U,null,{default:s(()=>[(a(!0),y(_,null,h(i.users,r=>(a(),d(v,{key:r.id},{default:s(()=>[t(C,null,{default:s(()=>[l(o(r.display_name||"未缓存"),1)]),_:2},1024),t(D,null,{default:s(()=>[l(o(r.motto||""),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1}),t(b,{class:"mt-4",border:""},{default:s(()=>[t(p,null,{default:s(()=>e[4]||(e[4]=[l("添加缓存的用户数据")])),_:1}),t(c,null,{default:s(()=>[t(w,null,{default:s(()=>[t(V,{modelValue:i.UserID,"onUpdate:modelValue":e[1]||(e[1]=r=>i.UserID=r),label:"用户ID",type:"number",required:""},null,8,["modelValue"]),F("div",O,[t(f,{onClick:m.addUser,color:"primary"},{default:s(()=>e[5]||(e[5]=[l("添加")])),_:1},8,["onClick"]),t(f,{onClick:m.removeUser,color:"error"},{default:s(()=>e[6]||(e[6]=[l("删除")])),_:1},8,["onClick"]),t(f,{onClick:m.refreshUser,color:"info"},{default:s(()=>e[7]||(e[7]=[l("刷新")])),_:1},8,["onClick"])]),i.status?(a(),d(T,{key:0,type:i.status.includes("成功")?"success":"error",class:"mt-4"},{default:s(()=>[l(o(i.status),1)]),_:1},8,["type"])):Q("",!0)]),_:1})]),_:1})]),_:1}),t(b,{class:"mt-4",border:""},{default:s(()=>[t(p,null,{default:s(()=>e[8]||(e[8]=[l("所有缓存的用户数据")])),_:1}),t(c,null,{default:s(()=>[t(U,null,{default:s(()=>[(a(!0),y(_,null,h(i.allUsers,r=>(a(),d(v,{key:r.id},{default:s(()=>[t(C,null,{default:s(()=>[l(o(r.display_name||"未缓存"),1)]),_:2},1024),t(D,null,{default:s(()=>[l(o(r.motto||""),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})}const K=x(A,[["render",q]]);export{K as default};
