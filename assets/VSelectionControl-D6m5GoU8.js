import{p as h,al as G,bo as z,m as U,am as H,x as Q,i as R,a6 as _,a8 as j,a9 as o,bc as Z,bP as J,bg as K,A as u,k as q,a as v,b8 as W,aO as T,I as X,aB as Y,aa as w,ay as p,b9 as ee,T as le,Z as ae,aD as te,b6 as ne,ap as oe,aQ as I,aq as ue,z as ie,b2 as re,aU as ce}from"./index-ClYup7uH.js";const E=Symbol.for("vuetify:selection-control-group"),L=h({color:String,disabled:{type:Boolean,default:null},defaultsTarget:String,error:Boolean,id:String,inline:Boolean,falseIcon:G,trueIcon:G,ripple:{type:[Boolean,Object],default:!0},multiple:{type:Boolean,default:null},name:String,readonly:{type:Boolean,default:null},modelValue:null,type:String,valueComparator:{type:Function,default:z},...U(),...H(),...Q()},"SelectionControlGroup"),se=h({...L({defaultsTarget:"VSelectionControl"})},"VSelectionControlGroup"),me=R()({name:"VSelectionControlGroup",props:se(),emits:{"update:modelValue":e=>!0},setup(e,i){let{slots:f}=i;const l=_(e,"modelValue"),t=j(),y=o(()=>e.id||`v-selection-control-group-${t}`),c=o(()=>e.name||y.value),a=new Set;return Z(E,{modelValue:l,forceUpdate:()=>{a.forEach(n=>n())},onForceUpdate:n=>{a.add(n),J(()=>{a.delete(n)})}}),K({[e.defaultsTarget]:{color:u(e,"color"),disabled:u(e,"disabled"),density:u(e,"density"),error:u(e,"error"),inline:u(e,"inline"),modelValue:l,multiple:o(()=>!!e.multiple||e.multiple==null&&Array.isArray(l.value)),name:c,falseIcon:u(e,"falseIcon"),trueIcon:u(e,"trueIcon"),readonly:u(e,"readonly"),ripple:u(e,"ripple"),type:u(e,"type"),valueComparator:u(e,"valueComparator")}}),q(()=>{var n;return v("div",{class:["v-selection-control-group",{"v-selection-control-group--inline":e.inline},e.class],style:e.style,role:e.type==="radio"?"radiogroup":void 0},[(n=f.default)==null?void 0:n.call(f)])}),{}}}),de=h({label:String,baseColor:String,trueValue:null,falseValue:null,value:null,...U(),...L()},"VSelectionControl");function ve(e){const i=ne(E,void 0),{densityClasses:f}=oe(e),l=_(e,"modelValue"),t=o(()=>e.trueValue!==void 0?e.trueValue:e.value!==void 0?e.value:!0),y=o(()=>e.falseValue!==void 0?e.falseValue:!1),c=o(()=>!!e.multiple||e.multiple==null&&Array.isArray(l.value)),a=o({get(){const m=i?i.modelValue.value:l.value;return c.value?I(m).some(r=>e.valueComparator(r,t.value)):e.valueComparator(m,t.value)},set(m){if(e.readonly)return;const r=m?t.value:y.value;let b=r;c.value&&(b=m?[...I(l.value),r]:I(l.value).filter(s=>!e.valueComparator(s,t.value))),i?i.modelValue.value=b:l.value=b}}),{textColorClasses:n,textColorStyles:C}=ue(o(()=>{if(!(e.error||e.disabled))return a.value?e.color:e.baseColor})),{backgroundColorClasses:V,backgroundColorStyles:g}=ie(o(()=>a.value&&!e.error&&!e.disabled?e.color:e.baseColor)),k=o(()=>a.value?e.trueIcon:e.falseIcon);return{group:i,densityClasses:f,trueValue:t,falseValue:y,model:a,textColorClasses:n,textColorStyles:C,backgroundColorClasses:V,backgroundColorStyles:g,icon:k}}const be=R()({name:"VSelectionControl",directives:{Ripple:W},inheritAttrs:!1,props:de(),emits:{"update:modelValue":e=>!0},setup(e,i){let{attrs:f,slots:l}=i;const{group:t,densityClasses:y,icon:c,model:a,textColorClasses:n,textColorStyles:C,backgroundColorClasses:V,backgroundColorStyles:g,trueValue:k}=ve(e),m=j(),r=T(!1),b=T(!1),s=X(),S=o(()=>e.id||`input-${m}`),x=o(()=>!e.disabled&&!e.readonly);t==null||t.onForceUpdate(()=>{s.value&&(s.value.checked=a.value)});function A(d){x.value&&(r.value=!0,re(d.target,":focus-visible")!==!1&&(b.value=!0))}function B(){r.value=!1,b.value=!1}function M(d){d.stopPropagation()}function N(d){if(!x.value){s.value&&(s.value.checked=a.value);return}e.readonly&&t&&ce(()=>t.forceUpdate()),a.value=d.target.checked}return q(()=>{var F,D;const d=l.label?l.label({label:e.label,props:{for:S.value}}):e.label,[O,$]=Y(f),P=v("input",w({ref:s,checked:a.value,disabled:!!e.disabled,id:S.value,onBlur:B,onFocus:A,onInput:N,"aria-disabled":!!e.disabled,"aria-label":e.label,type:e.type,value:k.value,name:e.name,"aria-checked":e.type==="checkbox"?a.value:void 0},$),null);return v("div",w({class:["v-selection-control",{"v-selection-control--dirty":a.value,"v-selection-control--disabled":e.disabled,"v-selection-control--error":e.error,"v-selection-control--focused":r.value,"v-selection-control--focus-visible":b.value,"v-selection-control--inline":e.inline},y.value,e.class]},O,{style:e.style}),[v("div",{class:["v-selection-control__wrapper",n.value],style:C.value},[(F=l.default)==null?void 0:F.call(l,{backgroundColorClasses:V,backgroundColorStyles:g}),p(v("div",{class:["v-selection-control__input"]},[((D=l.input)==null?void 0:D.call(l,{model:a,textColorClasses:n,textColorStyles:C,backgroundColorClasses:V,backgroundColorStyles:g,inputNode:P,icon:c.value,props:{onFocus:A,onBlur:B,id:S.value}}))??v(le,null,[c.value&&v(ae,{key:"icon",icon:c.value},null),P])]),[[ee("ripple"),e.ripple&&[!e.disabled&&!e.readonly,null,["center","circle"]]]])]),d&&v(te,{for:S.value,onClick:M},{default:()=>[d]})])}),{isFocused:r,input:s}}});export{be as V,L as a,me as b,de as m};