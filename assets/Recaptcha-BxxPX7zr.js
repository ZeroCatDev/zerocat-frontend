import{_ as r,o as i,c as u,w as o,a,a2 as _,Q as h,K as c,Y as g,at as m,e as f,L as w,M as V}from"./index-BAFO42Kr.js";import{V as x}from"./VDialog-BzcsYJtl.js";import"https://static.geetest.com/v4/gt4.js";const y={props:{show:{type:Boolean,default:!1},text:{type:String,default:"加载中"}},watch:{show(e){this.loading=e},text(e){this.text=e}}},C={class:"pe-4"};function $(e,t,s,l,d,n){return i(),u(x,{modelValue:this.show,"onUpdate:modelValue":t[0]||(t[0]=p=>this.show=p),"max-width":"320",persistent:""},{default:o(()=>[a(_,{class:"py-2",color:"primary",elevation:"12",rounded:"lg"},{default:o(()=>[a(h,{"prepend-icon":"mdi-plus-circle",title:s.text},{prepend:o(()=>[c("div",C,[a(g,{color:"primary",size:"x-large"})])]),append:o(()=>[a(m,{color:"primary",indeterminate:"disable-shrink",size:"16",width:"2"})]),_:1},8,["title"])]),_:1})]),_:1},8,["modelValue"])}const E=r(y,[["render",$]]),k={props:{recaptchaId:{type:String,required:!0},product:{type:String,default:"popup"}},mounted(){this.initRecaptcha()},methods:{initRecaptcha(){console.log("1cf35895f55079736b4140971e20d367"),initGeetest4({captchaId:"1cf35895f55079736b4140971e20d367",product:this.product},e=>{window.gt4=e,e.appendTo(`#${this.recaptchaId}`),e.onReady(()=>{console.log("Challenge Ready")}).onSuccess(()=>{console.log("Challenge Success")}).onError(()=>{console.log("Challenge Error")})})},resetCaptcha(){window.gt4.reset()},getResponse(){return window.gt4.getValidate()}}},B=["id"];function I(e,t,s,l,d,n){return i(),f("div",null,[c("div",{id:s.recaptchaId},null,8,B),a(V,{onClick:n.resetCaptcha,variant:"text"},{default:o(()=>t[0]||(t[0]=[w("刷新")])),_:1},8,["onClick"])])}const L=r(k,[["render",I]]);export{E as _,L as a};
