import{_ as j}from"./Comment-Cnbo0c2r.js";import{o as g}from"./openEdit-AJJkPSPH.js";import{_ as v,H as V,J as C,r as w,o as k,c as S,w as e,a as t,K as i,P as n,ae as c,L as o,a8 as d,T as s,ad as u,af as f,U as _,O as h,M as m}from"./index-C8FXpdEG.js";import{P as T}from"./ProjectRunner-AzJGzWj2.js";import{a as x,V as Z}from"./VRow-qPX1OE4o.js";import{V as a}from"./VChip-yLsV02g7.js";import{V as B}from"./VContainer-tJzD1l0H.js";import"./VForm-DstwdNnf.js";import"./VTextarea-C96l2Bn-.js";import"./VDialog-V5tUaUJe.js";/* empty css              */const I={components:{ProjectRunner:T,Comment:j},data(){return{project:{id:1,title:"加载中",description:"加载中",instructions:"加载中",visibility:"visible",public:!0,comments_allowed:!0,is_published:!0,author:{id:1,username:"加载中",scratchteam:!1,history:{joined:"2000-01-01T00:00:00.000Z"},profile:{id:null,images:{"90x90":"","60x60":"","55x55":"","50x50":"","32x32":""}}},image:"",images:{"282x218":"","216x163":"","200x200":"","144x108":"","135x102":"","100x80":""},history:{created:"2000-01-01T00:00:00.000Z",modified:"2000-01-01T00:00:00.000Z",shared:"2000-01-01T00:00:00.000Z"},stats:{views:0,loves:0,favorites:0,remixes:0},remix:{parent:null,root:null},project_token:""},projectid:this.$route.params.id,openEditor:g,localuser:V,embedurl:"",scratch_proxy:"https://scratch.192325.xyz",scratch_proxy_gui:"https://scratch-editor.192325.xyz"}},async created(){await this.getproject()},methods:{async getproject(){try{const p=await C.get(`${this.scratch_proxy}/projects/${this.$route.params.id}`);this.project=p.data,this.embedurl=`${this.scratch_proxy_gui}/embed.html#${this.$route.params.id}`}catch(p){console.log(p)}}}},N=["src"],P={class:"px-4 d-flex ga-2 mb-2"},z={class:"px-4"};function M(p,r,R,A,l,D){const y=w("v-card-list"),b=j;return k(),S(B,null,{default:e(()=>[t(Z,null,{default:e(()=>[t(x,{cols:"8",md:"8",lg:"8",xl:"8",sm:"8",xs:"8"},{default:e(()=>[i("iframe",{src:l.embedurl,scrolling:"no",frameborder:"0",style:{width:"100%","aspect-ratio":"4/3"}},null,8,N),r[2]||(r[2]=i("br",null,null,-1)),r[3]||(r[3]=i("br",null,null,-1)),t(n,null,{default:e(()=>[t(c,null,{default:e(()=>r[0]||(r[0]=[o("操作说明 ")])),_:1}),t(d,null,{default:e(()=>[o(s(l.project.instructions),1)]),_:1})]),_:1}),r[4]||(r[4]=i("br",null,null,-1)),t(n,null,{default:e(()=>[t(c,null,{default:e(()=>r[1]||(r[1]=[o("备注与鸣谢")])),_:1}),t(d,null,{default:e(()=>[o(s(l.project.description),1)]),_:1})]),_:1})]),_:1}),t(x,{cols:"4"},{default:e(()=>[t(n,{hover:""},{default:e(()=>[t(y,null,{default:e(()=>[t(u,null,{default:e(()=>[t(c,null,{default:e(()=>[o(s(l.project.title),1)]),_:1}),t(f,null,{default:e(()=>[o(s(l.project.id),1)]),_:1})]),_:1}),t(u),t(u,null,{default:e(()=>[t(a,{pill:""},{default:e(()=>[t(_,{start:""},{default:e(()=>[t(h,{src:`${this.scratch_proxy}/avatars/${l.project.author.id}`},null,8,["src"])]),_:1}),o(s(l.project.author.username||"加载中"),1)]),_:1})]),_:1}),t(u,null,{default:e(()=>[t(a,{pill:"","prepend-icon":"mdi-eye"},{default:e(()=>[o(s(l.project.stats.views)+"浏览",1)]),_:1}),t(a,{pill:"","prepend-icon":"mdi-eye"},{default:e(()=>[o(s(l.project.stats.loves)+"赞",1)]),_:1}),t(a,{pill:"","prepend-icon":"mdi-eye"},{default:e(()=>[o(s(l.project.stats.favorites)+"star",1)]),_:1}),t(a,{pill:"","prepend-icon":"mdi-eye"},{default:e(()=>[o(s(l.project.stats.remixes)+"fork",1)]),_:1}),t(a,{pill:"","prepend-icon":"mdi-clock"},{default:e(()=>[o(s(l.project.history.created)+"创建",1)]),_:1}),t(a,{pill:"","prepend-icon":"mdi-clock"},{default:e(()=>[o(s(l.project.history.modified)+"更新",1)]),_:1}),t(a,{pill:"","prepend-icon":"mdi-clock"},{default:e(()=>[o(s(l.project.history.shared)+"公开",1)]),_:1})]),_:1})]),_:1}),i("div",P,[t(m,{href:l.scratch_proxy_gui+"/editor.html#"+l.project.id,variant:"text",target:"_blank"},{default:e(()=>r[5]||(r[5]=[o("打开创造页")])),_:1},8,["href"])]),i("div",z,[t(n,{hover:"",variant:"tonal",to:"/app/proxy/user/"+l.project.author.username},{default:e(()=>[t(u,null,{prepend:e(()=>[t(_,null,{default:e(()=>[t(h,{src:`${this.scratch_proxy}/avatars/${l.project.author.id}`},null,8,["src"])]),_:1})]),default:e(()=>[t(c,{class:"text-white"},{default:e(()=>[o(s(l.project.author.username),1)]),_:1}),t(f,{class:"text-white"},{default:e(()=>[o(s(l.project.author.id),1)]),_:1})]),_:1})]),_:1},8,["to"])]),r[6]||(r[6]=i("br",null,null,-1))]),_:1}),r[10]||(r[10]=i("br",null,null,-1)),t(n,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:e(()=>[t(m,{href:"https://scratch.mit.edu/projects/"+l.project.id,target:"_blank"},{default:e(()=>r[8]||(r[8]=[o("Scratch上的作品页")])),_:1},8,["href"]),t(m,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:e(()=>r[9]||(r[9]=[o("Scratch使用条款")])),_:1})]),default:e(()=>[t(d,{class:"bg-surface-light pt-4"},{default:e(()=>r[7]||(r[7]=[o(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),i("a",null,"署名-相同方式共享 2.0 通用",-1),o("协议传播的，您可以在"),i("a",{href:"https://creativecommons.org/licenses/by-sa/2.0/"},"creativecommons.org",-1),o("查看协议全文。 ")])),_:1})]),_:1})]),_:1})]),_:1}),t(b,{url:"scratchmiteduproject-"+l.project.id,name:"Scratch官网项目"},null,8,["url"])]),_:1})}const W=v(I,[["render",M]]);export{W as default};
