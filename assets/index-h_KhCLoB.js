import{_ as x}from"./Comment-Dw2-TGoJ.js";import{o as y}from"./openEdit-AJJkPSPH.js";import{_ as g,H as v,J as V,r as C,o as k,c as w,w as t,a as e,K as i,P as n,a0 as p,L as l,a7 as d,T as s,$ as u,a1 as m,U as f,O as _,M as c}from"./index-CKXrJDOz.js";import{P as S}from"./ProjectRunner-BkXiBAv9.js";import{a as h,V as T}from"./VRow-BM72lIds.js";import{V as a}from"./VChip-C5rSDCkt.js";import{V as Z}from"./VContainer-BTDJiuwb.js";import"./VForm-BgWgi3ce.js";import"./VTextarea-BdbE5svO.js";import"./VDialog-DF_4rrUn.js";/* empty css              */const B={components:{ProjectRunner:S,Comment:x},data(){return{project:{id:1,title:"加载中",description:"加载中",instructions:"加载中",visibility:"visible",public:!0,comments_allowed:!0,is_published:!0,author:{id:1,username:"加载中",scratchteam:!1,history:{joined:"2000-01-01T00:00:00.000Z"},profile:{id:null,images:{"90x90":"","60x60":"","55x55":"","50x50":"","32x32":""}}},image:"",images:{"282x218":"","216x163":"","200x200":"","144x108":"","135x102":"","100x80":""},history:{created:"2000-01-01T00:00:00.000Z",modified:"2000-01-01T00:00:00.000Z",shared:"2000-01-01T00:00:00.000Z"},stats:{views:0,loves:0,favorites:0,remixes:0},remix:{parent:null,root:null},project_token:""},openEditor:y,localuser:v,embedurl:"",scratch_proxy:"https://scratch.192325.xyz",scratch_proxy_gui:"https://scratch-editor.192325.xyz"}},async created(){await this.getproject()},methods:{async getproject(){this.project=await V({url:this.scratch_proxy+"/projects/"+this.$route.params.id,method:"get"}),this.embedurl=this.scratch_proxy_gui+"/embed.html#"+this.$route.params.id,console.log(this.project)}}},I=["src"],N={class:"px-4 d-flex ga-2 mb-2"},P={class:"px-4"};function z(M,r,R,A,o,D){const j=C("v-card-list"),b=x;return k(),w(Z,null,{default:t(()=>[e(T,null,{default:t(()=>[e(h,{cols:"8",md:"8",lg:"8",xl:"8",sm:"8",xs:"8"},{default:t(()=>[i("iframe",{src:o.embedurl,scrolling:"no",frameborder:"0",style:{width:"100%","aspect-ratio":"4/3"}},null,8,I),r[2]||(r[2]=i("br",null,null,-1)),r[3]||(r[3]=i("br",null,null,-1)),e(n,null,{default:t(()=>[e(p,null,{default:t(()=>r[0]||(r[0]=[l("操作说明 ")])),_:1}),e(d,null,{default:t(()=>[l(s(o.project.instructions),1)]),_:1})]),_:1}),r[4]||(r[4]=i("br",null,null,-1)),e(n,null,{default:t(()=>[e(p,null,{default:t(()=>r[1]||(r[1]=[l("备注与鸣谢")])),_:1}),e(d,null,{default:t(()=>[l(s(o.project.description),1)]),_:1})]),_:1})]),_:1}),e(h,{cols:"4"},{default:t(()=>[e(n,{hover:""},{default:t(()=>[e(j,null,{default:t(()=>[e(u,null,{default:t(()=>[e(p,null,{default:t(()=>[l(s(o.project.title),1)]),_:1}),e(m,null,{default:t(()=>[l(s(o.project.id),1)]),_:1})]),_:1}),e(u),e(u,null,{default:t(()=>[e(a,{pill:""},{default:t(()=>[e(f,{start:""},{default:t(()=>[e(_,{src:`${this.scratch_proxy}/avatars/${o.project.author.id}`},null,8,["src"])]),_:1}),l(s(o.project.author.username||"加载中"),1)]),_:1})]),_:1}),e(u,null,{default:t(()=>[e(a,{pill:"","prepend-icon":"mdi-eye"},{default:t(()=>[l(s(o.project.stats.views)+"浏览",1)]),_:1}),e(a,{pill:"","prepend-icon":"mdi-eye"},{default:t(()=>[l(s(o.project.stats.loves)+"赞",1)]),_:1}),e(a,{pill:"","prepend-icon":"mdi-eye"},{default:t(()=>[l(s(o.project.stats.favorites)+"star",1)]),_:1}),e(a,{pill:"","prepend-icon":"mdi-eye"},{default:t(()=>[l(s(o.project.stats.remixes)+"fork",1)]),_:1}),e(a,{pill:"","prepend-icon":"mdi-clock"},{default:t(()=>[l(s(o.project.history.created)+"创建",1)]),_:1}),e(a,{pill:"","prepend-icon":"mdi-clock"},{default:t(()=>[l(s(o.project.history.modified)+"更新",1)]),_:1}),e(a,{pill:"","prepend-icon":"mdi-clock"},{default:t(()=>[l(s(o.project.history.shared)+"开源",1)]),_:1})]),_:1})]),_:1}),i("div",N,[e(c,{href:o.scratch_proxy_gui+"/editor.html#"+o.project.id,variant:"text",target:"_blank"},{default:t(()=>r[5]||(r[5]=[l("打开创造页")])),_:1},8,["href"])]),i("div",P,[e(n,{hover:"",variant:"tonal",to:"/app/proxy/user/"+o.project.author.username},{default:t(()=>[e(u,null,{prepend:t(()=>[e(f,null,{default:t(()=>[e(_,{src:`${this.scratch_proxy}/avatars/${o.project.author.id}`},null,8,["src"])]),_:1})]),default:t(()=>[e(p,{class:"text-white"},{default:t(()=>[l(s(o.project.author.username),1)]),_:1}),e(m,{class:"text-white"},{default:t(()=>[l(s(o.project.author.id),1)]),_:1})]),_:1})]),_:1},8,["to"])]),r[6]||(r[6]=i("br",null,null,-1))]),_:1}),r[12]||(r[12]=i("br",null,null,-1)),e(n,{subtitle:"此项目可以被存储到ZeroCat服务器",title:"存储此项目"},{actions:t(()=>[e(c,{to:"/app/proxy/"+o.project.id+"/fork",variant:"text"},{default:t(()=>r[8]||(r[8]=[l("保存到ZeroCat")])),_:1},8,["to"])]),default:t(()=>[e(d,{class:"bg-surface-light pt-4"},{default:t(()=>r[7]||(r[7]=[l(" 此项目可以被存储到ZeroCat服务器 ")])),_:1})]),_:1}),r[13]||(r[13]=i("br",null,null,-1)),e(n,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:t(()=>[e(c,{href:"https://scratch.mit.edu/projects/"+o.project.id,target:"_blank"},{default:t(()=>r[10]||(r[10]=[l("Scratch上的作品页")])),_:1},8,["href"]),e(c,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:t(()=>r[11]||(r[11]=[l("Scratch使用条款")])),_:1})]),default:t(()=>[e(d,{class:"bg-surface-light pt-4"},{default:t(()=>r[9]||(r[9]=[l(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),i("a",null,"署名-相同方式共享 2.0 通用",-1),l("协议传播的，您可以在"),i("a",{href:"https://creativecommons.org/licenses/by-sa/2.0/"},"creativecommons.org",-1),l("查看协议全文。 ")])),_:1})]),_:1})]),_:1})]),_:1}),e(b,{url:"scratchmiteduproject-"+this.$route.params.id,name:"Scratch官网项目"},null,8,["url"])]),_:1})}const W=g(B,[["render",z]]);export{W as default};
