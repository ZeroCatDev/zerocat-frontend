import{_ as V}from"./LoadingDialog-F7qiAwBC.js";import{_ as C}from"./Recaptcha-BboydaJW.js";import{_ as b,r as k,e as g,o as h,G as p,a as s,w as n,c as R,a9 as T,aa as w,H as d,a4 as m,M as y,I as l,O as E,K as L,S as u,Q as v,T as I,R as N}from"./index-BdaES3fA.js";import{l as U}from"./accountService-BdoTGrvJ.js";import{V as x,a as r}from"./VRow-BfjfnaVU.js";import{V as W}from"./VForm-Drvvnbox.js";import"./VDialog-BXzpU_p3.js";import"https://static.geetest.com/v4/gt4.js";/* empty css              */const z={components:{LoadingDialog:V,Recaptcha:C},data(){return{BASE_API:"https://zerocat-api.houlangs.com",username:"",password:"",verificationCode:"",loginType:"password",countdown:0,tryinguser:{},loading:!1,localuser:u,show1:N(!1),rules:{required:e=>!!e||"此字段为必填项",length:e=>(e==null?void 0:e.length)===6||"验证码必须是6位数字"},emailRules:[e=>e?!0:"必须填写邮箱",e=>/.+@.+\..+/.test(e)?!0:"不符合格式"],usernameRules:[e=>e?!0:"必须填写密码"]}},created(){u.isLogin.value===!0&&this.$router.push("/")},setup(){I({title:"登录"})},methods:{async handleLogin(){this.loginType==="password"?await this.loginWithPassword():await this.loginWithCode()},async loginWithPassword(){this.loading=!0;try{const e=await U({captcha:this.$refs.recaptcha.getResponse(),un:this.username,pw:this.password});this.handleLoginResponse(e)}catch(e){this.handleError(e)}finally{this.loading=!1}},async loginWithCode(){if(!this.verificationCode||this.verificationCode.length!==6){this.$toast.add({severity:"error",summary:"错误",detail:"请输入6位验证码",life:3e3});return}this.loading=!0;try{const e=await v.post("/account/login-with-code",{email:this.username,code:this.verificationCode});this.handleLoginResponse(e)}catch(e){this.handleError(e)}finally{this.loading=!1}},async sendVerificationCode(){if(!(this.countdown>0)){if(!this.username||!/.+@.+\..+/.test(this.username)){this.$toast.add({severity:"error",summary:"错误",detail:"请输入正确的邮箱地址",life:3e3});return}this.$refs.recaptcha.showBindCaptcha()}},async handleBindVerified(e){this.loading=!0;try{const t=await v.post("/account/send-login-code",{email:this.username,captcha:e});t.data.status==="success"?(this.$toast.add({severity:"success",summary:"成功",detail:"验证码已发送",life:3e3}),this.startCountdown()):this.$toast.add({severity:"error",summary:"错误",detail:t.data.message,life:3e3})}catch(t){this.handleError(t)}finally{this.loading=!1}},handleBindError(){this.$toast.add({severity:"error",summary:"错误",detail:"验证失败，请重试",life:3e3})},handleBindClose(){},startCountdown(){this.countdown=60;const e=setInterval(()=>{this.countdown--,this.countdown<=0&&clearInterval(e)},1e3)},async handleLoginResponse(e){this.tryinguser=e.data,this.tryinguser.status==="success"?(await u.setUser(this.tryinguser.token),this.$router.push("/")):this.$toast.add({severity:"info",summary:"info",detail:this.tryinguser.message,life:3e3})},handleError(e){var t,c;this.$toast.add({severity:"error",summary:"错误",detail:((c=(t=e.response)==null?void 0:t.data)==null?void 0:c.message)||e.message,life:3e3})},loginWithOAuth(e){const t=u.getToken();window.location.href=`https://zerocat-api.houlangs.com/account/oauth/${e}?token=${t}`}}},A={class:"auth-wrapper d-flex align-center justify-center pa-4"};function D(e,t,c,F,o,i){const f=k("v-cardtext"),_=C,B=V;return h(),g(y,null,[p("div",A,[s(L,{class:"auth-card pa-4 pt-7","max-width":"448",border:"",rounded:"lg"},{default:n(()=>[s(x,null,{default:n(()=>[s(r,{cols:"12"},{default:n(()=>[s(f,null,{default:n(()=>t[6]||(t[6]=[p("h5",{class:"text-h5 font-weight-semibold mb-1"}," 欢迎来到ZeroCatNext！ 👋🏻 ",-1),p("p",{class:"mb-0"},"登录你的账户",-1)])),_:1})]),_:1})]),_:1}),s(f,null,{default:n(()=>[s(W,null,{default:n(()=>[s(x,null,{default:n(()=>[s(r,{cols:"12"},{default:n(()=>[s(T,{modelValue:o.loginType,"onUpdate:modelValue":t[0]||(t[0]=a=>o.loginType=a),class:"mb-4"},{default:n(()=>[s(w,{value:"password",variant:"text"},{default:n(()=>t[7]||(t[7]=[d("密码登录")])),_:1}),s(w,{value:"code",variant:"text"},{default:n(()=>t[8]||(t[8]=[d("验证码登录")])),_:1})]),_:1},8,["modelValue"]),s(m,{label:"邮箱",type:"text",modelValue:o.username,"onUpdate:modelValue":t[1]||(t[1]=a=>o.username=a),variant:"outlined",rules:o.emailRules},null,8,["modelValue","rules"]),o.loginType==="password"?(h(),R(m,{key:0,label:"密码",modelValue:o.password,"onUpdate:modelValue":t[2]||(t[2]=a=>o.password=a),variant:"outlined",rules:o.usernameRules,"append-icon":o.show1?"mdi-eye":"mdi-eye-off",type:o.show1?"text":"password","onClick:append":t[3]||(t[3]=a=>o.show1=!o.show1)},null,8,["modelValue","rules","append-icon","type"])):(h(),g(y,{key:1},[s(m,{modelValue:o.verificationCode,"onUpdate:modelValue":t[4]||(t[4]=a=>o.verificationCode=a),label:"验证码",variant:"outlined",maxlength:"6",rules:[o.rules.required,o.rules.length]},null,8,["modelValue","rules"]),s(l,{class:"mb-4",variant:"text",onClick:i.sendVerificationCode,disabled:o.countdown>0},{default:n(()=>[d(E(o.countdown>0?`${o.countdown}秒后重新发送`:"发送验证码"),1)]),_:1},8,["onClick","disabled"])],64))]),_:1}),s(r,{cols:"9"},{default:n(()=>[s(_,{ref:"recaptcha",recaptchaId:"recaptcha-div",showNormal:o.loginType==="password",onBindVerified:i.handleBindVerified,onBindError:i.handleBindError,onBindClose:i.handleBindClose},null,8,["showNormal","onBindVerified","onBindError","onBindClose"])]),_:1}),s(r,{cols:"12"},{default:n(()=>[s(l,{class:"text-none",color:"primary",rounded:"xl",text:"登录",variant:"flat",size:"large",onClick:i.handleLogin,"append-icon":"mdi-arrow-right"},null,8,["onClick"])]),_:1}),s(r,{cols:"12"},{default:n(()=>[s(l,{class:"text-none",color:"white",rounded:"xl",text:"注册",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/register"}),s(l,{class:"text-none",color:"white",rounded:"xl",text:"找回密码",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/retrieve"})]),_:1}),s(r,{cols:"12"},{default:n(()=>[s(l,{onClick:t[5]||(t[5]=a=>i.loginWithOAuth("github")),color:"black","prepend-icon":"mdi-github"},{default:n(()=>t[9]||(t[9]=[d("使用 GitHub 登录")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),s(B,{show:o.loading,text:"登录中"},null,8,["show"])],64)}const Q=b(z,[["render",D]]);export{Q as default};
