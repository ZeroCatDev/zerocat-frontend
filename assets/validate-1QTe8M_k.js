import{_ as d,H as r,G as p,J as k,a2 as u,o as m,c as f,w as o,a,L as s,$ as g,O as l,W as i,a3 as V,N as c,R as b}from"./index-BNC8O3a1.js";import{V as x}from"./VSpacer-DirY7Tj-.js";import{V as y}from"./VContainer-Do90NQK4.js";/* empty css              */const $={data(){return{token:"",user:{},BASE_API:"https://zerocat-api.houlangs.com"}},mounted(){r.islogin.value==!0&&this.$router.push("/")},async created(){if(p({title:"魔术链接登录"}),this.$route.query.token)try{await k({url:"/account/magiclink/validate?token="+this.$route.query.token,method:"get"}).then(e=>{this.$toast.add({severity:e.status,summary:e.status,detail:e.message,life:3e3}),e.token&&(this.token=e.token,this.user=u(this.token),localStorage.setItem("token",this.token),this.user=u(localStorage.getItem("token")),console.log(this.user),r.loaduser(),this.$router.push({path:"/"}))})}catch(e){this.user=e}else console.log("无token")}};function h(e,t,C,v,n,B){return m(),f(y,null,{default:o(()=>[a(b,{class:"mx-auto",rel:"noopener",target:"_blank",border:""},{title:o(()=>t[0]||(t[0]=[s("span",null,"您正在登录一个账户",-1)])),subtitle:o(()=>t[1]||(t[1]=[s("span",null,"其他页面传来了一个登录请求，正常情况下它会被自动处理",-1)])),default:o(()=>[a(g,{class:"bg-surface-light pt-4"},{default:o(()=>[t[2]||(t[2]=l("传入的token是：")),t[3]||(t[3]=s("br",null,null,-1)),l(" "+i(n.token)+" ",1),t[4]||(t[4]=s("br",null,null,-1)),t[5]||(t[5]=s("br",null,null,-1)),t[6]||(t[6]=l("处理后的数据是：")),t[7]||(t[7]=s("br",null,null,-1)),l(" "+i(n.user),1)]),_:1}),a(V,null,{default:o(()=>[a(x),a(c,{color:"primary",text:"返回登录",variant:"tonal",to:"/account/login",onClick:e.login},null,8,["onClick"])]),_:1})]),_:1})]),_:1})}const A=d($,[["render",h]]);export{A as default};
