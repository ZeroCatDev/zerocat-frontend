import{p as y,al as D,bB as L,i as w,am as A,an as B,I as F,bt as I,aQ as S,aO as m,aP as O,k as R,W as g,a3 as d,a as E,aF as T,aq as W,bC as C}from"./index-DFGDNXEX.js";const k=y({fullscreen:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,...D({origin:"center center",scrollStrategy:"block",transition:{component:L},zIndex:2400})},"VDialog"),N=w()({name:"VDialog",props:k(),emits:{"update:modelValue":e=>!0,afterEnter:()=>!0,afterLeave:()=>!0},setup(e,h){let{emit:v,slots:i}=h;const u=A(e,"modelValue"),{scopeId:V}=B(),t=F();function f(a){var l,c;const o=a.relatedTarget,r=a.target;if(o!==r&&((l=t.value)!=null&&l.contentEl)&&((c=t.value)!=null&&c.globalTop)&&![document,t.value.contentEl].includes(r)&&!t.value.contentEl.contains(r)){const n=C(t.value.contentEl);if(!n.length)return;const s=n[0],x=n[n.length-1];o===s?x.focus():s.focus()}}I(()=>{document.removeEventListener("focusin",f)}),S&&m(()=>u.value&&e.retainFocus,a=>{a?document.addEventListener("focusin",f):document.removeEventListener("focusin",f)},{immediate:!0});function P(){var a;v("afterEnter"),(a=t.value)!=null&&a.contentEl&&!t.value.contentEl.contains(document.activeElement)&&t.value.contentEl.focus({preventScroll:!0})}function b(){v("afterLeave")}return m(u,async a=>{var o;a||(await O(),(o=t.value.activatorEl)==null||o.focus({preventScroll:!0}))}),R(()=>{const a=g.filterProps(e),o=d({"aria-haspopup":"dialog"},e.activatorProps),r=d({tabindex:-1},e.contentProps);return E(g,d({ref:t,class:["v-dialog",{"v-dialog--fullscreen":e.fullscreen,"v-dialog--scrollable":e.scrollable},e.class],style:e.style},a,{modelValue:u.value,"onUpdate:modelValue":l=>u.value=l,"aria-modal":"true",activatorProps:o,contentProps:r,height:e.fullscreen?void 0:e.height,width:e.fullscreen?void 0:e.width,maxHeight:e.fullscreen?void 0:e.maxHeight,maxWidth:e.fullscreen?void 0:e.maxWidth,role:"dialog",onAfterEnter:P,onAfterLeave:b},V),{activator:i.activator,default:function(){for(var l=arguments.length,c=new Array(l),n=0;n<l;n++)c[n]=arguments[n];return E(T,{root:"VDialog"},{default:()=>{var s;return[(s=i.default)==null?void 0:s.call(i,...c)]}})}})}),W({},t)}});export{N as V};
