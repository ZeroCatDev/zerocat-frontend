import{m as A,V as t}from"./VCheckboxBtn-Gefif7br.js";import{p as F,am as I,ae as B,i as U,ag as R,an as j,ai as D,aj as M,k as N,ao as $,ap as l,a as u,a6 as r}from"./index-D3tnyKYg.js";const q=F({...I(),...B(A(),["inline"])},"VCheckbox"),E=U()({name:"VCheckbox",inheritAttrs:!1,props:q(),emits:{"update:modelValue":e=>!0,"update:focused":e=>!0},setup(e,d){let{attrs:c,slots:o}=d;const a=R(e,"modelValue"),{isFocused:n,focus:i,blur:m}=j(e),V=D(),p=M(()=>e.id||`checkbox-${V}`);return N(()=>{const[b,k]=$(c),v=l.filterProps(e),f=t.filterProps(e);return u(l,r({class:["v-checkbox",e.class]},b,v,{modelValue:a.value,"onUpdate:modelValue":s=>a.value=s,id:p.value,focused:n.value,style:e.style}),{...o,default:s=>{let{id:x,messagesId:h,isDisabled:P,isReadonly:C,isValid:y}=s;return u(t,r(f,{id:x.value,"aria-describedby":h.value,disabled:P.value,readonly:C.value},k,{error:y.value===!1,modelValue:a.value,"onUpdate:modelValue":g=>a.value=g,onFocus:i,onBlur:m}),o)}})}),{}}});export{E as V};
