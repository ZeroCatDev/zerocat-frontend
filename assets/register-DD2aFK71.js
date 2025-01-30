import{_ as B,a as z}from"./Recaptcha-DVDbUVNE.js";import{p as N,ak as O,al as F,i as L,am as q,an as D,ao as H,ap as p,I as M,a3 as u,k as Z,W as R,a as t,aq as _,_ as E,H as G,G as W,r as j,o as K,e as J,K as s,w as l,ag as U,M as f,P as S,a8 as Q,L as n,ai as C,aa as X,R as Y}from"./index-DFGDNXEX.js";import{r as $}from"./accountService-BqoWdX1C.js";import{V as T,a as g}from"./VRow-CzGTsTAp.js";import{V as ee}from"./VForm-BTRVDrNb.js";import{V as te}from"./VDialog-Dri-Z7zh.js";import{V as x}from"./VCheckbox-C93cJQuN.js";import{V as ae}from"./VSpacer-Dpw5_gD2.js";import"https://static.geetest.com/v4/gt4.js";/* empty css              */import"./VCheckboxBtn-BBG2gdkB.js";import"./VSelectionControl-BnL_j-QK.js";const le=N({id:String,text:String,...O(F({closeOnBack:!1,location:"end",locationStrategy:"connected",eager:!0,minWidth:0,offset:10,openOnClick:!1,openOnHover:!0,origin:"auto",scrim:!1,scrollStrategy:"reposition",transition:!1}),["absolute","persistent"])},"VTooltip"),k=L()({name:"VTooltip",props:le(),emits:{"update:modelValue":a=>!0},setup(a,e){let{slots:d}=e;const c=q(a,"modelValue"),{scopeId:r}=D(),b=H(),m=p(()=>a.id||`v-tooltip-${b}`),v=M(),w=p(()=>a.location.split(" ").length>1?a.location:a.location+" center"),i=p(()=>a.origin==="auto"||a.origin==="overlap"||a.origin.split(" ").length>1||a.location.split(" ").length>1?a.origin:a.origin+" center"),o=p(()=>a.transition?a.transition:c.value?"scale-transition":"fade-transition"),A=p(()=>u({"aria-describedby":m.value},a.activatorProps));return Z(()=>{const I=R.filterProps(a);return t(R,u({ref:v,class:["v-tooltip",a.class],style:a.style,id:m.value},I,{modelValue:c.value,"onUpdate:modelValue":V=>c.value=V,transition:o.value,absolute:!0,location:w.value,origin:i.value,persistent:!0,role:"tooltip",activatorProps:A.value,_disableGlobalStack:!0},r),{activator:d.activator,default:function(){var P;for(var V=arguments.length,h=new Array(V),y=0;y<V;y++)h[y]=arguments[y];return((P=d.default)==null?void 0:P.call(d,...h))??a.text}})}),_({},v)}}),re={components:{LoadingDialog:B,Recaptcha:z},data(){return{BASE_API:"https://zerocat-api.houlangs.com",email:"",username:"",tryinguser:{},loading:!1,agreement:{privacy:!1,terms:!1,rules:!1,datadelete:!1},emailRules:[a=>a?!0:"必须填写邮箱",a=>/.+@.+\..+/.test(a)?!0:"不符合格式"],usernameRules:[a=>a?!0:"必须填写用户名"]}},created(){G.isLogin.value==!0&&this.$router.push("/")},setup(){W({title:"注册"})},methods:{async register(){for(const a in this.agreement)if(this.agreement[a]===!1){this.$toast.add({severity:"info",summary:"info",detail:"请先阅读并同意有关协议",life:3e3});return}this.loading=!0;try{const a=await $({captcha:this.$refs.recaptcha.getResponse(),un:this.email,pw:this.username});this.tryinguser=a.data,this.tryinguser.status=="success"?this.$toast.add({severity:"success",summary:"注册成功",detail:this.tryinguser.message,life:3e3}):this.$toast.add({severity:"info",summary:"info",detail:this.tryinguser.msg||this.tryinguser.message,life:3e3})}catch(a){this.$toast.add({severity:"error",summary:"错误",detail:a.message,life:3e3})}finally{this.loading=!1}}}},oe={class:"auth-wrapper d-flex align-center justify-center pa-4"};function se(a,e,d,c,r,b){const m=j("v-cardtext"),v=z,w=B;return K(),J(Y,null,[s("div",oe,[t(S,{class:"auth-card pa-4 pt-7","max-width":"448",border:"",rounded:"lg"},{default:l(()=>[t(T,null,{default:l(()=>[t(g,{cols:"12"},{default:l(()=>[t(m,null,{default:l(()=>e[9]||(e[9]=[s("h5",{class:"text-h5 font-weight-semibold mb-1"}," 欢迎来到ZeroCatNext！ 👋🏻 ",-1),s("p",{class:"mb-0"},"创建你的账户",-1)])),_:1})]),_:1})]),_:1}),t(m,null,{default:l(()=>[t(ee,null,{default:l(()=>[t(T,null,{default:l(()=>[t(g,{cols:"12"},{default:l(()=>[t(U,{label:"邮箱",type:"email",modelValue:r.email,"onUpdate:modelValue":e[0]||(e[0]=i=>r.email=i),variant:"outlined",required:"",rules:r.emailRules},null,8,["modelValue","rules"]),t(U,{label:"用户名",type:"text",modelValue:r.username,"onUpdate:modelValue":e[1]||(e[1]=i=>r.username=i),variant:"outlined",required:"",rules:r.usernameRules},null,8,["modelValue","rules"])]),_:1}),t(g,{cols:"9"},{default:l(()=>[t(v,{ref:"recaptcha",recaptchaId:"recaptcha-div"},null,512)]),_:1}),t(g,{cols:"12"},{default:l(()=>[t(te,{persistent:""},{activator:l(({props:i})=>[t(f,u(i,{class:"text-none",color:"primary",rounded:"xl",text:"注册",variant:"flat",size:"large","append-icon":"mdi-arrow-right"}),null,16)]),default:l(({isActive:i})=>[t(S,{title:`您正在使用由厚浪(及孙悟元)提供的服务
`},{default:l(()=>[t(Q,null,{default:l(()=>[e[17]||(e[17]=n(" 我们可能会收集您的个人信息,具体参见 ")),t(k,{location:"bottom"},{activator:l(({props:o})=>[s("a",u({href:"https://wuyuan.dev/privacy-policy/privacy-policy.html",target:"_blank"},o,{onClick:e[2]||(e[2]=C(()=>{},["stop"]))})," 隐私策略 ",16)]),default:l(()=>[e[10]||(e[10]=n(" 孙悟元网站与服务隐私策略 "))]),_:1}),t(x,{modelValue:r.agreement.privacy,"onUpdate:modelValue":e[3]||(e[3]=o=>r.agreement.privacy=o)},{label:l(()=>e[11]||(e[11]=[s("div",null,"我已阅读并同意隐私策略",-1)])),_:1},8,["modelValue"]),e[18]||(e[18]=n("我们将在中国大陆安全的存储您的数据，我们暂不提供自助删除您的个人数据，如果您希望删除您的数据，您需要优先选择联系我们 ")),t(x,{modelValue:r.agreement.datadelete,"onUpdate:modelValue":e[4]||(e[4]=o=>r.agreement.datadelete=o)},{label:l(()=>e[12]||(e[12]=[s("div",null," 我理解并同意我无法自助删除我的个人数据，在需要时我会主动联系管理员删除 ",-1)])),_:1},8,["modelValue"]),e[19]||(e[19]=n(" 在 ZeroCatNext 上,你需要遵守 ")),t(k,{location:"bottom"},{activator:l(({props:o})=>[s("a",u({href:"https://scratch.mit.edu/community_guidelines",target:"_blank"},o,{onClick:e[5]||(e[5]=C(()=>{},["stop"]))})," 社区行为准则(第三方站点) ",16)]),default:l(()=>[e[13]||(e[13]=n(" 你的当前地区可能无法访问此网站 "))]),_:1}),t(x,{modelValue:r.agreement.rules,"onUpdate:modelValue":e[6]||(e[6]=o=>r.agreement.rules=o)},{label:l(()=>e[14]||(e[14]=[s("div",null,"我已阅读并同意将会遵守社区行为准则",-1)])),_:1},8,["modelValue"]),e[20]||(e[20]=n(" 你需要同意")),t(k,{location:"bottom"},{activator:l(({props:o})=>[s("a",u({href:"https://wuyuan.dev/privacy-policy/terms-of-service.html",target:"_blank"},o,{onClick:e[7]||(e[7]=C(()=>{},["stop"]))})," 用户协议 ",16)]),default:l(()=>[e[15]||(e[15]=n(" 孙悟元网站与服务用户协议 "))]),_:1}),t(x,{modelValue:r.agreement.terms,"onUpdate:modelValue":e[8]||(e[8]=o=>r.agreement.terms=o)},{label:l(()=>e[16]||(e[16]=[s("div",null,"我已阅读并同意用户协议",-1)])),_:1},8,["modelValue"]),t(f,{class:"text-none",color:"primary",rounded:"xl",text:"注册",variant:"flat",size:"large",onClick:b.register,"append-icon":"mdi-arrow-right"},null,8,["onClick"]),e[21]||(e[21]=s("br",null,null,-1)),e[22]||(e[22]=s("br",null,null,-1)),e[23]||(e[23]=n(" 对于技术手段绕过此页面的行为视为对 ZeroCat 的基础设施进行攻击，涉嫌非法入侵计算机系统，我们将保留追究法律责任的权利，违规获得的账户不被授权访问网站，账户将不受保护，如果您同意以上内容，请点击“复选框”以完成注册流程. "))]),_:1}),t(X,null,{default:l(()=>[t(ae),t(f,{text:"取消",onClick:o=>{i.value=!1,r.agreement={privacy:!1,terms:!1,rules:!1,datadelete:!1}}},null,8,["onClick"])]),_:2},1024)]),_:2},1024)]),_:1})]),_:1}),t(g,{cols:"12"},{default:l(()=>[t(f,{class:"text-none",color:"white",rounded:"xl",text:"登录",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/login"}),t(f,{class:"text-none",color:"white",rounded:"xl",text:"找回密码",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/app/account/retrieve"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),t(w,{show:r.loading,text:"正在注册"},null,8,["show"])],64)}const xe=E(re,[["render",se]]);export{xe as default};
