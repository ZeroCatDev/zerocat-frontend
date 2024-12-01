import{_ as I}from"./Comment-oeC0UdU5.js";import{_ as B,I as M,J as p,o as m,c as g,w as s,L as o,a as t,M as h,T as k,Z as i,a0 as j,bj as D,O as u,a1 as n,P as l,a2 as L,Q as b,e as y,Y as V,X as C,N as c,U as f,R as v,ax as x,al as w,am as P}from"./index-B4S81A1B.js";import{_ as N}from"./Projects-lptpaBFB.js";import{_ as Z}from"./43-lazyload-CBkwrR6M.js";import{V as z,a as S,b as R,c as T}from"./VTabs-jnPpbliF.js";import{V as W}from"./VContainer-BCdknvvL.js";import"./VForm-DJLvEkrk.js";import"./VTextarea-D5zg3tTW.js";import"./ProjectsCards-CVEXqIaw.js";import"./VPagination-BQSlYOGq.js";const A={components:{Projects:N,Comment:I},data(){return{tab:M(null),UserCardLoading:!0,ProjectsLoading:!0,userid:this.$route.params.id,studioinfo:{id:1,title:"加载中",host:1,description:"加载中",visibility:"visible",public:!0,open_to_all:!0,comments_allowed:!0,image:"",history:{created:"2000-01-01T00:00:00.000Z",modified:"2000-01-01T00:00:00.000Z"},stats:{comments:0,followers:0,managers:0,projects:0}},curators:[],curatorspage:0,curatorscanload:!0,managers:[],managerspage:0,managerscanload:!0,usetime:0,projects:[],curPage:1,limit:18,scratch_proxy:"https://scratch.192325.xyz"}},async created(){await this.getstudioinfo(),await this.onPageChange(1,!1)},methods:{async onPageChange(d,e){e==!0&&(this.projects=[]),this.usetime=Date.now(),this.ProjectsLoading=!0,this.projects=this.projects.concat(await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/projects?&offset=${d*16-16}&limit=${this.limit}`,method:"get"})),this.curPage=d,this.ProjectsLoading=!1,this.usetime=Date.now()-this.usetime},async onCuratorsPageChange(d){var e=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/curators?&offset=${d*16-16}&limit=${this.limit}`,method:"get"});e.length==0&&(this.curatorscanload=!1),this.curators=this.curators.concat(e),this.curatorspage=d},async onManagersPageChange(d){var e=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}/managers?&offset=${d*16-16}&limit=${this.limit}`,method:"get"});e.length==0&&(this.managerscanload=!1),this.managers=this.managers.concat(e),this.managerspage=d},async getstudioinfo(){this.studioinfo=await p({url:`${this.scratch_proxy}/studios/${this.$route.params.id}`,method:"get"}),this.UserCardLoading=!1,console.log(this.studioinfo)}}},E={class:"mb-2"},F={class:"font-weight-black"},G={class:"mb-2"};function J(d,e,O,Q,a,_){const U=I;return m(),g(W,null,{default:s(()=>[o("div",E,[t(f,{class:"mx-auto mb-4",disabled:a.UserCardLoading,loading:a.UserCardLoading},{prepend:s(()=>[t(h,{class:"mb-2"},{default:s(()=>[t(k,{alt:a.studioinfo.username,src:a.studioinfo.image},null,8,["alt","src"])]),_:1})]),title:s(()=>[o("span",F,i(a.studioinfo.title),1)]),loader:s(({isActive:r})=>[t(j,{active:r,height:"4",indeterminate:""},null,8,["active"])]),subtitle:s(()=>[t(D,{column:""},{default:s(()=>[t(u,null,{default:s(()=>[t(n,{icon:"mdi-account-circle",start:""}),l(" ID:"+i(a.studioinfo.id),1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-clock",start:""}),l(" "+i(a.studioinfo.history.created)+"创建 ",1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-clock",start:""}),l(" "+i(a.studioinfo.history.modified)+"更新",1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" "+i(a.studioinfo.public==!0?"公开":"私密"),1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" "+i(a.studioinfo.open_to_all==!0?"对所有人开放":"需要邀请"),1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" "+i(a.studioinfo.comments_allowed==!0?"Scratch官网允许评论":"Scratch官网不允许评论"),1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" Scratch官网"+i(a.studioinfo.stats.comments)+"评论",1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" "+i(a.studioinfo.stats.followers)+"被关注",1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" "+i(a.studioinfo.stats.managers)+"成员",1)]),_:1}),t(u,null,{default:s(()=>[t(n,{icon:"mdi-earth",start:""}),l(" "+i(a.studioinfo.stats.projects)+"项目",1)]),_:1})]),_:1})]),default:s(()=>[t(z,{modelValue:a.tab,"onUpdate:modelValue":e[0]||(e[0]=r=>a.tab=r)},{default:s(()=>[t(S,{value:"description"},{default:s(()=>e[5]||(e[5]=[l("简介")])),_:1}),t(S,{value:"members"},{default:s(()=>e[6]||(e[6]=[l("成员")])),_:1})]),_:1},8,["modelValue"]),t(L,null,{default:s(()=>[t(R,{modelValue:a.tab,"onUpdate:modelValue":e[3]||(e[3]=r=>a.tab=r)},{default:s(()=>[t(T,{value:"description"},{default:s(()=>[l(i(a.studioinfo.description),1)]),_:1}),t(T,{value:"members"},{default:s(()=>[e[9]||(e[9]=o("h1",null,"管理员",-1)),t(b,null,{default:s(()=>[(m(!0),y(C,null,V(a.managers,r=>(m(),g(v,{cols:" 12",md:"3",key:r},{default:s(()=>[t(f,{to:"/proxy/user/"+r.username},{default:s(()=>[t(x,null,{prepend:s(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${r.profile.id}`},null,8,["image"])]),default:s(()=>[t(w,null,{default:s(()=>[l(i(r.username),1)]),_:2},1024),t(P,null,{default:s(()=>[l(i(r.profile.country),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[10]||(e[10]=o("br",null,null,-1)),t(c,{onClick:e[1]||(e[1]=r=>_.onManagersPageChange(a.managerspage+1)),disabled:!a.managerscanload},{default:s(()=>e[7]||(e[7]=[l("继续加载")])),_:1},8,["disabled"]),e[11]||(e[11]=o("br",null,null,-1)),e[12]||(e[12]=o("br",null,null,-1)),e[13]||(e[13]=o("h1",null,"成员",-1)),t(b,null,{default:s(()=>[(m(!0),y(C,null,V(a.curators,r=>(m(),g(v,{cols:" 12",md:"3",key:r},{default:s(()=>[t(f,{to:"/proxy/user/"+r.username},{default:s(()=>[t(x,null,{prepend:s(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${r.profile.id}`},null,8,["image"])]),default:s(()=>[t(w,null,{default:s(()=>[l(i(r.username),1)]),_:2},1024),t(P,null,{default:s(()=>[l(i(r.profile.country),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[14]||(e[14]=o("br",null,null,-1)),t(c,{onClick:e[2]||(e[2]=r=>_.onCuratorsPageChange(a.curatorspage+1)),disabled:!a.curatorscanload},{default:s(()=>e[8]||(e[8]=[l("继续加载")])),_:1},8,["disabled"])]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["disabled","loading"]),t(j,{active:a.ProjectsLoading,height:"4",indeterminate:""},null,8,["active"]),o("div",G,[t(u,null,{default:s(()=>[t(n,{icon:"mdi-clock",start:""}),l("本页加载用时"+i(Math.abs(a.usetime/1e3))+"秒 ",1)]),_:1})]),t(b,null,{default:s(()=>[(m(!0),y(C,null,V(a.projects,r=>(m(),g(v,{cols:"4",md:"2",key:r},{default:s(()=>[t(f,{to:"/proxy/"+r.id},{default:s(()=>[t(k,{src:`${a.scratch_proxy}/thumbnails/${r.id}`,cover:"","lazy-src":Z},null,8,["src"]),t(x,null,{prepend:s(()=>[t(h,{image:`${this.scratch_proxy}/avatars/${r.actor_id}`},null,8,["image"])]),default:s(()=>[t(w,null,{default:s(()=>[l(i(r.title),1)]),_:2},1024),t(P,null,{default:s(()=>[l(i(r.username),1)]),_:2},1024)]),_:2},1024)]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1}),e[19]||(e[19]=o("br",null,null,-1)),t(c,{onClick:e[4]||(e[4]=r=>_.onPageChange(a.curPage+1,!1))},{default:s(()=>e[15]||(e[15]=[l("继续加载")])),_:1}),e[20]||(e[20]=o("br",null,null,-1)),e[21]||(e[21]=o("br",null,null,-1)),t(f,{subtitle:"这是Scratch上的内容",title:"ScratchMirror"},{actions:s(()=>[t(c,{href:"https://scratch.mit.edu/studios/"+a.studioinfo.id,target:"_blank"},{default:s(()=>e[17]||(e[17]=[l("Scratch上的工作室主页")])),_:1},8,["href"]),t(c,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:s(()=>e[18]||(e[18]=[l("Scratch使用条款")])),_:1})]),default:s(()=>[t(L,{class:"bg-surface-light pt-4"},{default:s(()=>e[16]||(e[16]=[l(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),l("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),l("查看协议全文。 ")])),_:1})]),_:1})]),t(U,{url:"scratchmitedustudio-"+this.$route.params.id,name:"Scratch官网工作室"},null,8,["url"])]),_:1})}const lt=B(A,[["render",J]]);export{lt as default};
