import{_ as I}from"./Comment-DNDpVd01.js";import{_ as B,I as M,J as p,o as m,c as g,w as e,L as i,a as t,M as h,Q as k,W as o,aa as j,X as u,O as r,ab as D,ac as L,a8 as S,ad as N,ae as T,e as b,U as V,T as y,N as c,R as f,a0 as C,a1 as v,a2 as x}from"./index-C840rCbu.js";import{P as W}from"./Projects-CzTWLIhA.js";import{_ as Z}from"./43-lazyload-CBkwrR6M.js";import{a as z,V as n}from"./VChip-CDrc1Zhr.js";import{V as w,a as P}from"./VRow-C9ulTvU0.js";import{V as R}from"./VContainer-CPhamQLs.js";import"./VForm-yIaQZr9E.js";import"./VTextarea-Bs9IUwVF.js";import"./VDialog-pCMGnecn.js";import"./showProjects-CLBL14cO.js";import"./project-D8jPl1wg.js";import"./db-DQHg44Zu.js";import"./user-B5M2ILH_.js";import"./VPagination-AkVbStKs.js";/* empty css              */const A={components:{Projects:W,Comment:I},data(){return{tab:M(null),UserCardLoading:!0,ProjectsLoading:!0,userid:this.$route.params.id,studioinfo:{id:1,title:"加载中",host:1,description:"加载中",visibility:"visible",public:!0,open_to_all:!0,comments_allowed:!0,image:"",history:{created:"2000-01-01T00:00:00.000Z",modified:"2000-01-01T00:00:00.000Z"},stats:{comments:0,followers:0,managers:0,projects:0}},curators:[],curatorspage:0,curatorscanload:!0,managers:[],managerspage:0,managerscanload:!0,usetime:0,projects:[],curPage:1,limit:18,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getstudioinfo(),await this.onPageChange(1,!1)},methods:{async onPageChange(d,s){s==!0&&(this.projects=[]),this.usetime=Date.now(),this.ProjectsLoading=!0,this.projects=this.projects.concat(await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/projects?&offset=${d*16-16}&limit=${this.limit}`,method:"get"})),this.curPage=d,this.ProjectsLoading=!1,this.usetime=Date.now()-this.usetime},async onCuratorsPageChange(d){var s=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/curators?&offset=${d*16-16}&limit=${this.limit}`,method:"get"});s.length==0&&(this.curatorscanload=!1),this.curators=this.curators.concat(s),this.curatorspage=d},async onManagersPageChange(d){var s=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/managers?&offset=${d*16-16}&limit=${this.limit}`,method:"get"});s.length==0&&(this.managerscanload=!1),this.managers=this.managers.concat(s),this.managerspage=d},async getstudioinfo(){this.studioinfo=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}`,method:"get"}),this.UserCardLoading=!1,console.log(this.studioinfo)}}},E={class:"mb-2"},F={class:"font-weight-black"},G={class:"mb-2"};function J(d,s,O,Q,a,_){const U=I;return m(),g(R,null,{default:e(()=>[i("div",E,[t(f,{class:"mx-auto mb-4",disabled:a.UserCardLoading,loading:a.UserCardLoading},{prepend:e(()=>[t(h,{class:"mb-2"},{default:e(()=>[t(k,{alt:a.studioinfo.username,src:a.studioinfo.image},null,8,["alt","src"])]),_:1})]),title:e(()=>[i("span",F,o(a.studioinfo.title),1)]),loader:e(({isActive:l})=>[t(j,{active:l,height:"4",indeterminate:""},null,8,["active"])]),subtitle:e(()=>[t(z,{column:""},{default:e(()=>[t(n,null,{default:e(()=>[t(u,{icon:"mdi-account-circle",start:""}),r(" ID:"+o(a.studioinfo.id),1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-clock",start:""}),r(" "+o(a.studioinfo.history.created)+"创建 ",1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-clock",start:""}),r(" "+o(a.studioinfo.history.modified)+"更新",1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.public==!0?"公开":"私密"),1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.open_to_all==!0?"对所有人开放":"需要邀请"),1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.comments_allowed==!0?"Scratch官网允许评论":"Scratch官网不允许评论"),1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" Scratch官网"+o(a.studioinfo.stats.comments)+"评论",1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.stats.followers)+"被关注",1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.stats.managers)+"成员",1)]),_:1}),t(n,null,{default:e(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.stats.projects)+"项目",1)]),_:1})]),_:1})]),default:e(()=>[t(D,{modelValue:a.tab,"onUpdate:modelValue":s[0]||(s[0]=l=>a.tab=l)},{default:e(()=>[t(L,{value:"description"},{default:e(()=>s[5]||(s[5]=[r("简介")])),_:1}),t(L,{value:"members"},{default:e(()=>s[6]||(s[6]=[r("成员")])),_:1})]),_:1},8,["modelValue"]),t(S,null,{default:e(()=>[t(N,{modelValue:a.tab,"onUpdate:modelValue":s[3]||(s[3]=l=>a.tab=l)},{default:e(()=>[t(T,{value:"description"},{default:e(()=>[r(o(a.studioinfo.description),1)]),_:1}),t(T,{value:"members"},{default:e(()=>[s[9]||(s[9]=i("h1",null,"管理员",-1)),t(w,null,{default:e(()=>[(m(!0),b(y,null,V(a.managers,l=>(m(),g(P,{cols:" 12",md:"3",key:l},{default:e(()=>[t(f,{to:"/app/proxy/user/"+l.username},{default:e(()=>[t(C,null,{prepend:e(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${l.profile.id}`},null,8,["image"])]),default:e(()=>[t(v,null,{default:e(()=>[r(o(l.username),1)]),_:2},1024),t(x,null,{default:e(()=>[r(o(l.profile.country),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),s[10]||(s[10]=i("br",null,null,-1)),t(c,{onClick:s[1]||(s[1]=l=>_.onManagersPageChange(a.managerspage+1)),disabled:!a.managerscanload},{default:e(()=>s[7]||(s[7]=[r("继续加载")])),_:1},8,["disabled"]),s[11]||(s[11]=i("br",null,null,-1)),s[12]||(s[12]=i("br",null,null,-1)),s[13]||(s[13]=i("h1",null,"成员",-1)),t(w,null,{default:e(()=>[(m(!0),b(y,null,V(a.curators,l=>(m(),g(P,{cols:" 12",md:"3",key:l},{default:e(()=>[t(f,{to:"/app/proxy/user/"+l.username},{default:e(()=>[t(C,null,{prepend:e(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${l.profile.id}`},null,8,["image"])]),default:e(()=>[t(v,null,{default:e(()=>[r(o(l.username),1)]),_:2},1024),t(x,null,{default:e(()=>[r(o(l.profile.country),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),s[14]||(s[14]=i("br",null,null,-1)),t(c,{onClick:s[2]||(s[2]=l=>_.onCuratorsPageChange(a.curatorspage+1)),disabled:!a.curatorscanload},{default:e(()=>s[8]||(s[8]=[r("继续加载")])),_:1},8,["disabled"])]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["disabled","loading"]),t(j,{active:a.ProjectsLoading,height:"4",indeterminate:""},null,8,["active"]),i("div",G,[t(n,null,{default:e(()=>[t(u,{icon:"mdi-clock",start:""}),r("本页加载用时"+o(Math.abs(a.usetime/1e3))+"秒 ",1)]),_:1})]),t(w,null,{default:e(()=>[(m(!0),b(y,null,V(a.projects,l=>(m(),g(P,{cols:"4",md:"2",key:l},{default:e(()=>[t(f,{to:"/proxy/"+l.id},{default:e(()=>[t(k,{src:`${a.scratch_proxy}/thumbnails/${l.id}`,cover:"","lazy-src":Z},null,8,["src"]),t(C,null,{prepend:e(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${l.actor_id}`},null,8,["image"])]),default:e(()=>[t(v,null,{default:e(()=>[r(o(l.title),1)]),_:2},1024),t(x,null,{default:e(()=>[r(o(l.username),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),s[19]||(s[19]=i("br",null,null,-1)),t(c,{onClick:s[4]||(s[4]=l=>_.onPageChange(a.curPage+1,!1))},{default:e(()=>s[15]||(s[15]=[r("继续加载")])),_:1}),s[20]||(s[20]=i("br",null,null,-1)),s[21]||(s[21]=i("br",null,null,-1)),t(f,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:e(()=>[t(c,{href:"https://scratch.mit.edu/studios/"+a.studioinfo.id,target:"_blank"},{default:e(()=>s[17]||(s[17]=[r("Scratch上的工作室主页")])),_:1},8,["href"]),t(c,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:e(()=>s[18]||(s[18]=[r("Scratch使用条款")])),_:1})]),default:e(()=>[t(S,{class:"bg-surface-light pt-4"},{default:e(()=>s[16]||(s[16]=[r(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),i("a",null,"署名-相同方式共享 2.0 通用",-1),r("协议传播的，您可以在"),i("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),r("查看协议全文。 ")])),_:1})]),_:1})]),t(U,{url:"scratchmitedustudio-"+this.$route.params.id,name:"Scratch官网工作室"},null,8,["url"])]),_:1})}const dt=B(A,[["render",J]]);export{dt as default};
