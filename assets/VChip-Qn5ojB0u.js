import{f as R,p as w,l as F,b1 as U,b2 as ee,t as r,i as ae,bg as x,a as l,a4 as P,aC as T,z as $,A as M,b4 as le,k as j,bh as te,bi as ne,aY as se,az as ie,q as ce,aw as de,ax as oe,s as ue,y as re,bj as ve,aj as fe,a_ as pe,bk as ke,am as V,aV as D,aZ as me,aA as be,bl as he,Z as v,aB as f,aW as ye,M as E,P as z,be as Ce,bm as Ve,B as Pe,a$ as Ie,E as ge,aD as Ae,F as Se,bn as L,aE as p}from"./index-DhXuRan5.js";const O=Symbol.for("vuetify:v-chip-group"),Be=w({column:Boolean,filter:Boolean,valueComparator:{type:Function,default:ne},...te(),...j(),...le({selectedClass:"v-chip--selected"}),...M(),...$(),...T({variant:"tonal"})},"VChipGroup"),xe=R()({name:"VChipGroup",props:Be(),emits:{"update:modelValue":e=>!0},setup(e,k){let{slots:c}=k;const{themeClasses:o}=F(e),{isSelected:t,select:m,next:b,prev:h,selected:y}=U(e,O);return ee({VChip:{color:r(e,"color"),disabled:r(e,"disabled"),filter:r(e,"filter"),variant:r(e,"variant")}}),ae(()=>{const C=x.filterProps(e);return l(x,P(C,{class:["v-chip-group",{"v-chip-group--column":e.column},o.value,e.class],style:e.style}),{default:()=>{var u;return[(u=c.default)==null?void 0:u.call(c,{isSelected:t,select:m,next:b,prev:h,selected:y.value})]}})}),{}}}),Ge=w({activeClass:String,appendAvatar:String,appendIcon:p,closable:Boolean,closeIcon:{type:p,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},draggable:Boolean,filter:Boolean,filterIcon:{type:p,default:"$complete"},label:Boolean,link:{type:Boolean,default:void 0},pill:Boolean,prependAvatar:String,prependIcon:p,ripple:{type:[Boolean,Object],default:!0},text:String,modelValue:{type:Boolean,default:!0},onClick:L(),onClickOnce:L(),...Se(),...j(),...Ae(),...ge(),...Ie(),...Pe(),...Ve(),...Ce(),...M({tag:"span"}),...$(),...T({variant:"tonal"})},"VChip"),De=R()({name:"VChip",directives:{Ripple:se},props:Ge(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0,"group:selected":e=>!0,click:e=>!0},setup(e,k){let{attrs:c,emit:o,slots:t}=k;const{t:m}=ie(),{borderClasses:b}=ce(e),{colorClasses:h,colorStyles:y,variantClasses:C}=de(e),{densityClasses:u}=oe(e),{elevationClasses:q}=ue(e),{roundedClasses:K}=re(e),{sizeClasses:Z}=ve(e),{themeClasses:N}=F(e),I=fe(e,"modelValue"),a=pe(e,O,!1),s=ke(e,c),W=V(()=>e.link!==!1&&s.isLink.value),i=V(()=>!e.disabled&&e.link!==!1&&(!!a||e.link||s.isClickable.value)),X=V(()=>({"aria-label":m(e.closeLabel),onClick(n){n.preventDefault(),n.stopPropagation(),I.value=!1,o("click:close",n)}}));function g(n){var d;o("click",n),i.value&&((d=s.navigate)==null||d.call(s,n),a==null||a.toggle())}function Y(n){(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),g(n))}return()=>{var G;const n=s.isLink.value?"a":e.tag,d=!!(e.appendIcon||e.appendAvatar),H=!!(d||t.append),J=!!(t.close||e.closable),A=!!(t.filter||e.filter)&&a,S=!!(e.prependIcon||e.prependAvatar),Q=!!(S||t.prepend),B=!a||a.isSelected.value;return I.value&&D(l(n,P({class:["v-chip",{"v-chip--disabled":e.disabled,"v-chip--label":e.label,"v-chip--link":i.value,"v-chip--filter":A,"v-chip--pill":e.pill,[`${e.activeClass}`]:e.activeClass&&((G=s.isActive)==null?void 0:G.value)},N.value,b.value,B?h.value:void 0,u.value,q.value,K.value,Z.value,C.value,a==null?void 0:a.selectedClass.value,e.class],style:[B?y.value:void 0,e.style],disabled:e.disabled||void 0,draggable:e.draggable,tabindex:i.value?0:void 0,onClick:g,onKeydown:i.value&&!W.value&&Y},s.linkProps),{default:()=>{var _;return[be(i.value,"v-chip"),A&&l(he,{key:"filter"},{default:()=>[D(l("div",{class:"v-chip__filter"},[t.filter?l(f,{key:"filter-defaults",disabled:!e.filterIcon,defaults:{VIcon:{icon:e.filterIcon}}},t.filter):l(v,{key:"filter-icon",icon:e.filterIcon},null)]),[[ye,a.isSelected.value]])]}),Q&&l("div",{key:"prepend",class:"v-chip__prepend"},[t.prepend?l(f,{key:"prepend-defaults",disabled:!S,defaults:{VAvatar:{image:e.prependAvatar,start:!0},VIcon:{icon:e.prependIcon,start:!0}}},t.prepend):l(E,null,[e.prependIcon&&l(v,{key:"prepend-icon",icon:e.prependIcon,start:!0},null),e.prependAvatar&&l(z,{key:"prepend-avatar",image:e.prependAvatar,start:!0},null)])]),l("div",{class:"v-chip__content","data-no-activator":""},[((_=t.default)==null?void 0:_.call(t,{isSelected:a==null?void 0:a.isSelected.value,selectedClass:a==null?void 0:a.selectedClass.value,select:a==null?void 0:a.select,toggle:a==null?void 0:a.toggle,value:a==null?void 0:a.value.value,disabled:e.disabled}))??e.text]),H&&l("div",{key:"append",class:"v-chip__append"},[t.append?l(f,{key:"append-defaults",disabled:!d,defaults:{VAvatar:{end:!0,image:e.appendAvatar},VIcon:{end:!0,icon:e.appendIcon}}},t.append):l(E,null,[e.appendIcon&&l(v,{key:"append-icon",end:!0,icon:e.appendIcon},null),e.appendAvatar&&l(z,{key:"append-avatar",end:!0,image:e.appendAvatar},null)])]),J&&l("button",P({key:"close",class:"v-chip__close",type:"button","data-testid":"close-chip"},X.value),[t.close?l(f,{key:"close-defaults",defaults:{VIcon:{icon:e.closeIcon,size:"x-small"}}},t.close):l(v,{key:"close-icon",icon:e.closeIcon,size:"x-small"},null)])]}}),[[me("ripple"),i.value&&e.ripple,null]])}}});export{De as V,xe as a};
