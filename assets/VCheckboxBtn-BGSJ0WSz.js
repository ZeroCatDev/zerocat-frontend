import{m as V,V as o}from"./VSelectionControl-dmOrAC2P.js";import{p as f,aR as k,i as v,ai as c,al as l,k as I,ag as x,a as h,a6 as b}from"./index-C840rCbu.js";const C=f({indeterminate:Boolean,indeterminateIcon:{type:k,default:"$checkboxIndeterminate"},...V({falseIcon:"$checkboxOff",trueIcon:"$checkboxOn"})},"VCheckboxBtn"),y=v()({name:"VCheckboxBtn",props:C(),emits:{"update:modelValue":e=>!0,"update:indeterminate":e=>!0},setup(e,r){let{slots:s}=r;const t=c(e,"indeterminate"),a=c(e,"modelValue");function u(n){t.value&&(t.value=!1)}const i=l(()=>t.value?e.indeterminateIcon:e.falseIcon),m=l(()=>t.value?e.indeterminateIcon:e.trueIcon);return I(()=>{const n=x(o.filterProps(e),["modelValue"]);return h(o,b(n,{modelValue:a.value,"onUpdate:modelValue":[d=>a.value=d,u],class:["v-checkbox-btn",e.class],style:e.style,type:"checkbox",falseIcon:i.value,trueIcon:m.value,"aria-checked":t.value?"mixed":void 0}),s)}),{}}});export{y as V,C as m};
