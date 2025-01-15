import{a as F,_ as I}from"./Comment-DH0sFXbD.js";import{N as L}from"./NewProjectList-DzvtmWif.js";import{_ as P,H as f,J as p,o as n,e as m,a as t,w as e,T as j,U as B,S as C,ai as J,O as i,W as a,aj as M,ad as O,N as y,c as h,R as g,ah as S,af as T,ag as D,L as u,M as N,Q as A,a1 as x,G as Q}from"./index-ClYup7uH.js";import{V as W}from"./VDialog-C_Ubr2eg.js";import{P as R}from"./ProjectRunner-lMdfR0nO.js";import{o as Z}from"./openEdit-DBNuVmNU.js";import{l as q,b as z}from"./project-C3fxXwAC.js";import{l as K,b as X}from"./user-SJDzoihd.js";import{a as v,V as Y}from"./VRow-DmykgyR8.js";import{V as d}from"./VChip-rcAFIQHh.js";import{V as $}from"./VContainer-DWnX6OiG.js";import"./VForm-mch-EfXt.js";import"./VTextarea-CN7D5U2X.js";import"./VSpacer-CwrVYQB2.js";/* empty css              */import"./VExpansionPanels-0CLYLzo9.js";import"./db-ChkiV1_p.js";const tt={components:{NewProjectList:L},name:"addtolist",data(){return{localuser:f,userinfo:f.user,newProjectListDialog:!1,projectLists:[]}},methods:{async getProjectList(){this.projectLists=(await p({url:"/projectlist/check?projectid="+this.$route.params.id,method:"get"})).data},async addProjectToList(s){await p({url:"/projectlist/add",data:{userid:this.userinfo.id,projectid:this.$route.params.id,listid:s},method:"post"}).then(r=>{this.$toast.add({severity:"info",summary:"info",detail:r.message,life:3e3}),this.getProjectList()})},async removeProjectFromList(s){await p({url:"/projectlist/remove",data:{projectid:this.$route.params.id,listid:s},method:"post"}).then(r=>{this.$toast.add({severity:"info",summary:"info",detail:r.message,life:3e3}),this.getProjectList()})}},mounted(){this.getProjectList()}};function et(s,r,V,w,o,c){const _=L;return n(),m(j,null,[t(O,null,{default:e(()=>[(n(!0),m(j,null,B(o.projectLists,l=>(n(),m("div",{key:l.id},[t(C,{"append-icon":l.include==!0?"mdi-minus-circle":"mdi-plus-circle",active:l.include==!0,color:"primary",onClick:k=>l.include==!0?c.removeProjectFromList(l.id):c.addProjectToList(l.id)},{default:e(()=>[t(J,null,{default:e(()=>[i(a(l.title),1)]),_:2},1024),t(M,null,{default:e(()=>[i(a(l.description),1)]),_:2},1024)]),_:2},1032,["append-icon","active","onClick"])]))),128)),t(C,{onClick:r[0]||(r[0]=l=>o.newProjectListDialog=!0)},{default:e(()=>r[2]||(r[2]=[i("新建列表")])),_:1})]),_:1}),t(W,{modelValue:o.newProjectListDialog,"onUpdate:modelValue":r[1]||(r[1]=l=>o.newProjectListDialog=l)},{default:e(()=>[t(_,{listid:s.editlistid,close:()=>o.newProjectListDialog=!1,callback:c.getProjectList},null,8,["listid","close","callback"])]),_:1},8,["modelValue"])],64)}const U=P(tt,[["render",et]]),ot={components:{NewProjectList:L},name:"addtolist",data(){return{localuser:f,userinfo:f.user,newProjectListDialog:!1,projectLists:"",star:!1}},methods:{getStarStatus(){p({url:`/projectlist/checkstar?projectid=${this.$route.params.id}`,method:"get"}).then(s=>{this.star=s.star})},ToggleStarProject(){this.star==0?p({url:"/projectlist/star",method:"post",data:{projectid:this.$route.params.id}}).then(s=>{this.star=s.star}):p({url:"/projectlist/unstar",method:"post",data:{projectid:this.$route.params.id}}).then(s=>{this.star=s.star})}},mounted(){this.getStarStatus()}};function rt(s,r,V,w,o,c){return n(),m(j,null,[t(y,{onClick:r[0]||(r[0]=_=>c.ToggleStarProject()),color:o.star?"yellow":"","prepend-icon":"mdi-star",variant:"tonal"},{default:e(()=>r[1]||(r[1]=[i("Star")])),_:1},8,["color"]),i(a(o.projectLists),1)],64)}const E=P(ot,[["render",rt]]),st={components:{ProjectRunner:R,TimeAgo:F,Comment:I,AddTolist:U,ProjectStar:E},data(){return{projectid:this.$route.params.id,project:{id:1,authorid:1,time:"2000-01-01T00:00:00.000Z",view_count:0,like_count:0,type:"text",favo_count:0,title:"",state:"public",description:"",license:"",tags:"",likeid:"",favoid:""},author:{id:1,display_name:"",motto:"",images:""},communityinfo:{stars:""},openEditor:Z,localuser:f}},async mounted(){this.startLiveFetch(),await this.refreshProject(),await this.refreshAuthor()},methods:{startLiveFetch(){q([Number(this.$route.params.id)],s=>{s.length>0&&(this.project=s[0],Q({title:""+this.project.title}))}),K([Number(this.project.authorid)],s=>{s.length>0&&(this.author=s[0])})},async refreshProject(){await z(this.$route.params.id)},async refreshAuthor(){await X(this.project.authorid)}}},it={class:"px-4 d-flex ga-2 mb-2"},lt={class:"px-4 d-flex ga-2 mb-2"},at={class:"px-4 d-flex ga-2 mb-2"},nt={class:"px-4 d-flex ga-2 mb-2"},ut={class:"px-4 d-flex ga-2 mb-2"},dt={class:"px-4"};function ct(s,r,V,w,o,c){const _=R,l=F,k=E,H=U,G=I;return n(),h($,null,{default:e(()=>[t(Y,null,{default:e(()=>[t(v,{xs:"12",sm:"12",md:"8",lg:"8",xl:"8",xxl:"8",cols:"12"},{default:e(()=>[t(_,{type:o.project.type,id:o.project.id},null,8,["type","id"])]),_:1}),t(v,{xs:"12",sm:"12",md:"4",lg:"4",xl:"4",xxl:"8",cols:"12"},{default:e(()=>[t(g,{hover:"",border:""},{default:e(()=>[t(S,null,{default:e(()=>[t(T,null,{default:e(()=>[i(a(o.project.title),1)]),_:1}),t(D,null,{default:e(()=>[i(a(o.project.description),1)]),_:1})]),_:1}),u("div",it,[t(d,{pill:""},{default:e(()=>[t(N,{start:""},{default:e(()=>[t(A,{src:"https://s4-1.wuyuan.1r.ink/user/"+o.author.images},null,8,["src"])]),_:1}),i(a(o.author.display_name),1)]),_:1})]),u("div",lt,[t(d,{pill:"","prepend-icon":"mdi-eye"},{default:e(()=>[i(a(o.project.view_count)+"浏览",1)]),_:1}),t(d,{pill:"","prepend-icon":"mdi-star"},{default:e(()=>[i(a(o.communityinfo.stars)+" Star",1)]),_:1}),t(d,{pill:"","prepend-icon":"mdi-clock"},{default:e(()=>[t(l,{date:o.project.time},null,8,["date"])]),_:1})]),u("div",at,[o.project.state=="public"?(n(),h(d,{key:0,pill:"","prepend-icon":"mdi-xml"},{default:e(()=>r[1]||(r[1]=[i("开源作品")])),_:1})):x("",!0),o.project.state=="private"?(n(),h(d,{key:1,pill:"","prepend-icon":"mdi-xml"},{default:e(()=>r[2]||(r[2]=[i("私密作品")])),_:1})):x("",!0),t(d,{pill:"","prepend-icon":"mdi-application"},{default:e(()=>[i(a(o.project.type),1)]),_:1})]),u("div",nt,[(n(!0),m(j,null,B(o.project.tags,b=>(n(),m("div",null,[t(d,null,{default:e(()=>[i(a(b.name),1)]),_:2},1024)]))),256))]),u("div",ut,[t(k),t(y,{onClick:r[0]||(r[0]=b=>o.openEditor(o.project.id,o.project.type)),variant:"text"},{default:e(()=>r[3]||(r[3]=[i("打开创造页")])),_:1}),o.project.authorid!=o.localuser.user.id?(n(),h(y,{key:0,to:"/projects/"+o.projectid+"/fork",variant:"text"},{default:e(()=>r[4]||(r[4]=[i("改编")])),_:1},8,["to"])):x("",!0)]),u("div",dt,[t(g,{hover:"",to:"/user/"+o.project.authorid,border:""},{default:e(()=>[t(S,null,{prepend:e(()=>[t(N,null,{default:e(()=>[t(A,{alt:o.author.display_name,src:"https://s4-1.wuyuan.1r.ink/user/"+o.author.images},null,8,["alt","src"])]),_:1})]),default:e(()=>[t(T,{class:"text-white"},{default:e(()=>[i(a(o.author.display_name),1)]),_:1}),t(D,{class:"text-white"},{default:e(()=>[i(a(o.author.motto),1)]),_:1})]),_:1})]),_:1},8,["to"])]),r[5]||(r[5]=u("br",null,null,-1))]),_:1}),r[6]||(r[6]=u("br",null,null,-1)),t(g,{hover:"",border:""},{default:e(()=>[t(H)]),_:1})]),_:1}),t(v,{xxl:"8",xl:"8",lg:"8",md:"8",sm:"12",xs:"12",cols:"12"},{default:e(()=>[t(G,{url:"project-"+s.$route.params.id,name:"项目"},null,8,["url"])]),_:1})]),_:1})]),_:1})}const St=P(st,[["render",ct]]);export{St as default};