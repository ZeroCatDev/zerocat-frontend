import{_ as V}from"./Comment-DnYi-RAE.js";import{P as b}from"./Projects-Cr_P9UTq.js";import{_ as y,G as w,J as v,o as u,c as _,w as e,a as t,Z as n,N as C,K as a,L as o,T as i,U as j,O as k,$ as m,e as I,S as P,R as U,a0 as B,P as f}from"./index-DFGDNXEX.js";import{g as T}from"./user-CXp8-cqE.js";import{V as h,a as g}from"./VRow-CzGTsTAp.js";import{V as d}from"./VChip-C18j0b7D.js";import{V as L}from"./VContainer-XQBTMZ79.js";import"./VForm-BTRVDrNb.js";import"./VTextarea-aET61q5j.js";import"./VDialog-Dri-Z7zh.js";import"./showProjects-8JuSCgRZ.js";import"./projectService-Bqkob48R.js";import"./43-lazyload-CBkwrR6M.js";import"./VPagination-D1yC8aPH.js";/* empty css              */const N={components:{Projects:b,Comment:V},data(){return{username:this.$route.params.username,user:{},lists:[],url:"",tab:this.$route.query.tab||"home"}},watch:{"$route.query.tab"(c){this.tab=c||"home"}},async created(){await this.fetchUser(),await this.getProjectList(),this.tab=this.$route.query.tab||"home"},methods:{async fetchUser(){this.user=await T(this.username),w({title:""+this.user.display_name}),this.url=`/searchapi?search_userid=${this.user.id}&search_type=&search_title=&search_source=&search_description=&search_orderby=view_up&search_state=public&search_tag=`},async getProjectList(){this.lists=(await v({url:`/projectlist/userid/${this.user.id}/public`,method:"get"})).data.data}}},q={class:"font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username"},R={class:"mt-2 text-body-1 text-medium-emphasis"},D={class:"mt-2 text-medium-emphasis"};function S(c,s,W,Z,r,z){const x=b,p=V;return u(),_(L,null,{default:e(()=>[t(B,{modelValue:r.tab,"onUpdate:modelValue":s[0]||(s[0]=l=>r.tab=l)},{default:e(()=>[t(n,{value:"home"},{default:e(()=>[t(C,{class:"mt-8"},{default:e(()=>[t(h,{class:"d-flex align-center"},{default:e(()=>[t(g,null,{default:e(()=>[s[2]||(s[2]=a("p",{class:"font-weight-medium text-primary"},"ZeroCat 用户",-1)),a("p",q,[o(i(r.user.display_name)+" ",1),t(j,{size:"52",class:"ma-2"},{default:e(()=>[t(k,{src:"https://s4-1.wuyuan.1r.ink/user/"+r.user.images},null,8,["src"])]),_:1})]),a("p",R,i(r.user.motto),1),a("p",D,[t(d,null,{default:e(()=>[t(m,{icon:"mdi-account-circle",start:""}),o(" ID:"+i(r.user.id),1)]),_:1}),t(d,null,{default:e(()=>[t(m,{icon:"mdi-clock",start:""}),o(" "+i(r.user.regTime)+"注册 ",1)]),_:1}),t(d,null,{default:e(()=>[t(m,{icon:"mdi-tag",start:""}),s[1]||(s[1]=o(" 创作者 "))]),_:1})])]),_:1})]),_:1})]),_:1}),s[3]||(s[3]=a("br",null,null,-1)),t(x,{url:r.url},null,8,["url"]),t(h,null,{default:e(()=>[(u(!0),I(U,null,P(r.lists,l=>(u(),_(g,{cols:"12",xs:"12",sm:"6",md:"4",lg:"3",xl:"2",xxl:"2",key:l.id},{default:e(()=>[t(f,{rounded:"lg"},{default:e(()=>[t(f,{to:"/app/projectlist/"+l.id,rounded:"lg",title:l.title,subtitle:l.description,color:"primary",variant:"tonal"},null,8,["to","title","subtitle"])]),_:2},1024)]),_:2},1024))),128))]),_:1}),s[4]||(s[4]=a("br",null,null,-1)),t(p,{url:"user-"+r.user.id,name:"用户"},null,8,["url"])]),_:1}),t(n,{value:"comment"},{default:e(()=>[t(p,{url:"user-"+r.user.id,name:"用户"},null,8,["url"])]),_:1}),t(n,{value:"3"},{default:e(()=>s[5]||(s[5]=[a("div",null,"内容 3",-1)])),_:1})]),_:1},8,["modelValue"])]),_:1})}const st=y(N,[["render",S],["__scopeId","data-v-3d335797"]]);export{st as default};
