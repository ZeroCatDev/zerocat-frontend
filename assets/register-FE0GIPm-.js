import{_ as N}from"./LoadingDialog-Dl1-dLq6.js";import{p as F,a9 as D,aa as H,i as L,ab as Z,ac as q,ad as E,ae as p,I as G,af as m,k as K,$ as P,a as t,ag as M,_ as j,H as R,G as J,J as Q,r as W,o as X,e as Y,L as i,w as a,Q as U,R as u,a3 as S,N as d,P as s,ah as $,U as O,a2 as _,ai as C,a7 as ee,a8 as te,X as le}from"./index-B4S81A1B.js";import"https://static.geetest.com/v4/gt4.js";import{i as T,g as B,r as ae}from"./useRecaptcha-D4VPpSaq.js";import{V as re}from"./VForm-DJLvEkrk.js";import{V as x}from"./VCheckbox-B29FyQoE.js";const oe=F({id:String,text:String,...D(H({closeOnBack:!1,location:"end",locationStrategy:"connected",eager:!0,minWidth:0,offset:10,openOnClick:!1,openOnHover:!0,origin:"auto",scrim:!1,scrollStrategy:"reposition",transition:!1}),["absolute","persistent"])},"VTooltip"),w=L()({name:"VTooltip",props:oe(),emits:{"update:modelValue":l=>!0},setup(l,e){let{slots:f}=e;const v=Z(l,"modelValue"),{scopeId:r}=q(),b=E(),g=p(()=>l.id||`v-tooltip-${b}`),c=G(),n=p(()=>l.location.split(" ").length>1?l.location:l.location+" center"),o=p(()=>l.origin==="auto"||l.origin==="overlap"||l.origin.split(" ").length>1||l.location.split(" ").length>1?l.origin:l.origin+" center"),z=p(()=>l.transition?l.transition:v.value?"scale-transition":"fade-transition"),A=p(()=>m({"aria-describedby":g.value},l.activatorProps));return K(()=>{const I=P.filterProps(l);return t(P,m({ref:c,class:["v-tooltip",l.class],style:l.style,id:g.value},I,{modelValue:v.value,"onUpdate:modelValue":V=>v.value=V,transition:z.value,absolute:!0,location:n.value,origin:o.value,persistent:!0,role:"tooltip",activatorProps:A.value,_disableGlobalStack:!0},r),{activator:f.activator,default:function(){var h;for(var V=arguments.length,k=new Array(V),y=0;y<V;y++)k[y]=arguments[y];return((h=f.default)==null?void 0:h.call(f,...k))??l.text}})}),M({},c)}}),ie={components:{LoadingDialog:N},data(){return{BASE_API:"https://zerocat-api.houlangs.com",email:"",username:"",tryinguser:{},loading:!1,initRecaptcha:T,getResponse:B,resetCaptcha:ae,agreement:{privacy:!1,terms:!1,rules:!1,datadelete:!1},emailRules:[l=>l?!0:"必须填写邮箱",l=>/.+@.+\..+/.test(l)?!0:"不符合格式"],usernameRules:[l=>l?!0:"必须填写用户名"]}},created(){R.islogin.value==!0&&this.$router.push("/"),T("recaptcha-div","popup")},setup(){J({title:"注册"})},methods:{async register(){for(const l in this.agreement)if(this.agreement[l]===!1){this.addtoast("请先阅读并同意有关协议");return}if(this.loading=!0,this.tryinguser=await Q({url:"/account/register",method:"post",data:{captcha:B(),un:this.email,pw:this.username}}),this.tryinguser.message!="OK"){this.loading=!1,this.$toast.add({severity:"info",summary:"info",detail:this.tryinguser.msg||this.tryinguser.message,life:3e3});return}this.loading=!1,R.setuser(this.tryinguser.token),console.log(this.tryinguser),(this.tryinguser.msg||this.tryinguser.message=="OK")&&this.$router.push("/")},addtoast(l){this.$toast.add({severity:"info",summary:"info",detail:l,life:3e3})}}},ne={class:"auth-wrapper d-flex align-center justify-center pa-4"};function se(l,e,f,v,r,b){const g=W("v-cardtext"),c=N;return X(),Y(le,null,[i("div",ne,[t(O,{class:"auth-card pa-4 pt-7","max-width":"448",border:""},{default:a(()=>[t(U,null,{default:a(()=>[t(u,{cols:"12"},{default:a(()=>[t(g,null,{default:a(()=>e[10]||(e[10]=[i("h5",{class:"text-h5 font-weight-semibold mb-1"}," 欢迎来到ZeroCatNext！ 👋🏻 ",-1),i("p",{class:"mb-0"},"创建你的账户",-1)])),_:1})]),_:1})]),_:1}),t(g,null,{default:a(()=>[t(re,null,{default:a(()=>[t(U,null,{default:a(()=>[t(u,{cols:"12"},{default:a(()=>[t(S,{label:"邮箱",type:"email",modelValue:r.email,"onUpdate:modelValue":e[0]||(e[0]=n=>r.email=n),variant:"outlined",required:"",rules:r.emailRules},null,8,["modelValue","rules"]),t(S,{label:"用户名",type:"text",modelValue:r.username,"onUpdate:modelValue":e[1]||(e[1]=n=>r.username=n),variant:"outlined",required:"",rules:r.usernameRules},null,8,["modelValue","rules"])]),_:1}),t(u,{cols:"9"},{default:a(()=>e[11]||(e[11]=[i("div",{id:"recaptcha-div"},null,-1)])),_:1}),t(u,{cols:"3"},{default:a(()=>[t(d,{onClick:e[2]||(e[2]=n=>r.resetCaptcha()),variant:"text"},{default:a(()=>e[12]||(e[12]=[s("刷新")])),_:1})]),_:1}),t(u,{cols:"12"},{default:a(()=>[t($,{persistent:""},{activator:a(({props:n})=>[t(d,m(n,{class:"text-none",color:"primary",rounded:"xl",text:"注册",variant:"flat",size:"large","append-icon":"mdi-arrow-right"}),null,16)]),default:a(({isActive:n})=>[t(O,{title:`您正在使用由厚浪(及孙悟元)提供的服务
`},{default:a(()=>[t(_,null,{default:a(()=>[e[20]||(e[20]=s(" 我们可能会收集您的个人信息,具体参见 ")),t(w,{location:"bottom"},{activator:a(({props:o})=>[i("a",m({href:"https://wuyuan.dev/privacy-policy/privacy-policy.html",target:"_blank"},o,{onClick:e[3]||(e[3]=C(()=>{},["stop"]))})," 隐私策略 ",16)]),default:a(()=>[e[13]||(e[13]=s(" 孙悟元网站与服务隐私策略 "))]),_:1}),t(x,{modelValue:r.agreement.privacy,"onUpdate:modelValue":e[4]||(e[4]=o=>r.agreement.privacy=o)},{label:a(()=>e[14]||(e[14]=[i("div",null,"我已阅读并同意隐私策略",-1)])),_:1},8,["modelValue"]),e[21]||(e[21]=s("我们将在中国大陆安全的存储您的数据，我们暂不提供自助删除您的个人数据，如果您希望删除您的数据，您需要优先选择联系我们 ")),t(x,{modelValue:r.agreement.datadelete,"onUpdate:modelValue":e[5]||(e[5]=o=>r.agreement.datadelete=o)},{label:a(()=>e[15]||(e[15]=[i("div",null," 我理解并同意我无法自助删除我的个人数据，在需要时我会主动联系管理员删除 ",-1)])),_:1},8,["modelValue"]),e[22]||(e[22]=s(" 在 ZeroCatNext 上,你需要遵守 ")),t(w,{location:"bottom"},{activator:a(({props:o})=>[i("a",m({href:"https://scratch.mit.edu/community_guidelines",target:"_blank"},o,{onClick:e[6]||(e[6]=C(()=>{},["stop"]))})," 社区行为准则(第三方站点) ",16)]),default:a(()=>[e[16]||(e[16]=s(" 你的当前地区可能无法访问此网站 "))]),_:1}),t(x,{modelValue:r.agreement.rules,"onUpdate:modelValue":e[7]||(e[7]=o=>r.agreement.rules=o)},{label:a(()=>e[17]||(e[17]=[i("div",null,"我已阅读并同意将会遵守社区行为准则",-1)])),_:1},8,["modelValue"]),e[23]||(e[23]=s(" 你需要同意")),t(w,{location:"bottom"},{activator:a(({props:o})=>[i("a",m({href:"https://wuyuan.dev/privacy-policy/terms-of-service.html",target:"_blank"},o,{onClick:e[8]||(e[8]=C(()=>{},["stop"]))})," 用户协议 ",16)]),default:a(()=>[e[18]||(e[18]=s(" 孙悟元网站与服务用户协议 "))]),_:1}),t(x,{modelValue:r.agreement.terms,"onUpdate:modelValue":e[9]||(e[9]=o=>r.agreement.terms=o)},{label:a(()=>e[19]||(e[19]=[i("div",null,"我已阅读并同意用户协议",-1)])),_:1},8,["modelValue"]),t(d,{class:"text-none",color:"primary",rounded:"xl",text:"注册",variant:"flat",size:"large",onClick:b.register,"append-icon":"mdi-arrow-right"},null,8,["onClick"]),e[24]||(e[24]=i("br",null,null,-1)),e[25]||(e[25]=i("br",null,null,-1)),e[26]||(e[26]=s(" 对于技术手段绕过此页面的行为视为对 ZeroCat 的基础设施进行攻击，涉嫌非法入侵计算机系统，我们将保留追究法律责任的权利，违规获得的账户不被授权访问网站，账户将不受保护，如果您同意以上内容，请点击“复选框”以完成注册流程. "))]),_:1}),t(ee,null,{default:a(()=>[t(te),t(d,{text:"取消",onClick:o=>{n.value=!1,r.agreement={privacy:!1,terms:!1,rules:!1,datadelete:!1}}},null,8,["onClick"])]),_:2},1024)]),_:2},1024)]),_:1})]),_:1}),t(u,{cols:"12"},{default:a(()=>[t(d,{class:"text-none",color:"white",rounded:"xl",text:"登录",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/account/login"}),t(d,{class:"text-none",color:"white",rounded:"xl",text:"找回密码",variant:"text",size:"large","append-icon":"mdi-arrow-right",to:"/account/retrieve"})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),t(c,{show:r.loading,text:"正在注册"},null,8,["show"])],64)}const ve=j(ie,[["render",se]]);export{ve as default};
