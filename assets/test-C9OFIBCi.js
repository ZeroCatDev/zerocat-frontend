import{p as $,av as E,m as X,q,t as O,v as Q,x as K,aG as H,i as J,z as Z,A as I,F as ee,aB as te,aA as ae,bQ as le,D as se,k as oe,bR as ne,a as e,bS as ie,aW as re,aX as de,a1 as N,Y as b,_ as ue,r as me,o as f,c as v,w as t,L as o,M as n,ab as ce,$ as y,K as s,ae as fe,as as R,bt as z,U as u,bT as pe,a2 as x,Q as c,a5 as be,bU as ge,bV as ve,a3 as g,P as ye,ac as xe,a6 as Ve,e as D,S as L,R as A,T as _e,bW as we}from"./index-BAFO42Kr.js";import{V as Ce}from"./VTextarea-9xzTuJVw.js";import{a as Te,V as p}from"./VChip-BxzDopVm.js";import{a as ke,V}from"./VRadioGroup-CTgJUSFL.js";import{V as F}from"./VContainer-CGSDqt_w.js";import{a as _,V as w}from"./VRow-s2z09KXm.js";import{V as he}from"./VSpacer-9dBa-UNW.js";import"./VSelectionControl-BckLg3Mt.js";/* empty css              */const Se=$({bordered:Boolean,color:String,content:[Number,String],dot:Boolean,floating:Boolean,icon:E,inline:Boolean,label:{type:String,default:"$vuetify.badge"},max:[Number,String],modelValue:{type:Boolean,default:!0},offsetX:[Number,String],offsetY:[Number,String],textColor:String,...X(),...q({location:"top end"}),...O(),...Q(),...K(),...H({transition:"scale-rotate-transition"})},"VBadge"),U=J()({name:"VBadge",inheritAttrs:!1,props:Se(),setup(l,a){const{backgroundColorClasses:C,backgroundColorStyles:T}=Z(I(l,"color")),{roundedClasses:r}=ee(l),{t:k}=te(),{textColorClasses:m,textColorStyles:i}=ae(I(l,"textColor")),{themeClasses:G}=le(),{locationStyles:M}=se(l,!0,d=>(l.floating?l.dot?2:4:l.dot?8:12)+(["top","bottom"].includes(d)?+(l.offsetY??0):["left","right"].includes(d)?+(l.offsetX??0):0));return oe(()=>{const d=Number(l.content),h=!l.max||isNaN(d)?l.content:d<=+l.max?d:`${l.max}+`,[W,Y]=ne(a.attrs,["aria-atomic","aria-label","aria-live","role","title"]);return e(l.tag,N({class:["v-badge",{"v-badge--bordered":l.bordered,"v-badge--dot":l.dot,"v-badge--floating":l.floating,"v-badge--inline":l.inline},l.class]},Y,{style:l.style}),{default:()=>{var S,j;return[e("div",{class:"v-badge__wrapper"},[(j=(S=a.slots).default)==null?void 0:j.call(S),e(ie,{transition:l.transition},{default:()=>{var B,P;return[re(e("span",N({class:["v-badge__badge",G.value,C.value,r.value,m.value],style:[T.value,i.value,l.inline?{}:M.value],"aria-atomic":"true","aria-label":k(l.label,d),"aria-live":"polite",role:"status"},W),[l.dot?void 0:a.slots.badge?(P=(B=a.slots).badge)==null?void 0:P.call(B):l.icon?e(b,{icon:l.icon},null):h]),[[de,l.modelValue]])]}})])]}})}),{}}}),je={name:"TestPage",data(){return{drawer:!1,links:[{text:"主页",url:"/"},{text:"在线状态",url:"https://status.wuyuan.dev"},{text:"博客",url:"https://wuyuan.dev"}],socialIcons:[{icon:"mdi-github",url:"https://github.com/sunwuyuan"}]}},watch:{drawer(l){l&&setTimeout(()=>{this.drawer=!0},1e3)}}},Be={class:"pa-4"},Pe={class:"d-flex ga-2 pa-4"},Ie={class:"d-flex justify-end px-4 py-2 ga-4"},Ne={class:"ps-4"},Re={class:"d-flex align-center text-caption"},ze={class:"me-4"},De={class:"d-flex align-center"},Le={class:"my-5"},Ae={class:"text-caption"};function Fe(l,a,C,T,r,k){const m=me("v-list-item-content");return f(),v(F,null,{default:t(()=>[e(n,{onClick:a[0]||(a[0]=i=>r.drawer=!r.drawer),color:"primary",dark:""},{default:t(()=>a[3]||(a[3]=[o(" Toggle drawer ")])),_:1}),e(pe,{modelValue:r.drawer,"onUpdate:modelValue":a[2]||(a[2]=i=>r.drawer=i),floating:"",location:"end",temporary:"",width:l.$vuetify.display.mdAndUp?420:280},{prepend:t(()=>[e(ce,{class:"bg-primary py-6",subtitle:"Lorem, ipsum dolor sit amet consectetur adipisicing elit.",title:"New project"},{append:t(()=>[e(n,{class:"mt-n6",density:"compact",icon:"$close",variant:"text",onClick:a[1]||(a[1]=i=>r.drawer=!1)})]),_:1})]),append:t(()=>[e(y),s("div",Ie,[e(n,{border:"",class:"text-none",flat:"",rounded:"lg",text:"Cancel"}),e(n,{class:"text-none",color:"primary",flat:"",rounded:"lg",text:"Save"})])]),default:t(()=>[s("div",Be,[e(fe,{dirty:"",label:"Project name",variant:"outlined"}),e(Ce,{dirty:"",label:"Description",variant:"outlined"}),e(R,null,{default:t(()=>[e(z,{dirty:"",label:"Team members",variant:"outlined"},{default:t(()=>[s("div",Pe,[e(u,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john-smirk.png",size:"small"}),e(u,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john.png",size:"small"}),e(u,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john-beard.png",size:"small"}),e(u,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john.jpg",size:"small"}),e(u,{class:"border-md border-dashed border-opacity-12 cursor-pointer",icon:"mdi-plus",size:"small"})])]),_:1})]),_:1}),e(R,null,{default:t(()=>[e(z,{dirty:"",label:"Tags",variant:"outlined"},{default:t(()=>[e(Te,{class:"pa-2",column:""},{default:t(()=>[e(p,{color:"primary",text:"Design"}),e(p,{color:"primary",text:"Development"}),e(p,{color:"primary",text:"Marketing"}),e(p,{color:"primary",text:"SEO"}),e(p,{color:"primary",text:"Management"})]),_:1})]),_:1})]),_:1}),e(ke,{class:"ms-n4",color:"primary",label:"Privacy"},{default:t(()=>[e(V,{class:"mb-4",value:"public"},{label:t(()=>a[4]||(a[4]=[s("div",{class:"text-body-2"},[s("strong",null,"Public access"),s("div",null,"Everyone with the link will see this project")],-1)])),_:1}),e(V,{class:"mb-4",value:"private"},{label:t(()=>a[5]||(a[5]=[s("div",{class:"text-body-2"},[s("strong",null,"Private access"),s("div",null,"Only team members can see this project")],-1)])),_:1}),e(V,{class:"mb-4",value:"custom"},{label:t(()=>a[6]||(a[6]=[s("div",{class:"text-body-2"},[s("strong",null,"Custom access"),s("div",null,"Choose who can see this project")],-1)])),_:1})]),_:1}),e(y,{class:"mb-4"}),e(n,{class:"text-none",color:"primary","prepend-icon":"mdi-link-variant",slim:"",text:"Copy link",variant:"text"}),a[7]||(a[7]=s("br",null,null,-1)),e(n,{class:"text-none",color:"medium-emphasis","prepend-icon":"mdi-help-circle",slim:"",text:"Learn more about sharing",variant:"text"})])]),_:1},8,["modelValue","width"]),e(F,{class:"pa-md-12"},{default:t(()=>[e(x,{border:"",class:"pb-4 mx-auto",lines:"two","max-width":"600",rounded:"lg",slim:""},{default:t(()=>[e(c,null,{prepend:t(()=>[e(U,{bordered:"",class:"me-n2",color:"amber",icon:"mdi-star",location:"bottom end","offset-x":"4","offset-y":"8"},{default:t(()=>[e(u,{color:"surface-variant"})]),_:1})]),title:t(()=>a[8]||(a[8]=[s("strong",null,"johnleider",-1),s("span",{class:"text-medium-emphasis font-weight-light"}," starred a repository ",-1)])),subtitle:t(()=>a[9]||(a[9]=[s("span",{class:"font-weight-regular text-caption"},"3 hours ago",-1)])),append:t(()=>[e(n,{class:"mt-n4",icon:"mdi-dots-horizontal",size:"small",variant:"text"})]),_:1}),e(x,{"bg-color":"surface-light",class:"mx-4 pb-5",color:"surface-light",density:"compact",lines:!1,rounded:"lg"},{default:t(()=>[e(c,null,{prepend:t(()=>[e(u,{class:"me-n2",color:"surface-variant",size:"18"})]),title:t(()=>a[10]||(a[10]=[s("strong",null,"vuetifyjs/one",-1)])),append:t(()=>[e(be,{border:"",color:"primary",density:"compact",rounded:"lg",size:"x-small"},{default:t(()=>[e(n,{class:"text-none","prepend-icon":"mdi-star-outline",text:"Star"}),e(y,{color:"surface-light",vertical:""}),e(n,{class:"px-5",icon:"mdi-menu-down"})]),_:1})]),_:1}),s("div",Ne,[a[13]||(a[13]=s("div",{class:"mb-3 text-body-2"},[s("span",{class:"pe-1"},"✨"),o(" Binding the Vuetify ecosystem ")],-1)),s("div",Re,[s("div",ze,[e(U,{color:"primary",dot:"",inline:""}),a[11]||(a[11]=o(" TypeScript "))]),s("div",De,[e(b,{icon:"mdi-star-outline"}),a[12]||(a[12]=o(" 431 "))])])])]),_:1})]),_:1})]),_:1}),e(w,null,{default:t(()=>[e(_,null,{default:t(()=>[e(ge,{color:"primary",dark:""},{default:t(()=>[e(ve,null,{default:t(()=>a[14]||(a[14]=[o("Test UI")])),_:1}),e(he),e(n,{icon:""},{default:t(()=>[e(b,null,{default:t(()=>a[15]||(a[15]=[o("mdi-magnify")])),_:1})]),_:1}),e(n,{icon:""},{default:t(()=>[e(b,null,{default:t(()=>a[16]||(a[16]=[o("mdi-bell")])),_:1})]),_:1}),e(n,{icon:""},{default:t(()=>[e(b,null,{default:t(()=>a[17]||(a[17]=[o("mdi-account-circle")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(w,null,{default:t(()=>[e(_,{cols:"3"},{default:t(()=>[e(x,{dense:""},{default:t(()=>[e(c,null,{default:t(()=>[e(m,null,{default:t(()=>[e(g,null,{default:t(()=>a[18]||(a[18]=[o("Dashboard")])),_:1})]),_:1})]),_:1}),e(c,null,{default:t(()=>[e(m,null,{default:t(()=>[e(g,null,{default:t(()=>a[19]||(a[19]=[o("Repositories")])),_:1})]),_:1})]),_:1}),e(c,null,{default:t(()=>[e(m,null,{default:t(()=>[e(g,null,{default:t(()=>a[20]||(a[20]=[o("Issues")])),_:1})]),_:1})]),_:1}),e(c,null,{default:t(()=>[e(m,null,{default:t(()=>[e(g,null,{default:t(()=>a[21]||(a[21]=[o("Pull Requests")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(_,{cols:"9"},{default:t(()=>[e(ye,null,{default:t(()=>[e(xe,null,{default:t(()=>a[22]||(a[22]=[o("Welcome to Test UI")])),_:1}),e(Ve,null,{default:t(()=>a[23]||(a[23]=[o(" This is a simple UI built with Vuetify to resemble common Test components. ")])),_:1})]),_:1})]),_:1})]),_:1}),e(we,{class:"text-center d-flex flex-column py-sm-16 py-8"},{default:t(()=>[e(w,{justify:"center","no-gutters":""},{default:t(()=>[(f(!0),D(A,null,L(r.links,i=>(f(),v(n,{key:i.text,class:"mx-2 text-none",rounded:"",text:i.text,href:i.url,variant:"text"},null,8,["text","href"]))),128))]),_:1}),s("div",Le,[(f(!0),D(A,null,L(r.socialIcons,i=>(f(),v(n,{key:i.icon,class:"mx-4",icon:i.icon,href:i.url,variant:"text"},null,8,["icon","href"]))),128))]),s("p",Ae," © 2016-"+_e(new Date().getFullYear())+" Vuetify. All rights reserved. ",1)]),_:1})]),_:1})}const Oe=ue(je,[["render",Fe],["__scopeId","data-v-933bca9c"]]);export{Oe as default};
