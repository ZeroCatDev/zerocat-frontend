import{_ as p}from"./Comment-CAINXfP-.js";import{_,J as g,o as x,c as b,w as s,L as o,a as t,M as V,Q as y,W as i,Y as C,Z as n,O as r,$ as u,R as l,N as m}from"./index-B38-HsvM.js";import{_ as v}from"./Projects-BhP9fiDr.js";import{V as c}from"./VChip-R1NvXeTU.js";import{V as S}from"./VContainer-CEB7RjsF.js";import"./VForm-IBmbuTWN.js";import"./VTextarea-BmP40i0T.js";import"./VDialog-DXt5-bPZ.js";import"./showProjects-EDT5PFls.js";import"./project-BYNw-iDL.js";import"./db-zGpD-re4.js";import"./user-BU-b6xhU.js";import"./43-lazyload-CBkwrR6M.js";import"./VRow-GcI9zMS4.js";/* empty css              */import"./VPagination-Bn3-Zi1h.js";const k={components:{Projects:v,Comment:p},data(){return{UserCardLoading:!0,userid:this.$route.params.id,userinfo:{id:1,username:"加载中",scratchteam:!1,history:{joined:"2021-06-20T01:01:52.000Z"},profile:{id:1,images:{"90x90":"https://cdn2.scratch.mit.edu/get_image/user/78738602_90x90.png?v=","60x60":"https://cdn2.scratch.mit.edu/get_image/user/78738602_60x60.png?v=","55x55":"https://cdn2.scratch.mit.edu/get_image/user/78738602_55x55.png?v=","50x50":"https://cdn2.scratch.mit.edu/get_image/user/78738602_50x50.png?v=","32x32":"https://cdn2.scratch.mit.edu/get_image/user/78738602_32x32.png?v="},status:"加载中",bio:"加载中",country:"加载中"}},projects:[],scratchcount:0,curPage:1,totalPage:1,limit:8,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getuserinfo()},methods:{async getuserinfo(){this.userinfo=await g({url:this.scratch_proxy+"/users/"+this.$route.params.username,method:"get"}),this.UserCardLoading=!1,console.log(this.userinfo)}}},L={class:"mb-2"},w={class:"font-weight-black"};function j(d,a,B,I,e,N){const f=p;return x(),b(S,null,{default:s(()=>[o("div",L,[t(l,{class:"mx-auto mb-4",disabled:e.UserCardLoading,loading:e.UserCardLoading},{prepend:s(()=>[t(V,{class:"mb-2"},{default:s(()=>[t(y,{alt:e.userinfo.username,src:this.scratch_proxy+"/avatars/"+e.userinfo.id},null,8,["alt","src"])]),_:1})]),title:s(()=>[o("span",w,i(e.userinfo.username),1)]),loader:s(({isActive:h})=>[t(C,{active:h,height:"4",indeterminate:""},null,8,["active"])]),subtitle:s(()=>[t(c,null,{default:s(()=>[t(n,{icon:"mdi-account-circle",start:""}),r(" ID:"+i(e.userinfo.id),1)]),_:1}),t(c,null,{default:s(()=>[t(n,{icon:"mdi-clock",start:""}),r(" "+i(e.userinfo.history.joined)+"注册 ",1)]),_:1}),t(c,null,{default:s(()=>[t(n,{icon:"mdi-tag",start:""}),r(" "+i(d.scratchteam?"Scratch Team":"普通用户"),1)]),_:1}),t(c,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),r(" "+i(e.userinfo.profile.country),1)]),_:1}),a[0]||(a[0]=o("span",{class:""},null,-1))]),default:s(()=>[t(u,{class:"bg-surface-light pt-4"},{default:s(()=>[r(i(e.userinfo.profile.status),1)]),_:1}),t(u,{class:"bg-surface-light pt-4"},{default:s(()=>[r(i(e.userinfo.profile.bio),1)]),_:1})]),_:1},8,["disabled","loading"]),t(l,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:s(()=>[t(m,{href:"https://scratch.mit.edu/users/"+e.userinfo.username,target:"_blank"},{default:s(()=>a[2]||(a[2]=[r("Scratch上的用户主页")])),_:1},8,["href"]),t(m,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:s(()=>a[3]||(a[3]=[r("Scratch使用条款")])),_:1})]),default:s(()=>[t(u,{class:"bg-surface-light pt-4"},{default:s(()=>a[1]||(a[1]=[r(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),r("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),r("查看协议全文。 ")])),_:1})]),_:1})]),t(f,{url:"scratchmiteduuser-"+e.userinfo.id,name:"Scratch官网用户"},null,8,["url"])]),_:1})}const F=_(k,[["render",j]]);export{F as default};
