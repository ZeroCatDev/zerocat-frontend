import{_ as m,a as f}from"./Recaptcha-B2olsjrw.js";import{_ as x,H as l,I as w,G as y,r as v,o as V,e as R,K as u,a as e,w as o,a5 as c,M as i,P as C,R as k}from"./index-D3tnyKYg.js";import{l as b}from"./userService-BBsIhbbp.js";import{V as d,a}from"./VRow-D34RlAbD.js";import{V as z}from"./VForm-DV96JdOq.js";import"./VDialog-DwCRl3n9.js";import"https://static.geetest.com/v4/gt4.js";/* empty css              */const B={components:{LoadingDialog:m,Recaptcha:f},data(){return{BASE_API:"https://zerocat-api.houlangs.com",username:"",password:"",tryinguser:{},loading:!1,localuser:l,show1:w(!1),emailRules:[t=>t?!0:"必须填写邮箱",t=>/.+@.+\..+/.test(t)?!0:"不符合格式"],usernameRules:[t=>t?!0:"必须填写用户名"]}},created(){l.isLogin.value===!0&&this.$router.push("/")},setup(){y({title:"登录"})},methods:{async login(){this.loading=!0;try{const t=await b({captcha:this.$refs.recaptcha.getResponse(),un:this.username,pw:this.password});console.log(t),this.tryinguser=t.data,console.log(this.tryinguser),this.tryinguser.status==="success"?(await l.setUser(this.tryinguser.token),l.isLogin.value===!0&&this.$router.push("/")):this.$toast.add({severity:"info",summary:"info",detail:this.tryinguser.message,life:3e3})}catch(t){this.$toast.add({severity:"error",summary:"错误",detail:t.message,life:3e3})}finally{this.loading=!1}}}},L={class:"auth-wrapper d-flex align-center justify-center pa-4"};function U(t,r,F,I,s,h){const p=v("v-cardtext"),g=f,_=m;return V(),R(k,null,[u("div",L,[e(C,{class:"auth-card pa-4 pt-7","max-width":"448",border:""},{default:o(()=>[e(d,null,{default:o(()=>[e(a,{cols:"12"},{default:o(()=>[e(p,null,{default:o(()=>r[3]||(r[3]=[u("h5",{class:"text-h5 font-weight-semibold mb-1"}," 欢迎来到ZeroCatNext！ 👋🏻 ",-1),u("p",{class:"mb-0"},"登录你的账户",-1)])),_:1})]),_:1})]),_:1}),e(p,null,{default:o(()=>[e(z,null,{default:o(()=>[e(d,null,{default:o(()=>[e(a,{cols:"12"},{default:o(()=>[e(c,{label:"邮箱",type:"text",modelValue:s.username,"onUpdate:modelValue":r[0]||(r[0]=n=>s.username=n),variant:"outlined",rules:s.emailRules},null,8,["modelValue","rules"]),e(c,{label:"密码",modelValue:s.password,"onUpdate:modelValue":r[1]||(r[1]=n=>s.password=n),variant:"outlined",rules:s.usernameRules,"append-icon":s.show1?"mdi-eye":"mdi-eye-off",type:s.show1?"text":"password","onClick:append":r[2]||(r[2]=n=>s.show1=!s.show1)},null,8,["modelValue","rules","append-icon","type"])]),_:1}),e(a,{cols:"9"},{default:o(()=>[e(g,{ref:"recaptcha",recaptchaId:"recaptcha-div"},null,512)]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(i,{class:"text-none",color:"primary",rounded:"xl",text:"登录",variant:"flat",size:"large",onClick:h.login,"append-icon":"mdi-arrow-right"},null,8,["onClick"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(i,{class:"text-none",color:"white",rounded:"xl",text:"注册",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/register"}),e(i,{class:"text-none",color:"white",rounded:"xl",text:"邮箱验证登录",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/magiclink"}),e(i,{class:"text-none",color:"white",rounded:"xl",text:"找回密码",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/retrieve"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),e(_,{show:s.loading,text:"登录中"},null,8,["show"])],64)}const K=x(B,[["render",U]]);export{K as default};
