import{_ as m}from"./LoadingDialog-CS62Ijs4.js";import{_ as x,I as h,H as _,G as v,J as w,r as V,o as y,e as C,L as n,a as e,w as t,Z as k,N as s,O as R,S as b}from"./index-BdsR-OvF.js";import"https://static.geetest.com/v4/gt4.js";import{i as d,g as c,r as z}from"./useRecaptcha-D4VPpSaq.js";import{V as p,a as o}from"./VRow-CZVqkHgj.js";import{V as B}from"./VForm-JgxC_AJL.js";import{V as N}from"./VCard-hQXYYU3_.js";import"./VDialog-RM23oh7H.js";/* empty css              */const F={components:{LoadingDialog:m},data(){return{BASE_API:"https://zerocat-api.houlangs.com",email:"",tryinguser:{},loading:!1,initRecaptcha:d,getResponse:c,resetCaptcha:z,show1:h(!1),emailRules:[r=>r?!0:"必须填写邮箱",r=>/.+@.+\..+/.test(r)?!0:"不符合格式"],usernameRules:[r=>r?!0:"必须填写用户名"]}},created(){_.islogin.value==!0&&this.$router.push("/"),v({title:"魔术链接"})},setup(){d("recaptcha-div","popup")},methods:{async login(){if(this.loading=!0,this.tryinguser=await w({url:"/account/magiclink/generate",method:"post",data:{captcha:c(),email:this.email}}),this.tryinguser.message!="OK"){this.loading=!1,this.$toast.add({severity:"info",summary:"info",detail:this.tryinguser.message,life:3e3});return}this.loading=!1}}},I={class:"auth-wrapper d-flex align-center justify-center pa-4"};function L(r,a,A,D,l,f){const i=V("v-cardtext"),g=m;return y(),C(b,null,[n("div",I,[e(N,{class:"auth-card pa-4 pt-7","max-width":"448",border:""},{default:t(()=>[e(p,null,{default:t(()=>[e(o,{cols:"12"},{default:t(()=>[e(i,null,{default:t(()=>a[2]||(a[2]=[n("h5",{class:"text-h5 font-weight-semibold mb-1"}," 欢迎来到ZeroCatNext！ 👋🏻 ",-1),n("p",{class:"mb-0"},"登录你的账户",-1)])),_:1})]),_:1})]),_:1}),e(i,null,{default:t(()=>[e(B,null,{default:t(()=>[e(p,null,{default:t(()=>[e(o,{cols:"12"},{default:t(()=>[e(k,{label:"邮箱",type:"text",modelValue:l.email,"onUpdate:modelValue":a[0]||(a[0]=u=>l.email=u),variant:"outlined",rules:l.emailRules},null,8,["modelValue","rules"])]),_:1}),e(o,{cols:"9"},{default:t(()=>a[3]||(a[3]=[n("div",{id:"recaptcha-div"},null,-1)])),_:1}),e(o,{cols:"3"},{default:t(()=>[e(s,{onClick:a[1]||(a[1]=u=>l.resetCaptcha()),variant:"text"},{default:t(()=>a[4]||(a[4]=[R("刷新")])),_:1})]),_:1}),e(o,{cols:"12"},{default:t(()=>[e(s,{class:"text-none",color:"primary",rounded:"xl",text:"发送验证链接",variant:"flat",size:"large",onClick:f.login,"append-icon":"mdi-arrow-right"},null,8,["onClick"])]),_:1}),e(o,{cols:"12"},{default:t(()=>[e(s,{class:"text-none",color:"white",rounded:"xl",text:"密码登录",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/account/login"}),e(s,{class:"text-none",color:"white",rounded:"xl",text:"注册",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/account/register"}),e(s,{class:"text-none",color:"white",rounded:"xl",text:"找回密码",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/account/retrieve"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),e(g,{show:l.loading,text:"登录中"},null,8,["show"])],64)}const K=x(F,[["render",L]]);export{K as default};