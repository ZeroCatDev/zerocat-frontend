import{f as K,p as Q,i as j,a as s,A as q,k as J,R as i,av as W,r as b,e as k,o as d,w as t,ap as I,G as L,ab as w,c as V,ac as X,af as O,M as B,N as P,L as T,ag as S,H as m,O as p,ah as Y,I as x,K as $,ay as Z,Q as _,S as N}from"./index-BooYM3i6.js";import{_ as ee}from"./verifyEmail-Bvh4Aeid.js";import{V as ae}from"./VAlert-B1ITW7Ud.js";const te=Q({start:Boolean,end:Boolean,...J(),...q()},"VListItemAction"),se=K()({name:"VListItemAction",props:te(),setup(c,f){let{slots:o}=f;return j(()=>s(c.tag,{class:["v-list-item-action",{"v-list-item-action--start":c.start,"v-list-item-action--end":c.end},c.class],style:c.style},o)),{}}}),le={class:"oauth-binding"},ue={__name:"OAuthManager",setup(c){const f=i([]),o=i(""),r=i("info"),g=i(!1),y=i(""),h=i(""),C=i([]),U="https://zerocat-api.houlangs.com",F={google:{backgroundColor:"#4285F4",color:"#FFFFFF"},microsoft:{backgroundColor:"#F25022",color:"#FFFFFF"},github:{backgroundColor:"#333333",color:"#FFFFFF"},default:{backgroundColor:"#CCCCCC",color:"#000000"}},A=async()=>{var l,e;try{const a=await _.post("/account/oauth/bound",{userid:N.user.value.id});a.data.status==="success"?f.value=a.data.data:(o.value=a.data.message,r.value="error")}catch(a){o.value=((e=(l=a.response)==null?void 0:l.data)==null?void 0:e.message)||"获取绑定的 OAuth 账号失败",r.value="error"}},E=async()=>{var l,e;try{const a=await _.get("/account/emails");if(a.data.status==="success"){const n=a.data.data.find(v=>v.is_primary);n&&(y.value=n.contact_value)}else o.value=a.data.message,r.value="error"}catch(a){o.value=((e=(l=a.response)==null?void 0:l.data)==null?void 0:e.message)||"获取邮箱列表失败",r.value="error"}},M=async()=>{var l,e;try{const a=await _.get("/account/oauth/providers");a.data.status==="success"?C.value=a.data.data:(o.value=a.data.message,r.value="error")}catch(a){o.value=((e=(l=a.response)==null?void 0:l.data)==null?void 0:e.message)||"获取可绑定的 OAuth 提供商失败",r.value="error"}},z=(l,e)=>{h.value=e,g.value=!0},D=async l=>{var e,a;try{const u=await _.post("/account/confirm-unlink-oauth",{email:y.value,code:l,provider:h.value});u.data.status==="success"?(o.value="成功解绑 OAuth 账号",r.value="success",A()):(o.value=u.data.message||"解绑失败",r.value="error")}catch(u){o.value=((a=(e=u.response)==null?void 0:e.data)==null?void 0:a.message)||"解绑 OAuth 账号失败",r.value="error"}},R=l=>{window.location.href=`${U}/account/oauth/bind/${l}?token=${N.getToken()}`},G=l=>F[l]||F.default;return W(()=>{A(),E(),M()}),(l,e)=>{const a=b("v-list-item-content"),u=b("v-list-item-group");return d(),k("div",le,[s($,null,{default:t(()=>[s(I,null,{default:t(()=>e[1]||(e[1]=[L("h2",null,"已绑定的 OAuth 账号",-1)])),_:1}),s(w,null,{default:t(()=>[s(O,null,{default:t(()=>[s(u,null,{default:t(()=>[(d(!0),k(B,null,P(f.value,(n,v)=>(d(),V(T,{key:v},{default:t(()=>[s(a,null,{default:t(()=>[s(S,null,{default:t(()=>[m(p(n.contact_value),1)]),_:2},1024),s(Y,null,{default:t(()=>[m(p(n.contact_type),1)]),_:2},1024)]),_:2},1024),s(se,null,{default:t(()=>[s(x,{onClick:H=>z(n.contact_value,n.contact_type),color:"red"},{default:t(()=>e[2]||(e[2]=[m("解绑")])),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}),o.value?(d(),V(ae,{key:0,type:r.value},{default:t(()=>[m(p(o.value),1)]),_:1},8,["type"])):X("",!0)]),_:1})]),_:1}),s(ee,{modelValue:g.value,"onUpdate:modelValue":e[0]||(e[0]=n=>g.value=n),email:y.value,onVerified:D},null,8,["modelValue","email"]),s($,{class:"mt-4"},{default:t(()=>[s(I,null,{default:t(()=>e[3]||(e[3]=[L("h2",null,"可绑定的 OAuth 提供商",-1)])),_:1}),s(w,null,{default:t(()=>[e[4]||(e[4]=m(" 不论怎样，你都需要确保对绑定账户内邮箱完全的控制。 ")),s(O,null,{default:t(()=>[(d(!0),k(B,null,P(C.value,(n,v)=>(d(),V(T,{key:v},{default:t(()=>[s(a,null,{default:t(()=>[s(S,null,{default:t(()=>[s(x,{style:Z(G(n.id)),onClick:H=>R(n.id)},{default:t(()=>[m(p(n.name),1)]),_:2},1032,["style","onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})])}}};export{ue as _};
