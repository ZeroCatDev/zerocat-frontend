import{p as P,a4 as L,bx as se,i as W,aq as le,I as _,a9 as b,k as $,N as X,a as f,T as O,aa as I,ab as ie,by as ue,bz as ce,bA as D,m as j,v as F,x as re,y as de,bh as ve,ar as fe,bf as he,aO as Y,aT as me,bc as be,ay as U,b9 as ge,b6 as q,a6 as N,ba as ye,b5 as xe,bb as we,bB as Te,b7 as Ve,az as Ce,ax as Se,bC as R,aU as ke,am as Be,ap as Ie,z as Pe,A as S,a7 as We,bg as $e,bD as Ee}from"./index-ClYup7uH.js";import{m as _e,b as z}from"./VChip-rcAFIQHh.js";const H=Symbol.for("vuetify:v-tabs"),Xe=P({fixed:Boolean,sliderColor:String,hideSlider:Boolean,direction:{type:String,default:"horizontal"},...L(se({selectedClass:"v-tab--selected",variant:"text"}),["active","block","flat","location","position","symbol"])},"VTab"),Ye=W()({name:"VTab",props:Xe(),setup(e,o){let{slots:n,attrs:t}=o;const{textColorClasses:s,textColorStyles:l}=le(e,"sliderColor"),a=_(),v=_(),c=b(()=>e.direction==="horizontal"),m=b(()=>{var g,i;return((i=(g=a.value)==null?void 0:g.group)==null?void 0:i.isSelected.value)??!1});function T(g){var r,u;let{value:i}=g;if(i){const y=(u=(r=a.value)==null?void 0:r.$el.parentElement)==null?void 0:u.querySelector(".v-tab--selected .v-tab__slider"),k=v.value;if(!y||!k)return;const E=getComputedStyle(y).color,V=y.getBoundingClientRect(),C=k.getBoundingClientRect(),d=c.value?"x":"y",h=c.value?"X":"Y",x=c.value?"right":"bottom",w=c.value?"width":"height",ee=V[d],te=C[d],B=ee>te?V[x]-C[x]:V[d]-C[d],ne=Math.sign(B)>0?c.value?"right":"bottom":Math.sign(B)<0?c.value?"left":"top":"center",oe=(Math.abs(B)+(Math.sign(B)<0?V[w]:C[w]))/Math.max(V[w],C[w])||0,ae=V[w]/C[w]||0,M=1.5;ue(k,{backgroundColor:[E,"currentcolor"],transform:[`translate${h}(${B}px) scale${h}(${ae})`,`translate${h}(${B/M}px) scale${h}(${(oe-1)/M+1})`,"none"],transformOrigin:Array(3).fill(ne)},{duration:225,easing:ce})}}return $(()=>{const g=X.filterProps(e);return f(X,I({symbol:H,ref:a,class:["v-tab",e.class],style:e.style,tabindex:m.value?0:-1,role:"tab","aria-selected":String(m.value),active:!1},g,t,{block:e.fixed,maxWidth:e.fixed?300:void 0,"onGroup:selected":T}),{...n,default:()=>{var i;return f(O,null,[((i=n.default)==null?void 0:i.call(n))??e.text,!e.hideSlider&&f("div",{ref:v,class:["v-tab__slider",s.value],style:l.value},null)])}})}),ie({},a)}}),Re=e=>{const{touchstartX:o,touchendX:n,touchstartY:t,touchendY:s}=e,l=.5,a=16;e.offsetX=n-o,e.offsetY=s-t,Math.abs(e.offsetY)<l*Math.abs(e.offsetX)&&(e.left&&n<o-a&&e.left(e),e.right&&n>o+a&&e.right(e)),Math.abs(e.offsetX)<l*Math.abs(e.offsetY)&&(e.up&&s<t-a&&e.up(e),e.down&&s>t+a&&e.down(e))};function He(e,o){var t;const n=e.changedTouches[0];o.touchstartX=n.clientX,o.touchstartY=n.clientY,(t=o.start)==null||t.call(o,{originalEvent:e,...o})}function Me(e,o){var t;const n=e.changedTouches[0];o.touchendX=n.clientX,o.touchendY=n.clientY,(t=o.end)==null||t.call(o,{originalEvent:e,...o}),Re(o)}function ze(e,o){var t;const n=e.changedTouches[0];o.touchmoveX=n.clientX,o.touchmoveY=n.clientY,(t=o.move)==null||t.call(o,{originalEvent:e,...o})}function Ae(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const o={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:e.left,right:e.right,up:e.up,down:e.down,start:e.start,move:e.move,end:e.end};return{touchstart:n=>He(n,o),touchend:n=>Me(n,o),touchmove:n=>ze(n,o)}}function Ge(e,o){var v;const n=o.value,t=n!=null&&n.parent?e.parentElement:e,s=(n==null?void 0:n.options)??{passive:!0},l=(v=o.instance)==null?void 0:v.$.uid;if(!t||!l)return;const a=Ae(o.value);t._touchHandlers=t._touchHandlers??Object.create(null),t._touchHandlers[l]=a,D(a).forEach(c=>{t.addEventListener(c,a[c],s)})}function Le(e,o){var l,a;const n=(l=o.value)!=null&&l.parent?e.parentElement:e,t=(a=o.instance)==null?void 0:a.$.uid;if(!(n!=null&&n._touchHandlers)||!t)return;const s=n._touchHandlers[t];D(s).forEach(v=>{n.removeEventListener(v,s[v])}),delete n._touchHandlers[t]}const J={mounted:Ge,unmounted:Le},K=Symbol.for("vuetify:v-window"),Q=Symbol.for("vuetify:v-window-group"),Z=P({continuous:Boolean,nextIcon:{type:[Boolean,String,Function,Object],default:"$next"},prevIcon:{type:[Boolean,String,Function,Object],default:"$prev"},reverse:Boolean,showArrows:{type:[Boolean,String],validator:e=>typeof e=="boolean"||e==="hover"},touch:{type:[Object,Boolean],default:void 0},direction:{type:String,default:"horizontal"},modelValue:null,disabled:Boolean,selectedClass:{type:String,default:"v-window-item--active"},mandatory:{type:[Boolean,String],default:"force"},...j(),...F(),...re()},"VWindow"),A=W()({name:"VWindow",directives:{Touch:J},props:Z(),emits:{"update:modelValue":e=>!0},setup(e,o){let{slots:n}=o;const{themeClasses:t}=de(e),{isRtl:s}=ve(),{t:l}=fe(),a=he(e,Q),v=_(),c=b(()=>s.value?!e.reverse:e.reverse),m=Y(!1),T=b(()=>{const d=e.direction==="vertical"?"y":"x",x=(c.value?!m.value:m.value)?"-reverse":"";return`v-window-${d}${x}-transition`}),g=Y(0),i=_(void 0),r=b(()=>a.items.value.findIndex(d=>a.selected.value.includes(d.id)));me(r,(d,h)=>{const x=a.items.value.length,w=x-1;x<=2?m.value=d<h:d===w&&h===0?m.value=!0:d===0&&h===w?m.value=!1:m.value=d<h}),be(K,{transition:T,isReversed:m,transitionCount:g,transitionHeight:i,rootRef:v});const u=b(()=>e.continuous||r.value!==0),y=b(()=>e.continuous||r.value!==a.items.value.length-1);function k(){u.value&&a.prev()}function E(){y.value&&a.next()}const V=b(()=>{const d=[],h={icon:s.value?e.nextIcon:e.prevIcon,class:`v-window__${c.value?"right":"left"}`,onClick:a.prev,"aria-label":l("$vuetify.carousel.prev")};d.push(u.value?n.prev?n.prev({props:h}):f(X,h,null):f("div",null,null));const x={icon:s.value?e.prevIcon:e.nextIcon,class:`v-window__${c.value?"left":"right"}`,onClick:a.next,"aria-label":l("$vuetify.carousel.next")};return d.push(y.value?n.next?n.next({props:x}):f(X,x,null):f("div",null,null)),d}),C=b(()=>e.touch===!1?e.touch:{...{left:()=>{c.value?k():E()},right:()=>{c.value?E():k()},start:h=>{let{originalEvent:x}=h;x.stopPropagation()}},...e.touch===!0?{}:e.touch});return $(()=>U(f(e.tag,{ref:v,class:["v-window",{"v-window--show-arrows-on-hover":e.showArrows==="hover"},t.value,e.class],style:e.style},{default:()=>{var d,h;return[f("div",{class:"v-window__container",style:{height:i.value}},[(d=n.default)==null?void 0:d.call(n,{group:a}),e.showArrows!==!1&&f("div",{class:"v-window__controls"},[V.value])]),(h=n.additional)==null?void 0:h.call(n,{group:a})]}}),[[ge("touch"),C.value]])),{group:a}}}),Oe=P({...L(Z(),["continuous","nextIcon","prevIcon","showArrows","touch","mandatory"])},"VTabsWindow"),De=W()({name:"VTabsWindow",props:Oe(),emits:{"update:modelValue":e=>!0},setup(e,o){let{slots:n}=o;const t=q(H,null),s=N(e,"modelValue"),l=b({get(){var a;return s.value!=null||!t?s.value:(a=t.items.value.find(v=>t.selected.value.includes(v.id)))==null?void 0:a.value},set(a){s.value=a}});return $(()=>{const a=A.filterProps(e);return f(A,I({_as:"VTabsWindow"},a,{modelValue:l.value,"onUpdate:modelValue":v=>l.value=v,class:["v-tabs-window",e.class],style:e.style,mandatory:!1,touch:!1}),n)}),{}}}),p=P({reverseTransition:{type:[Boolean,String],default:void 0},transition:{type:[Boolean,String],default:void 0},...j(),...ye(),...xe()},"VWindowItem"),G=W()({name:"VWindowItem",directives:{Touch:J},props:p(),emits:{"group:selected":e=>!0},setup(e,o){let{slots:n}=o;const t=q(K),s=we(e,Q),{isBooted:l}=Te();if(!t||!s)throw new Error("[Vuetify] VWindowItem must be used inside VWindow");const a=Y(!1),v=b(()=>l.value&&(t.isReversed.value?e.reverseTransition!==!1:e.transition!==!1));function c(){!a.value||!t||(a.value=!1,t.transitionCount.value>0&&(t.transitionCount.value-=1,t.transitionCount.value===0&&(t.transitionHeight.value=void 0)))}function m(){var u;a.value||!t||(a.value=!0,t.transitionCount.value===0&&(t.transitionHeight.value=R((u=t.rootRef.value)==null?void 0:u.clientHeight)),t.transitionCount.value+=1)}function T(){c()}function g(u){a.value&&ke(()=>{!v.value||!a.value||!t||(t.transitionHeight.value=R(u.clientHeight))})}const i=b(()=>{const u=t.isReversed.value?e.reverseTransition:e.transition;return v.value?{name:typeof u!="string"?t.transition.value:u,onBeforeEnter:m,onAfterEnter:c,onEnterCancelled:T,onBeforeLeave:m,onAfterLeave:c,onLeaveCancelled:T,onEnter:g}:!1}),{hasContent:r}=Ve(e,s.isSelected);return $(()=>f(Se,{transition:i.value,disabled:!l.value},{default:()=>{var u;return[U(f("div",{class:["v-window-item",s.selectedClass.value,e.class],style:e.style},[r.value&&((u=n.default)==null?void 0:u.call(n))]),[[Ce,s.isSelected.value]])]}})),{groupItem:s}}}),je=P({...p()},"VTabsWindowItem"),Fe=W()({name:"VTabsWindowItem",props:je(),setup(e,o){let{slots:n}=o;return $(()=>{const t=G.filterProps(e);return f(G,I({_as:"VTabsWindowItem"},t,{class:["v-tabs-window-item",e.class],style:e.style}),n)}),{}}});function Ue(e){return e?e.map(o=>Ee(o)?o:{text:o,value:o}):[]}const qe=P({alignTabs:{type:String,default:"start"},color:String,fixedTabs:Boolean,items:{type:Array,default:()=>[]},stacked:Boolean,bgColor:String,grow:Boolean,height:{type:[Number,String],default:void 0},hideSlider:Boolean,sliderColor:String,..._e({mandatory:"force",selectedClass:"v-tab-item--selected"}),...Be(),...F()},"VTabs"),Qe=W()({name:"VTabs",props:qe(),emits:{"update:modelValue":e=>!0},setup(e,o){let{attrs:n,slots:t}=o;const s=N(e,"modelValue"),l=b(()=>Ue(e.items)),{densityClasses:a}=Ie(e),{backgroundColorClasses:v,backgroundColorStyles:c}=Pe(S(e,"bgColor")),{scopeId:m}=We();return $e({VTab:{color:S(e,"color"),direction:S(e,"direction"),stacked:S(e,"stacked"),fixed:S(e,"fixedTabs"),sliderColor:S(e,"sliderColor"),hideSlider:S(e,"hideSlider")}}),$(()=>{const T=z.filterProps(e),g=!!(t.window||e.items.length>0);return f(O,null,[f(z,I(T,{modelValue:s.value,"onUpdate:modelValue":i=>s.value=i,class:["v-tabs",`v-tabs--${e.direction}`,`v-tabs--align-tabs-${e.alignTabs}`,{"v-tabs--fixed-tabs":e.fixedTabs,"v-tabs--grow":e.grow,"v-tabs--stacked":e.stacked},a.value,v.value,e.class],style:[{"--v-tabs-height":R(e.height)},c.value,e.style],role:"tablist",symbol:H},m,n),{default:()=>{var i;return[((i=t.default)==null?void 0:i.call(t))??l.value.map(r=>{var u;return((u=t.tab)==null?void 0:u.call(t,{item:r}))??f(Ye,I(r,{key:r.text,value:r.value}),{default:t[`tab.${r.value}`]?()=>{var y;return(y=t[`tab.${r.value}`])==null?void 0:y.call(t,{item:r})}:void 0})})]}}),g&&f(De,I({modelValue:s.value,"onUpdate:modelValue":i=>s.value=i,key:"tabs-window"},m),{default:()=>{var i;return[l.value.map(r=>{var u;return((u=t.item)==null?void 0:u.call(t,{item:r}))??f(Fe,{value:r.value},{default:()=>{var y;return(y=t[`item.${r.value}`])==null?void 0:y.call(t,{item:r})}})}),(i=t.window)==null?void 0:i.call(t)]}})])}),{}}});export{Qe as V,Ye as a,De as b,Fe as c};