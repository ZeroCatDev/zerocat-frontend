import{j as n}from"./index-VWaDGczM.js";import{_ as p,G as a,H as d,o as k,c as f,w as o,a as u,K as e,a8 as m,L as r,T as i,P as g}from"./index-D3tnyKYg.js";import{V as b}from"./VContainer-mplczymE.js";/* empty css              */const x={data(){return{token:this.$route.query.token||"无",user:{},BASE_API:"https://zerocat-api.houlangs.com"}},setup(){a({title:"ZeroCat - 确认账户登录"})},async created(){if(this.$route.query.token)try{this.user=n(this.token),localStorage.setItem("token",this.token),this.user=n(localStorage.getItem("token")),console.log(this.user),d.loaduser(),this.$router.push({path:"/"})}catch(s){this.user=s}else a({title:"ZeroCat - 账户登录失败"}),console.log("无token")}};function V(s,t,C,y,l,$){return k(),f(b,null,{default:o(()=>[u(g,{class:"mx-auto",rel:"noopener",target:"_blank",border:""},{title:o(()=>t[0]||(t[0]=[e("span",null,"您正在登录一个账户",-1)])),subtitle:o(()=>t[1]||(t[1]=[e("span",null,"其他页面传来了一个登录请求，正常情况下它会被自动处理",-1)])),default:o(()=>[u(m,{class:"bg-surface-light pt-4"},{default:o(()=>[t[2]||(t[2]=r("传入的token是：")),t[3]||(t[3]=e("br",null,null,-1)),r(" "+i(l.token)+" ",1),t[4]||(t[4]=e("br",null,null,-1)),t[5]||(t[5]=e("br",null,null,-1)),t[6]||(t[6]=r("处理后的数据是：")),t[7]||(t[7]=e("br",null,null,-1)),r(" "+i(l.user),1)]),_:1})]),_:1})]),_:1})}const N=p(x,[["render",V]]);export{N as default};
