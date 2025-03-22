import{f as R,p as T,l as F,aM as J,a4 as ee,t as r,i as ae,aN as D,a as l,ak as P,aO as M,z as O,A as $,aP as le,k as w,aQ as te,aR as ne,aS as se,aT as ie,q as ce,aU as de,a2 as oe,s as ue,y as re,U as ve,az as fe,aV as pe,aW as ke,a5 as V,aX as x,aY as me,aZ as ye,a_ as he,W as v,X as f,a$ as Ce,M as z,P as E,O as be,Y as Ve,b0 as Pe,B as Ie,b1 as ge,E as Se,a6 as Ae,F as Be,b2 as L,Z as p}from"./index-B-pwE892.js";const N=Symbol.for("vuetify:v-chip-group"),Ge=T({column:Boolean,filter:Boolean,valueComparator:{type:Function,default:ne},...te(),...w(),...le({selectedClass:"v-chip--selected"}),...$(),...O(),...M({variant:"tonal"})},"VChipGroup"),xe=R()({name:"VChipGroup",props:Ge(),emits:{"update:modelValue":e=>!0},setup(e,k){let{slots:c}=k;const{themeClasses:o}=F(e),{isSelected:t,select:m,next:y,prev:h,selected:C}=J(e,N);return ee({VChip:{color:r(e,"color"),disabled:r(e,"disabled"),filter:r(e,"filter"),variant:r(e,"variant")}}),ae(()=>{const b=D.filterProps(e);return l(D,P(b,{class:["v-chip-group",{"v-chip-group--column":e.column},o.value,e.class],style:e.style}),{default:()=>{var u;return[(u=c.default)==null?void 0:u.call(c,{isSelected:t,select:m,next:y,prev:h,selected:C.value})]}})}),{}}}),_e=T({activeClass:String,appendAvatar:String,appendIcon:p,closable:Boolean,closeIcon:{type:p,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},draggable:Boolean,filter:Boolean,filterIcon:{type:p,default:"$complete"},label:Boolean,link:{type:Boolean,default:void 0},pill:Boolean,prependAvatar:String,prependIcon:p,ripple:{type:[Boolean,Object],default:!0},text:{type:[String,Number,Boolean],default:void 0},modelValue:{type:Boolean,default:!0},onClick:L(),onClickOnce:L(),...Be(),...w(),...Ae(),...Se(),...ge(),...Ie(),...Pe(),...Ve(),...$({tag:"span"}),...O(),...M({variant:"tonal"})},"VChip"),ze=R()({name:"VChip",directives:{Ripple:se},props:_e(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0,"group:selected":e=>!0,click:e=>!0},setup(e,k){let{attrs:c,emit:o,slots:t}=k;const{t:m}=ie(),{borderClasses:y}=ce(e),{colorClasses:h,colorStyles:C,variantClasses:b}=de(e),{densityClasses:u}=oe(e),{elevationClasses:X}=ue(e),{roundedClasses:q}=re(e),{sizeClasses:K}=ve(e),{themeClasses:U}=F(e),I=fe(e,"modelValue"),a=pe(e,N,!1),s=ke(e,c),W=V(()=>e.link!==!1&&s.isLink.value),i=V(()=>!e.disabled&&e.link!==!1&&(!!a||e.link||s.isClickable.value)),Y=V(()=>({"aria-label":m(e.closeLabel),onClick(n){n.preventDefault(),n.stopPropagation(),I.value=!1,o("click:close",n)}}));function g(n){var d;o("click",n),i.value&&((d=s.navigate)==null||d.call(s,n),a==null||a.toggle())}function Z(n){(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),g(n))}return()=>{var G;const n=s.isLink.value?"a":e.tag,d=!!(e.appendIcon||e.appendAvatar),j=!!(d||t.append),Q=!!(t.close||e.closable),S=!!(t.filter||e.filter)&&a,A=!!(e.prependIcon||e.prependAvatar),H=!!(A||t.prepend),B=!a||a.isSelected.value;return I.value&&x(l(n,P({class:["v-chip",{"v-chip--disabled":e.disabled,"v-chip--label":e.label,"v-chip--link":i.value,"v-chip--filter":S,"v-chip--pill":e.pill,[`${e.activeClass}`]:e.activeClass&&((G=s.isActive)==null?void 0:G.value)},U.value,y.value,B?h.value:void 0,u.value,X.value,q.value,K.value,b.value,a==null?void 0:a.selectedClass.value,e.class],style:[B?C.value:void 0,e.style],disabled:e.disabled||void 0,draggable:e.draggable,tabindex:i.value?0:void 0,onClick:g,onKeydown:i.value&&!W.value&&Z},s.linkProps),{default:()=>{var _;return[ye(i.value,"v-chip"),S&&l(he,{key:"filter"},{default:()=>[x(l("div",{class:"v-chip__filter"},[t.filter?l(f,{key:"filter-defaults",disabled:!e.filterIcon,defaults:{VIcon:{icon:e.filterIcon}}},t.filter):l(v,{key:"filter-icon",icon:e.filterIcon},null)]),[[Ce,a.isSelected.value]])]}),H&&l("div",{key:"prepend",class:"v-chip__prepend"},[t.prepend?l(f,{key:"prepend-defaults",disabled:!A,defaults:{VAvatar:{image:e.prependAvatar,start:!0},VIcon:{icon:e.prependIcon,start:!0}}},t.prepend):l(z,null,[e.prependIcon&&l(v,{key:"prepend-icon",icon:e.prependIcon,start:!0},null),e.prependAvatar&&l(E,{key:"prepend-avatar",image:e.prependAvatar,start:!0},null)])]),l("div",{class:"v-chip__content","data-no-activator":""},[((_=t.default)==null?void 0:_.call(t,{isSelected:a==null?void 0:a.isSelected.value,selectedClass:a==null?void 0:a.selectedClass.value,select:a==null?void 0:a.select,toggle:a==null?void 0:a.toggle,value:a==null?void 0:a.value.value,disabled:e.disabled}))??be(e.text)]),j&&l("div",{key:"append",class:"v-chip__append"},[t.append?l(f,{key:"append-defaults",disabled:!d,defaults:{VAvatar:{end:!0,image:e.appendAvatar},VIcon:{end:!0,icon:e.appendIcon}}},t.append):l(z,null,[e.appendIcon&&l(v,{key:"append-icon",end:!0,icon:e.appendIcon},null),e.appendAvatar&&l(E,{key:"append-avatar",end:!0,image:e.appendAvatar},null)])]),Q&&l("button",P({key:"close",class:"v-chip__close",type:"button","data-testid":"close-chip"},Y.value),[t.close?l(f,{key:"close-defaults",defaults:{VIcon:{icon:e.closeIcon,size:"x-small"}}},t.close):l(v,{key:"close-icon",icon:e.closeIcon,size:"x-small"},null)])]}}),[[me("ripple"),i.value&&e.ripple,null]])}}});export{ze as V,xe as a};
