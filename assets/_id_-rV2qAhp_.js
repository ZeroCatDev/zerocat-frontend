import{_ as I}from"./Comment-Dw2-TGoJ.js";import{_ as B,I as M,J as p,o as m,c as g,w as s,K as i,a as t,U as h,O as k,T as o,a9 as j,W as u,L as r,aa as D,ab as S,a7 as L,ac as N,ad as T,e as b,S as V,R as y,M as c,P as f,$ as C,a0 as v,a1 as x}from"./index-CKXrJDOz.js";import{P as W}from"./Projects-BhUAmuJw.js";import{_ as Z}from"./43-lazyload-CBkwrR6M.js";import{a as z,V as n}from"./VChip-C5rSDCkt.js";import{V as w,a as P}from"./VRow-BM72lIds.js";import{V as R}from"./VContainer-BTDJiuwb.js";import"./VForm-BgWgi3ce.js";import"./VTextarea-BdbE5svO.js";import"./VDialog-DF_4rrUn.js";import"./showProjects-txXlMg6M.js";import"./project-CL4keEzn.js";import"./db-C9XfapFd.js";import"./user-DqRQCnQM.js";import"./VPagination-CH3x59wZ.js";/* empty css              */const A={components:{Projects:W,Comment:I},data(){return{tab:M(null),UserCardLoading:!0,ProjectsLoading:!0,userid:this.$route.params.id,studioinfo:{id:1,title:"加载中",host:1,description:"加载中",visibility:"visible",public:!0,open_to_all:!0,comments_allowed:!0,image:"",history:{created:"2000-01-01T00:00:00.000Z",modified:"2000-01-01T00:00:00.000Z"},stats:{comments:0,followers:0,managers:0,projects:0}},curators:[],curatorspage:0,curatorscanload:!0,managers:[],managerspage:0,managerscanload:!0,usetime:0,projects:[],curPage:1,limit:18,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getstudioinfo(),await this.onPageChange(1,!1)},methods:{async onPageChange(d,e){e==!0&&(this.projects=[]),this.usetime=Date.now(),this.ProjectsLoading=!0,this.projects=this.projects.concat(await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/projects?&offset=${d*16-16}&limit=${this.limit}`,method:"get"})),this.curPage=d,this.ProjectsLoading=!1,this.usetime=Date.now()-this.usetime},async onCuratorsPageChange(d){var e=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/curators?&offset=${d*16-16}&limit=${this.limit}`,method:"get"});e.length==0&&(this.curatorscanload=!1),this.curators=this.curators.concat(e),this.curatorspage=d},async onManagersPageChange(d){var e=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/managers?&offset=${d*16-16}&limit=${this.limit}`,method:"get"});e.length==0&&(this.managerscanload=!1),this.managers=this.managers.concat(e),this.managerspage=d},async getstudioinfo(){this.studioinfo=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}`,method:"get"}),this.UserCardLoading=!1,console.log(this.studioinfo)}}},E={class:"mb-2"},F={class:"font-weight-black"},G={class:"mb-2"};function J(d,e,K,O,a,_){const U=I;return m(),g(R,null,{default:s(()=>[i("div",E,[t(f,{class:"mx-auto mb-4",disabled:a.UserCardLoading,loading:a.UserCardLoading},{prepend:s(()=>[t(h,{class:"mb-2"},{default:s(()=>[t(k,{alt:a.studioinfo.username,src:a.studioinfo.image},null,8,["alt","src"])]),_:1})]),title:s(()=>[i("span",F,o(a.studioinfo.title),1)]),loader:s(({isActive:l})=>[t(j,{active:l,height:"4",indeterminate:""},null,8,["active"])]),subtitle:s(()=>[t(z,{column:""},{default:s(()=>[t(n,null,{default:s(()=>[t(u,{icon:"mdi-account-circle",start:""}),r(" ID:"+o(a.studioinfo.id),1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-clock",start:""}),r(" "+o(a.studioinfo.history.created)+"创建 ",1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-clock",start:""}),r(" "+o(a.studioinfo.history.modified)+"更新",1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.public==!0?"公开":"私密"),1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.open_to_all==!0?"对所有人开放":"需要邀请"),1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.comments_allowed==!0?"Scratch官网允许评论":"Scratch官网不允许评论"),1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" Scratch官网"+o(a.studioinfo.stats.comments)+"评论",1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.stats.followers)+"被关注",1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.stats.managers)+"成员",1)]),_:1}),t(n,null,{default:s(()=>[t(u,{icon:"mdi-earth",start:""}),r(" "+o(a.studioinfo.stats.projects)+"项目",1)]),_:1})]),_:1})]),default:s(()=>[t(D,{modelValue:a.tab,"onUpdate:modelValue":e[0]||(e[0]=l=>a.tab=l)},{default:s(()=>[t(S,{value:"description"},{default:s(()=>e[5]||(e[5]=[r("简介")])),_:1}),t(S,{value:"members"},{default:s(()=>e[6]||(e[6]=[r("成员")])),_:1})]),_:1},8,["modelValue"]),t(L,null,{default:s(()=>[t(N,{modelValue:a.tab,"onUpdate:modelValue":e[3]||(e[3]=l=>a.tab=l)},{default:s(()=>[t(T,{value:"description"},{default:s(()=>[r(o(a.studioinfo.description),1)]),_:1}),t(T,{value:"members"},{default:s(()=>[e[9]||(e[9]=i("h1",null,"管理员",-1)),t(w,null,{default:s(()=>[(m(!0),b(y,null,V(a.managers,l=>(m(),g(P,{cols:" 12",md:"3",key:l},{default:s(()=>[t(f,{to:"/app/proxy/user/"+l.username},{default:s(()=>[t(C,null,{prepend:s(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${l.profile.id}`},null,8,["image"])]),default:s(()=>[t(v,null,{default:s(()=>[r(o(l.username),1)]),_:2},1024),t(x,null,{default:s(()=>[r(o(l.profile.country),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[10]||(e[10]=i("br",null,null,-1)),t(c,{onClick:e[1]||(e[1]=l=>_.onManagersPageChange(a.managerspage+1)),disabled:!a.managerscanload},{default:s(()=>e[7]||(e[7]=[r("继续加载")])),_:1},8,["disabled"]),e[11]||(e[11]=i("br",null,null,-1)),e[12]||(e[12]=i("br",null,null,-1)),e[13]||(e[13]=i("h1",null,"成员",-1)),t(w,null,{default:s(()=>[(m(!0),b(y,null,V(a.curators,l=>(m(),g(P,{cols:" 12",md:"3",key:l},{default:s(()=>[t(f,{to:"/app/proxy/user/"+l.username},{default:s(()=>[t(C,null,{prepend:s(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${l.profile.id}`},null,8,["image"])]),default:s(()=>[t(v,null,{default:s(()=>[r(o(l.username),1)]),_:2},1024),t(x,null,{default:s(()=>[r(o(l.profile.country),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[14]||(e[14]=i("br",null,null,-1)),t(c,{onClick:e[2]||(e[2]=l=>_.onCuratorsPageChange(a.curatorspage+1)),disabled:!a.curatorscanload},{default:s(()=>e[8]||(e[8]=[r("继续加载")])),_:1},8,["disabled"])]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["disabled","loading"]),t(j,{active:a.ProjectsLoading,height:"4",indeterminate:""},null,8,["active"]),i("div",G,[t(n,null,{default:s(()=>[t(u,{icon:"mdi-clock",start:""}),r("本页加载用时"+o(Math.abs(a.usetime/1e3))+"秒 ",1)]),_:1})]),t(w,null,{default:s(()=>[(m(!0),b(y,null,V(a.projects,l=>(m(),g(P,{cols:"4",md:"2",key:l},{default:s(()=>[t(f,{to:"/app/proxy/"+l.id},{default:s(()=>[t(k,{src:`${a.scratch_proxy}/thumbnails/${l.id}`,cover:"","lazy-src":Z},null,8,["src"]),t(C,null,{prepend:s(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${l.actor_id}`},null,8,["image"])]),default:s(()=>[t(v,null,{default:s(()=>[r(o(l.title),1)]),_:2},1024),t(x,null,{default:s(()=>[r(o(l.username),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[19]||(e[19]=i("br",null,null,-1)),t(c,{onClick:e[4]||(e[4]=l=>_.onPageChange(a.curPage+1,!1))},{default:s(()=>e[15]||(e[15]=[r("继续加载")])),_:1}),e[20]||(e[20]=i("br",null,null,-1)),e[21]||(e[21]=i("br",null,null,-1)),t(f,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:s(()=>[t(c,{href:"https://scratch.mit.edu/studios/"+a.studioinfo.id,target:"_blank"},{default:s(()=>e[17]||(e[17]=[r("Scratch上的工作室主页")])),_:1},8,["href"]),t(c,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:s(()=>e[18]||(e[18]=[r("Scratch使用条款")])),_:1})]),default:s(()=>[t(L,{class:"bg-surface-light pt-4"},{default:s(()=>e[16]||(e[16]=[r(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),i("a",null,"署名-相同方式共享 2.0 通用",-1),r("协议传播的，您可以在"),i("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),r("查看协议全文。 ")])),_:1})]),_:1})]),t(U,{url:"scratchmitedustudio-"+this.$route.params.id,name:"Scratch官网工作室"},null,8,["url"])]),_:1})}const dt=B(A,[["render",J]]);export{dt as default};
