import{_ as d,a as p}from"./Recaptcha-B5LdDpLL.js";import{_,H as u,G as x,r as w,o as v,e as y,K as l,a as e,w as t,ae as V,M as n,P as R,R as C}from"./index-BnvqqMZd.js";import{e as k}from"./accountService-BeakhGbI.js";import{V as c,a as r}from"./VRow-BwbxZAC3.js";import{V as b}from"./VForm-Coj3r0I6.js";import"./VDialog-DbnxLkRG.js";import"https://static.geetest.com/v4/gt4.js";/* empty css              */const B={components:{LoadingDialog:d,Recaptcha:p},data(){return{BASE_API:"https://zerocat-api.houlangs.com",email:"",tryinguser:{},loading:!1,emailRules:[a=>a?!0:"必须填写邮箱",a=>/.+@.+\..+/.test(a)?!0:"不符合格式"],usernameRules:[a=>a?!0:"必须填写用户名"]}},created(){u.isLogin.value==!0&&this.$router.push("/")},setup(){x({title:"找回密码"})},methods:{async retrievePassword(){this.loading=!0;try{await this.$nextTick();const a=await k({captcha:this.$refs.recaptcha.getResponse(),un:this.email});this.tryinguser=a.data,this.tryinguser.message!="OK"?this.$toast.add({severity:"info",summary:"info",detail:this.tryinguser.msg||this.tryinguser.message,life:3e3}):(u.setUser(this.tryinguser.token),this.$router.push("/"))}catch(a){this.$toast.add({severity:"error",summary:"错误",detail:a.message,life:3e3})}finally{this.loading=!1}}}},P={class:"auth-wrapper d-flex align-center justify-center pa-4"};function $(a,s,z,F,o,m){const i=w("v-cardtext"),f=p,h=d;return v(),y(C,null,[l("div",P,[e(R,{class:"auth-card pa-4 pt-7","max-width":"448",border:"",rounded:"lg"},{default:t(()=>[e(c,null,{default:t(()=>[e(r,{cols:"12"},{default:t(()=>[e(i,null,{default:t(()=>s[1]||(s[1]=[l("h5",{class:"text-h5 font-weight-semibold mb-1"}," 欢迎来到ZeroCatNext！ 👋🏻 ",-1),l("p",{class:"mb-0"},"找回密码",-1)])),_:1})]),_:1})]),_:1}),e(i,null,{default:t(()=>[e(b,null,{default:t(()=>[e(c,null,{default:t(()=>[e(r,{cols:"12"},{default:t(()=>[e(V,{label:"邮箱",type:"text",modelValue:o.email,"onUpdate:modelValue":s[0]||(s[0]=g=>o.email=g),variant:"outlined",rules:o.emailRules},null,8,["modelValue","rules"])]),_:1}),e(r,{cols:"9"},{default:t(()=>[e(f,{ref:"recaptcha",recaptchaId:"recaptcha-div"},null,512)]),_:1}),e(r,{cols:"12"},{default:t(()=>[e(n,{class:"text-none",color:"primary",rounded:"xl",text:"找回密码",variant:"flat",size:"large",onClick:m.retrievePassword,"append-icon":"mdi-arrow-right"},null,8,["onClick"])]),_:1}),e(r,{cols:"12"},{default:t(()=>[e(n,{class:"text-none",color:"white",rounded:"xl",text:"登录",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/login"}),e(n,{class:"text-none",color:"white",rounded:"xl",text:"注册",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/register"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),e(h,{show:o.loading,text:"正在发送邮件"},null,8,["show"])],64)}const T=_(B,[["render",$]]);export{T as default};
