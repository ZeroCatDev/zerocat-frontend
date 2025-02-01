import{av as h,f as z,p as L,aj as $,am as o,l as E,aw as j,ax as w,u as F,s as R,v as O,x as M,y as N,ay as Z,t as p,az as q,a as t,aA as G,Z as H,aB as d,I as J,a4 as K,aC as Q,z as U,A as W,B as X,C as Y,D as ee,E as ae,j as te,aD as le,k as ne,aE as se}from"./index-DhXuRan5.js";const oe=h("v-alert-title"),ie=["success","info","warning","error"],re=L({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:se,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>ie.includes(e)},...ne(),...le(),...te(),...ae(),...ee(),...Y(),...X(),...W(),...U(),...Q({variant:"flat"})},"VAlert"),ue=z()({name:"VAlert",props:re(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,v){let{emit:y,slots:a}=v;const i=$(e,"modelValue"),n=o(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),m=o(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:f}=E(e),{colorClasses:k,colorStyles:b,variantClasses:C}=j(m),{densityClasses:P}=w(e),{dimensionStyles:V}=F(e),{elevationClasses:x}=R(e),{locationStyles:g}=O(e),{positionClasses:S}=M(e),{roundedClasses:_}=N(e),{textColorClasses:B,textColorStyles:A}=Z(p(e,"borderColor")),{t:D}=q(),r=o(()=>({"aria-label":D(e.closeLabel),onClick(s){i.value=!1,y("click:close",s)}}));return()=>{const s=!!(a.prepend||n.value),I=!!(a.title||e.title),T=!!(a.close||e.closable);return i.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},f.value,k.value,P.value,x.value,S.value,_.value,C.value,e.class],style:[b.value,V.value,g.value,e.style],role:"alert"},{default:()=>{var c,u;return[G(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",B.value],style:A.value},null),s&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(d,{key:"prepend-defaults",disabled:!n.value,defaults:{VIcon:{density:e.density,icon:n.value,size:e.prominent?44:28}}},a.prepend):t(H,{key:"prepend-icon",density:e.density,icon:n.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[I&&t(oe,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),((c=a.text)==null?void 0:c.call(a))??e.text,(u=a.default)==null?void 0:u.call(a)]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),T&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(d,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var l;return[(l=a.close)==null?void 0:l.call(a,{props:r.value})]}}):t(J,K({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},r.value),null)])]}})}}});export{ue as V};
