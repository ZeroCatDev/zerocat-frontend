import{p as $,aQ as A,m as X,q as K,t as H,v as J,x as Z,au as ee,i as F,z as te,A as M,F as ae,av as le,ay as se,bP as oe,D as ne,k as O,bQ as re,a as e,bR as ie,aO as de,aP as ue,a6 as C,X as _,an as me,af as ce,aj as fe,ak as pe,ah as be,ap as ge,aq as S,R as U,bG as ve,_ as ye,r as Ve,o as V,c as j,w as t,L as n,M as r,a0 as xe,a7 as B,K as s,a5 as _e,bs as Y,U as c,bS as Ce,$ as N,Q as b,bT as we,bU as ke,bV as Pe,Y as h,P as Te,a1 as he,a8 as Se,e as q,S as E,T as Ie,bW as Re}from"./index-Br6O0dGK.js";import{V as je}from"./VTextarea-FbvhiMuc.js";import{a as Be,V as x}from"./VChip-DcdvECOZ.js";import{m as Ne,V as G,a as De,b as Le}from"./VSelectionControl-CAniPfYq.js";import{V as Q}from"./VContainer-D-SemzeR.js";import{a as D,V as L}from"./VRow-lRcUnfcN.js";import{V as ze}from"./VSpacer-DCV9Pua2.js";/* empty css              */const Ae=$({bordered:Boolean,color:String,content:[Number,String],dot:Boolean,floating:Boolean,icon:A,inline:Boolean,label:{type:String,default:"$vuetify.badge"},max:[Number,String],modelValue:{type:Boolean,default:!0},offsetX:[Number,String],offsetY:[Number,String],textColor:String,...X(),...K({location:"top end"}),...H(),...J(),...Z(),...ee({transition:"scale-rotate-transition"})},"VBadge"),W=F()({name:"VBadge",inheritAttrs:!1,props:Ae(),setup(l,a){const{backgroundColorClasses:f,backgroundColorStyles:u}=te(M(l,"color")),{roundedClasses:i}=ae(l),{t:g}=le(),{textColorClasses:d,textColorStyles:o}=se(M(l,"textColor")),{themeClasses:I}=oe(),{locationStyles:R}=ne(l,!0,m=>(l.floating?l.dot?2:4:l.dot?8:12)+(["top","bottom"].includes(m)?+(l.offsetY??0):["left","right"].includes(m)?+(l.offsetX??0):0));return O(()=>{const m=Number(l.content),p=!l.max||isNaN(m)?l.content:m<=+l.max?m:`${l.max}+`,[v,y]=re(a.attrs,["aria-atomic","aria-label","aria-live","role","title"]);return e(l.tag,C({class:["v-badge",{"v-badge--bordered":l.bordered,"v-badge--dot":l.dot,"v-badge--floating":l.floating,"v-badge--inline":l.inline},l.class]},y,{style:l.style}),{default:()=>{var w,k;return[e("div",{class:"v-badge__wrapper"},[(k=(w=a.slots).default)==null?void 0:k.call(w),e(ie,{transition:l.transition},{default:()=>{var P,T;return[de(e("span",C({class:["v-badge__badge",I.value,f.value,i.value,d.value],style:[u.value,o.value,l.inline?{}:R.value],"aria-atomic":"true","aria-label":g(l.label,m),"aria-live":"polite",role:"status"},v),[l.dot?void 0:a.slots.badge?(T=(P=a.slots).badge)==null?void 0:T.call(P):l.icon?e(_,{icon:l.icon},null):p]),[[ue,l.modelValue]])]}})])]}})}),{}}}),Ue=$({...Ne({falseIcon:"$radioOff",trueIcon:"$radioOn"})},"VRadio"),z=F()({name:"VRadio",props:Ue(),setup(l,a){let{slots:f}=a;return O(()=>{const u=G.filterProps(l);return e(G,C(u,{class:["v-radio",l.class],style:l.style,type:"radio"}),f)}),{}}}),Ge=$({height:{type:[Number,String],default:"auto"},...me(),...ce(De(),["multiple"]),trueIcon:{type:A,default:"$radioOn"},falseIcon:{type:A,default:"$radioOff"},type:{type:String,default:"radio"}},"VRadioGroup"),$e=F()({name:"VRadioGroup",inheritAttrs:!1,props:Ge(),emits:{"update:modelValue":l=>!0},setup(l,a){let{attrs:f,slots:u}=a;const i=fe(),g=pe(()=>l.id||`radio-group-${i}`),d=be(l,"modelValue");return O(()=>{const[o,I]=ge(f),R=S.filterProps(l),m=G.filterProps(l),p=u.label?u.label({label:l.label,props:{for:g.value}}):l.label;return e(S,C({class:["v-radio-group",l.class],style:l.style},o,R,{modelValue:d.value,"onUpdate:modelValue":v=>d.value=v,id:g.value}),{...u,default:v=>{let{id:y,messagesId:w,isDisabled:k,isReadonly:P}=v;return e(U,null,[p&&e(ve,{id:y.value},{default:()=>[p]}),e(Le,C(m,{id:y.value,"aria-describedby":w.value,defaultsTarget:"VRadio",trueIcon:l.trueIcon,falseIcon:l.falseIcon,type:l.type,disabled:k.value,readonly:P.value,"aria-labelledby":p?y.value:void 0,multiple:!1},I,{modelValue:d.value,"onUpdate:modelValue":T=>d.value=T}),u)])}})}),{}}}),Fe={name:"TestPage",data(){return{drawer:!1,links:[{text:"主页",url:"/"},{text:"在线状态",url:"https://status.wuyuan.dev"},{text:"博客",url:"https://wuyuan.dev"}],socialIcons:[{icon:"mdi-github",url:"https://github.com/sunwuyuan"}]}},watch:{drawer(l){l&&setTimeout(()=>{this.drawer=!0},1e3)}}},Oe={class:"pa-4"},Me={class:"d-flex ga-2 pa-4"},Ye={class:"d-flex justify-end px-4 py-2 ga-4"},qe={class:"ps-4"},Ee={class:"d-flex align-center text-caption"},Qe={class:"me-4"},We={class:"d-flex align-center"},Xe={class:"my-5"},Ke={class:"text-caption"};function He(l,a,f,u,i,g){const d=Ve("v-list-item-content");return V(),j(Q,null,{default:t(()=>[e(r,{onClick:a[0]||(a[0]=o=>i.drawer=!i.drawer),color:"primary",dark:""},{default:t(()=>a[3]||(a[3]=[n(" Toggle drawer ")])),_:1}),e(Ce,{modelValue:i.drawer,"onUpdate:modelValue":a[2]||(a[2]=o=>i.drawer=o),floating:"",location:"end",temporary:"",width:l.$vuetify.display.mdAndUp?420:280},{prepend:t(()=>[e(xe,{class:"bg-primary py-6",subtitle:"Lorem, ipsum dolor sit amet consectetur adipisicing elit.",title:"New project"},{append:t(()=>[e(r,{class:"mt-n6",density:"compact",icon:"$close",variant:"text",onClick:a[1]||(a[1]=o=>i.drawer=!1)})]),_:1})]),append:t(()=>[e(B),s("div",Ye,[e(r,{border:"",class:"text-none",flat:"",rounded:"lg",text:"Cancel"}),e(r,{class:"text-none",color:"primary",flat:"",rounded:"lg",text:"Save"})])]),default:t(()=>[s("div",Oe,[e(_e,{dirty:"",label:"Project name",variant:"outlined"}),e(je,{dirty:"",label:"Description",variant:"outlined"}),e(S,null,{default:t(()=>[e(Y,{dirty:"",label:"Team members",variant:"outlined"},{default:t(()=>[s("div",Me,[e(c,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john-smirk.png",size:"small"}),e(c,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john.png",size:"small"}),e(c,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john-beard.png",size:"small"}),e(c,{class:"cursor-pointer",image:"https://vuetifyjs.b-cdn.net/images/john.jpg",size:"small"}),e(c,{class:"border-md border-dashed border-opacity-12 cursor-pointer",icon:"mdi-plus",size:"small"})])]),_:1})]),_:1}),e(S,null,{default:t(()=>[e(Y,{dirty:"",label:"Tags",variant:"outlined"},{default:t(()=>[e(Be,{class:"pa-2",column:""},{default:t(()=>[e(x,{color:"primary",text:"Design"}),e(x,{color:"primary",text:"Development"}),e(x,{color:"primary",text:"Marketing"}),e(x,{color:"primary",text:"SEO"}),e(x,{color:"primary",text:"Management"})]),_:1})]),_:1})]),_:1}),e($e,{class:"ms-n4",color:"primary",label:"Privacy"},{default:t(()=>[e(z,{class:"mb-4",value:"public"},{label:t(()=>a[4]||(a[4]=[s("div",{class:"text-body-2"},[s("strong",null,"Public access"),s("div",null,"Everyone with the link will see this project")],-1)])),_:1}),e(z,{class:"mb-4",value:"private"},{label:t(()=>a[5]||(a[5]=[s("div",{class:"text-body-2"},[s("strong",null,"Private access"),s("div",null,"Only team members can see this project")],-1)])),_:1}),e(z,{class:"mb-4",value:"custom"},{label:t(()=>a[6]||(a[6]=[s("div",{class:"text-body-2"},[s("strong",null,"Custom access"),s("div",null,"Choose who can see this project")],-1)])),_:1})]),_:1}),e(B,{class:"mb-4"}),e(r,{class:"text-none",color:"primary","prepend-icon":"mdi-link-variant",slim:"",text:"Copy link",variant:"text"}),a[7]||(a[7]=s("br",null,null,-1)),e(r,{class:"text-none",color:"medium-emphasis","prepend-icon":"mdi-help-circle",slim:"",text:"Learn more about sharing",variant:"text"})])]),_:1},8,["modelValue","width"]),e(Q,{class:"pa-md-12"},{default:t(()=>[e(N,{border:"",class:"pb-4 mx-auto",lines:"two","max-width":"600",rounded:"lg",slim:""},{default:t(()=>[e(b,null,{prepend:t(()=>[e(W,{bordered:"",class:"me-n2",color:"amber",icon:"mdi-star",location:"bottom end","offset-x":"4","offset-y":"8"},{default:t(()=>[e(c,{color:"surface-variant"})]),_:1})]),title:t(()=>a[8]||(a[8]=[s("strong",null,"johnleider",-1),s("span",{class:"text-medium-emphasis font-weight-light"}," starred a repository ",-1)])),subtitle:t(()=>a[9]||(a[9]=[s("span",{class:"font-weight-regular text-caption"},"3 hours ago",-1)])),append:t(()=>[e(r,{class:"mt-n4",icon:"mdi-dots-horizontal",size:"small",variant:"text"})]),_:1}),e(N,{"bg-color":"surface-light",class:"mx-4 pb-5",color:"surface-light",density:"compact",lines:!1,rounded:"lg"},{default:t(()=>[e(b,null,{prepend:t(()=>[e(c,{class:"me-n2",color:"surface-variant",size:"18"})]),title:t(()=>a[10]||(a[10]=[s("strong",null,"vuetifyjs/one",-1)])),append:t(()=>[e(we,{border:"",color:"primary",density:"compact",rounded:"lg",size:"x-small"},{default:t(()=>[e(r,{class:"text-none","prepend-icon":"mdi-star-outline",text:"Star"}),e(B,{color:"surface-light",vertical:""}),e(r,{class:"px-5",icon:"mdi-menu-down"})]),_:1})]),_:1}),s("div",qe,[a[13]||(a[13]=s("div",{class:"mb-3 text-body-2"},[s("span",{class:"pe-1"},"✨"),n(" Binding the Vuetify ecosystem ")],-1)),s("div",Ee,[s("div",Qe,[e(W,{color:"primary",dot:"",inline:""}),a[11]||(a[11]=n(" TypeScript "))]),s("div",We,[e(_,{icon:"mdi-star-outline"}),a[12]||(a[12]=n(" 431 "))])])])]),_:1})]),_:1})]),_:1}),e(L,null,{default:t(()=>[e(D,null,{default:t(()=>[e(ke,{color:"primary",dark:""},{default:t(()=>[e(Pe,null,{default:t(()=>a[14]||(a[14]=[n("Test UI")])),_:1}),e(ze),e(r,{icon:""},{default:t(()=>[e(_,null,{default:t(()=>a[15]||(a[15]=[n("mdi-magnify")])),_:1})]),_:1}),e(r,{icon:""},{default:t(()=>[e(_,null,{default:t(()=>a[16]||(a[16]=[n("mdi-bell")])),_:1})]),_:1}),e(r,{icon:""},{default:t(()=>[e(_,null,{default:t(()=>a[17]||(a[17]=[n("mdi-account-circle")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(L,null,{default:t(()=>[e(D,{cols:"3"},{default:t(()=>[e(N,{dense:""},{default:t(()=>[e(b,null,{default:t(()=>[e(d,null,{default:t(()=>[e(h,null,{default:t(()=>a[18]||(a[18]=[n("Dashboard")])),_:1})]),_:1})]),_:1}),e(b,null,{default:t(()=>[e(d,null,{default:t(()=>[e(h,null,{default:t(()=>a[19]||(a[19]=[n("Repositories")])),_:1})]),_:1})]),_:1}),e(b,null,{default:t(()=>[e(d,null,{default:t(()=>[e(h,null,{default:t(()=>a[20]||(a[20]=[n("Issues")])),_:1})]),_:1})]),_:1}),e(b,null,{default:t(()=>[e(d,null,{default:t(()=>[e(h,null,{default:t(()=>a[21]||(a[21]=[n("Pull Requests")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(D,{cols:"9"},{default:t(()=>[e(Te,null,{default:t(()=>[e(he,null,{default:t(()=>a[22]||(a[22]=[n("Welcome to Test UI")])),_:1}),e(Se,null,{default:t(()=>a[23]||(a[23]=[n(" This is a simple UI built with Vuetify to resemble common Test components. ")])),_:1})]),_:1})]),_:1})]),_:1}),e(Re,{class:"text-center d-flex flex-column py-sm-16 py-8"},{default:t(()=>[e(L,{justify:"center","no-gutters":""},{default:t(()=>[(V(!0),q(U,null,E(i.links,o=>(V(),j(r,{key:o.text,class:"mx-2 text-none",rounded:"",text:o.text,href:o.url,variant:"text"},null,8,["text","href"]))),128))]),_:1}),s("div",Xe,[(V(!0),q(U,null,E(i.socialIcons,o=>(V(),j(r,{key:o.icon,class:"mx-4",icon:o.icon,href:o.url,variant:"text"},null,8,["icon","href"]))),128))]),s("p",Ke," © 2016-"+Ie(new Date().getFullYear())+" Vuetify. All rights reserved. ",1)]),_:1})]),_:1})}const nt=ye(Fe,[["render",He],["__scopeId","data-v-205f3d40"]]);export{nt as default};
