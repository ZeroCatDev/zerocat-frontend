import{V as t,m as g}from"./VCheckboxBtn-Dw4XQcLW.js";import{f as B,p as F,ar as I,ay as U,at as R,au as w,i as z,az as D,aA as l,a as u,a6 as r,aw as M,aB as N}from"./index-DYuxtcPw.js";const $=F({...N(),...M(g(),["inline"])},"VCheckbox"),E=B()({name:"VCheckbox",inheritAttrs:!1,props:$(),emits:{"update:modelValue":e=>!0,"update:focused":e=>!0},setup(e,d){let{attrs:c,slots:o}=d;const a=I(e,"modelValue"),{isFocused:n,focus:i,blur:m}=U(e),V=R(),p=w(()=>e.id||`checkbox-${V}`);return z(()=>{const[b,f]=D(c),v=l.filterProps(e),k=t.filterProps(e);return u(l,r({class:["v-checkbox",e.class]},b,v,{modelValue:a.value,"onUpdate:modelValue":s=>a.value=s,id:p.value,focused:n.value,style:e.style}),{...o,default:s=>{let{id:x,messagesId:h,isDisabled:P,isReadonly:y,isValid:C}=s;return u(t,r(k,{id:x.value,"aria-describedby":h.value,disabled:P.value,readonly:y.value},f,{error:C.value===!1,modelValue:a.value,"onUpdate:modelValue":A=>a.value=A,onFocus:i,onBlur:m}),o)}})}),{}}});export{E as V};
