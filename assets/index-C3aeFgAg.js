import{_ as te}from"./Comment-ChwP5BMJ.js";import{_ as ie}from"./Projects-BUcPyg-U.js";import{f as I,p as B,U as de,n as J,t as g,y as ce,s as me,i as $,a as i,W as C,X as ue,E as se,Y as ae,B as le,k as N,Z as oe,u as _e,$ as pe,R as he,a0 as fe,a1 as z,A as ne,j as ye,l as ve,a2 as ge,a3 as xe,a4 as be,a5 as K,z as Ce,a6 as je,a7 as ke,_ as Te,c as b,o as r,w as l,a8 as Ve,a9 as P,G as a,J as we,H as u,O as n,P as Q,aa as De,e as h,M as V,N as S,K as j,ab as w,ac as D,I as ze,Q as X,T as Pe}from"./index-DW2qZQer.js";import{g as Se}from"./user-BsiZMwXc.js";import{V as Y,a as ee}from"./VRow-Bluyqg-o.js";import{V as v}from"./VChip-AzgfEEOk.js";import{V as Ie}from"./VContainer-DoSenoK6.js";import"./VForm-D2uAQm14.js";import"./VTextarea-m7OlFSZL.js";import"./VDialog-BLl_TtvY.js";import"./showProjects-DY-BU9v6.js";import"./projectService-IPpB03sj.js";import"./43-lazyload-CBkwrR6M.js";import"./VPagination-AIoAFPXu.js";/* empty css              */const Be=B({dotColor:String,fillDot:Boolean,hideDot:Boolean,icon:oe,iconColor:String,lineColor:String,...N(),...le(),...ae(),...se()},"VTimelineDivider"),$e=I()({name:"VTimelineDivider",props:Be(),setup(e,s){let{slots:c}=s;const{sizeClasses:x,sizeStyles:o}=de(e,"v-timeline-divider__dot"),{backgroundColorStyles:f,backgroundColorClasses:y}=J(g(e,"dotColor")),{roundedClasses:_}=ce(e,"v-timeline-divider__dot"),{elevationClasses:t}=me(e),{backgroundColorClasses:k,backgroundColorStyles:T}=J(g(e,"lineColor"));return $(()=>i("div",{class:["v-timeline-divider",{"v-timeline-divider--fill-dot":e.fillDot},e.class],style:e.style},[i("div",{class:["v-timeline-divider__before",k.value],style:T.value},null),!e.hideDot&&i("div",{key:"dot",class:["v-timeline-divider__dot",t.value,_.value,x.value],style:o.value},[i("div",{class:["v-timeline-divider__inner-dot",y.value,_.value],style:f.value},[c.default?i(ue,{key:"icon-defaults",disabled:!e.icon,defaults:{VIcon:{color:e.iconColor,icon:e.icon,size:e.size}}},c.default):i(C,{key:"icon",color:e.iconColor,icon:e.icon,size:e.size},null)])]),i("div",{class:["v-timeline-divider__after",k.value],style:T.value},null)])),{}}}),re=B({density:String,dotColor:String,fillDot:Boolean,hideDot:Boolean,hideOpposite:{type:Boolean,default:void 0},icon:oe,iconColor:String,lineInset:[Number,String],...N(),...ye(),...se(),...le(),...ae(),...ne()},"VTimelineItem"),Ne=I()({name:"VTimelineItem",props:re(),setup(e,s){let{slots:c}=s;const{dimensionStyles:x}=_e(e),o=pe(0),f=he();return fe(f,y=>{var _;y&&(o.value=((_=y.$el.querySelector(".v-timeline-divider__dot"))==null?void 0:_.getBoundingClientRect().width)??0)},{flush:"post"}),$(()=>{var y,_;return i("div",{class:["v-timeline-item",{"v-timeline-item--fill-dot":e.fillDot},e.class],style:[{"--v-timeline-dot-size":z(o.value),"--v-timeline-line-inset":e.lineInset?`calc(var(--v-timeline-dot-size) / 2 + ${z(e.lineInset)})`:z(0)},e.style]},[i("div",{class:"v-timeline-item__body",style:x.value},[(y=c.default)==null?void 0:y.call(c)]),i($e,{ref:f,hideDot:e.hideDot,icon:e.icon,iconColor:e.iconColor,size:e.size,elevation:e.elevation,dotColor:e.dotColor,fillDot:e.fillDot,rounded:e.rounded},{default:c.icon}),e.density!=="compact"&&i("div",{class:"v-timeline-item__opposite"},[!e.hideOpposite&&((_=c.opposite)==null?void 0:_.call(c))])])}),{}}}),Le=B({align:{type:String,default:"center",validator:e=>["center","start"].includes(e)},direction:{type:String,default:"vertical",validator:e=>["vertical","horizontal"].includes(e)},justify:{type:String,default:"auto",validator:e=>["auto","center"].includes(e)},side:{type:String,validator:e=>e==null||["start","end"].includes(e)},lineThickness:{type:[String,Number],default:2},lineColor:String,truncateLine:{type:String,validator:e=>["start","end","both"].includes(e)},...ke(re({lineInset:0}),["dotColor","fillDot","hideOpposite","iconColor","lineInset","size"]),...N(),...je(),...ne(),...Ce()},"VTimeline"),Me=I()({name:"VTimeline",props:Le(),setup(e,s){let{slots:c}=s;const{themeClasses:x}=ve(e),{densityClasses:o}=ge(e),{rtlClasses:f}=xe();be({VTimelineDivider:{lineColor:g(e,"lineColor")},VTimelineItem:{density:g(e,"density"),dotColor:g(e,"dotColor"),fillDot:g(e,"fillDot"),hideOpposite:g(e,"hideOpposite"),iconColor:g(e,"iconColor"),lineColor:g(e,"lineColor"),lineInset:g(e,"lineInset"),size:g(e,"size")}});const y=K(()=>{const t=e.side?e.side:e.density!=="default"?"end":null;return t&&`v-timeline--side-${t}`}),_=K(()=>{const t=["v-timeline--truncate-line-start","v-timeline--truncate-line-end"];switch(e.truncateLine){case"both":return t;case"start":return t[0];case"end":return t[1];default:return null}});return $(()=>i(e.tag,{class:["v-timeline",`v-timeline--${e.direction}`,`v-timeline--align-${e.align}`,`v-timeline--justify-${e.justify}`,_.value,{"v-timeline--inset-line":!!e.lineInset},x.value,o.value,y.value,f.value,e.class],style:[{"--v-timeline-line-thickness":z(e.lineThickness)},e.style]},c)),{}}}),Re={components:{Projects:ie,Comment:te},data(){return{username:this.$route.params.username,user:{},lists:[],url:"",tab:this.$route.query.tab||"home",timeline:{events:[],pagination:{current:1,size:20,total:0}},currentPage:1,isLoadingMore:!1,pageSize:20,eventTypes:{project_create:{text:"创建了新项目",label:"新建",color:"success",isProject:!0},project_publish:{text:"更新了项目",label:"更新",color:"info",isProject:!0},project_fork:{text:"复刻了项目",label:"复刻",color:"warning",isProject:!0},project_delete:{text:"删除了项目",label:"删除",color:"error",isProject:!0},comment_create:{text:"发表了评论",label:"评论",color:"secondary"},user_profile_update:{text:"更新了个人资料",label:"更新",color:"info"},user_register:{text:"加入了 ZeroCat",label:"注册",color:"primary"},project_commit:{text:"提交了项目更新",label:"提交",color:"info",isProject:!0},project_rename:{text:"重命名了项目",label:"重命名",color:"warning",isProject:!0},project_info_update:{text:"更新了项目信息",label:"更新信息",color:"info",isProject:!0}},fieldDisplayNames:{display_name:"昵称",motto:"个性签名",sex:"性别",birthday:"生日",avatar:"头像",background:"背景图片",email:"邮箱",phone:"手机号",website:"个人网站",bio:"个人简介",social_links:"社交链接",preferences:"偏好设置",visibility:"可见性设置",language:"语言设置"}}},watch:{"$route.query.tab"(e){this.tab=e||"home"}},async created(){await this.fetchUser(),await this.getProjectList(),await this.fetchTimeline(),this.tab=this.$route.query.tab||"home"},computed:{hasMoreEvents(){return this.timeline.events.length<this.timeline.pagination.total}},methods:{async fetchUser(){this.user=await Se(this.username),Pe({title:""+this.user.display_name}),this.url=`/searchapi?search_userid=${this.user.id}&search_type=&search_title=&search_source=&search_description=&search_orderby=view_up&search_state=public&search_tag=`},async getProjectList(){this.lists=(await X({url:`/projectlist/userid/${this.user.id}/public`,method:"get"})).data.data},async fetchTimeline(e=1){try{const s=await X.get(`/timeline/user/${this.user.id}`,{params:{page:e,limit:this.pageSize}});s.data.status==="success"&&(e===1?this.timeline=s.data.data:(this.timeline.events=[...this.timeline.events,...s.data.data.events],this.timeline.pagination=s.data.data.pagination))}catch(s){console.error("Failed to fetch timeline:",s)}},getUpdatedFields(e){return e!=null&&e.length?e.map(s=>this.fieldDisplayNames[s]||s).join("、"):""},async loadMoreEvents(){if(!(this.isLoadingMore||!this.hasMoreEvents))try{this.isLoadingMore=!0,this.currentPage+=1,await this.fetchTimeline(this.currentPage)}catch(e){console.error("Failed to load more events:",e)}finally{this.isLoadingMore=!1}},getTargetContent(e,s){if(!e)return"";switch(e.type){case"project":return e.title||`项目 #${e.id}`;case"user":return e.display_name||`用户 #${e.id}`;case"comment":return this.getCommentTargetContent(e,s);case"projectlist":return`项目列表 #${e.id}`;default:return`${e.type} #${e.id}`}},getCommentTargetContent(e,s){var o;if(!e.page&&!((o=e.page)!=null&&o.type))return`评论 #${e.id}`;const{type:c,id:x}=e.page||{};switch(c){case"project":return`在作品 ${e.title} 下的评论`;case"user":return`在用户 ${e.display_name} 主页下的评论`;default:return`在 ${c} #${x} 下的评论`}},getFieldDisplayName(e){return{title:"标题",description:"描述",type:"类型",state:"状态",visibility:"可见性",tags:"标签",category:"分类"}[e]||e}}},Ee={class:"font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username"},Ue={class:"mt-2 text-body-1 text-medium-emphasis"},Fe={class:"mt-2 text-medium-emphasis"},Oe={class:"timeline-item-content"},qe={class:"event-header mb-2"},We={class:"text-h6"},Ze={class:"project-info"},Ae={class:"font-weight-medium"},He={class:"mt-2 text-caption text-medium-emphasis"},Ge={class:"d-flex align-center mb-2"},Je={class:"font-weight-medium"},Ke={class:"rename-details text-body-2"},Qe={class:"d-flex align-center"},Xe={class:"d-flex align-center mt-1"},Ye={class:"project-meta text-caption text-medium-emphasis mt-2"},et={class:"d-flex align-center mb-2"},tt={class:"font-weight-medium"},it={class:"commit-message text-body-2"},st={class:"commit-hash text-caption text-medium-emphasis mt-1"},at={class:"d-flex align-center mb-2"},lt={class:"font-weight-medium"},ot={class:"info-updates text-body-2"},nt={class:"d-flex align-center"},rt={class:"d-flex flex-column mt-1 field-changes"},dt={class:"old-value"},ct={class:"ml-2"},mt={class:"new-value"},ut={class:"ml-2 text-info"},_t={class:"project-meta text-caption text-medium-emphasis mt-2"},pt={key:2,class:"event-content pa-2"},ht=["href"],ft=["href"],yt={key:2,class:"comment-text mt-2"},vt={key:1,class:"text-body-2"},gt={key:2,class:"text-body-2 text-medium-emphasis"},xt={class:"d-flex justify-center mt-4 mb-4"},bt={key:1,class:"text-medium-emphasis"};function Ct(e,s,c,x,o,f){const y=ie,_=te;return r(),b(Ie,null,{default:l(()=>[i(Ve,{modelValue:o.tab,"onUpdate:modelValue":s[0]||(s[0]=t=>o.tab=t)},{default:l(()=>[i(P,{value:"home"},{default:l(()=>[i(we,{class:"mt-8"},{default:l(()=>[i(Y,{class:"d-flex align-center"},{default:l(()=>[i(ee,null,{default:l(()=>[s[2]||(s[2]=a("p",{class:"font-weight-medium text-primary"},"ZeroCat 用户",-1)),a("p",Ee,[u(n(o.user.display_name)+" ",1),i(Q,{size:"52",class:"ma-2"},{default:l(()=>[i(De,{src:"https://s4-1.wuyuan.1r.ink/user/"+o.user.images},null,8,["src"])]),_:1})]),a("p",Ue,n(o.user.motto),1),a("p",Fe,[i(v,null,{default:l(()=>[i(C,{icon:"mdi-account-circle",start:""}),u(" ID:"+n(o.user.id),1)]),_:1}),i(v,null,{default:l(()=>[i(C,{icon:"mdi-clock",start:""}),u(" "+n(o.user.regTime)+"注册 ",1)]),_:1}),i(v,null,{default:l(()=>[i(C,{icon:"mdi-tag",start:""}),s[1]||(s[1]=u(" 创作者 "))]),_:1})])]),_:1})]),_:1})]),_:1}),s[3]||(s[3]=a("br",null,null,-1)),i(y,{url:o.url},null,8,["url"]),i(Y,null,{default:l(()=>[(r(!0),h(V,null,S(o.lists,t=>(r(),b(ee,{cols:"12",xs:"12",sm:"6",md:"4",lg:"3",xl:"2",xxl:"2",key:t.id},{default:l(()=>[i(j,{rounded:"lg"},{default:l(()=>[i(j,{to:"/app/projectlist/"+t.id,rounded:"lg",title:t.title,subtitle:t.description,color:"primary",variant:"tonal"},null,8,["to","title","subtitle"])]),_:2},1024)]),_:2},1024))),128))]),_:1}),s[4]||(s[4]=a("br",null,null,-1)),i(_,{url:"user-"+o.user.id,name:"用户"},null,8,["url"])]),_:1}),i(P,{value:"comment"},{default:l(()=>[i(_,{url:"user-"+o.user.id,name:"用户"},null,8,["url"])]),_:1}),i(P,{value:"timeline"},{default:l(()=>[i(Me,{side:"end",align:"start",class:"mt-4"},{default:l(()=>[(r(!0),h(V,null,S(o.timeline.events,t=>(r(),b(Ne,{key:t.id,size:"small","dot-color":"primary"},{opposite:l(()=>[u(n(new Date(t.created_at).toLocaleString()),1)]),icon:l(()=>[i(Q,{image:"https://s4-1.wuyuan.1r.ink/user/"+o.user.images},null,8,["image"])]),default:l(()=>{var k,T,L,M,R,E,U,F,O,q,W,Z,A;return[a("div",Oe,[a("div",qe,[a("h3",We,n(t.actor.display_name)+" "+n(((k=o.eventTypes[t.type])==null?void 0:k.text)||"进行了操作"),1),i(v,{size:"x-small",color:((T=o.eventTypes[t.type])==null?void 0:T.color)||"primary",class:"ml-2"},{default:l(()=>{var m;return[u(n(((m=o.eventTypes[t.type])==null?void 0:m.label)||t.type),1)]}),_:2},1032,["color"])]),(L=o.eventTypes[t.type])!=null&&L.isProject&&!["project_rename","project_commit"].includes(t.type)?(r(),b(j,{key:0,class:"mb-3 project-event",to:`/app/link/project?id=${(M=t.target)==null?void 0:M.id}`},{default:l(()=>[i(w,null,{default:l(()=>{var m,d;return[a("div",Ze,[i(C,{icon:"mdi-source-repository",color:"primary",class:"mr-2"}),a("span",Ae,n(((m=t.event_data)==null?void 0:m.project_name)||"未命名项目"),1),a("div",He,n((d=t.event_data)==null?void 0:d.project_description),1)])]}),_:2},1024)]),_:2},1032,["to"])):["project_rename","project_commit","project_info_update"].includes(t.type)?(r(),h(V,{key:1},[t.type==="project_rename"?(r(),b(j,{key:0,class:"rename-card mb-3",to:`/app/link/project?id=${(R=t.target)==null?void 0:R.id}`},{default:l(()=>[i(w,null,{default:l(()=>{var m;return[a("div",Ge,[i(C,{icon:"mdi-rename-box",color:"warning",class:"mr-2"}),a("span",Je,n((m=t.event_data)==null?void 0:m.project_title),1)]),a("div",Ke,[a("div",Qe,[s[5]||(s[5]=a("span",{class:"text-medium-emphasis"},"从",-1)),i(v,{size:"small",class:"mx-2",color:"surface-variant"},{default:l(()=>{var d;return[u(n((d=t.event_data)==null?void 0:d.old_name),1)]}),_:2},1024)]),a("div",Xe,[s[6]||(s[6]=a("span",{class:"text-medium-emphasis"},"到",-1)),i(v,{size:"small",class:"mx-2",color:"warning"},{default:l(()=>{var d;return[u(n((d=t.event_data)==null?void 0:d.new_name),1)]}),_:2},1024)])]),a("div",Ye,[i(v,{size:"x-small",class:"mr-1"},{default:l(()=>{var d;return[u(n((d=t.event_data)==null?void 0:d.project_type),1)]}),_:2},1024),i(v,{size:"x-small"},{default:l(()=>{var d;return[u(n((d=t.event_data)==null?void 0:d.project_state),1)]}),_:2},1024)])]}),_:2},1024)]),_:2},1032,["to"])):t.type==="project_commit"?(r(),b(j,{key:1,class:"commit-card mb-3",to:`/app/link/project?id=${(E=t.target)==null?void 0:E.id}`},{default:l(()=>[i(w,null,{default:l(()=>{var m,d,p;return[a("div",et,[i(C,{icon:"mdi-source-commit",color:"info",class:"mr-2"}),a("span",tt,"分支: "+n((m=t.event_data)==null?void 0:m.branch),1)]),a("div",it,n((d=t.event_data)==null?void 0:d.commit_message),1),a("div",st," 提交ID: "+n((p=t.event_data)==null?void 0:p.commit_id.substring(0,7)),1)]}),_:2},1024)]),_:2},1032,["to"])):t.type==="project_info_update"?(r(),b(j,{key:2,class:"info-update-card mb-3",to:`/app/link/project?id=${(U=t.target)==null?void 0:U.id}`},{default:l(()=>[i(w,null,{default:l(()=>{var m,d;return[a("div",at,[i(C,{icon:"mdi-file-document-edit",color:"info",class:"mr-2"}),a("span",lt,n((m=t.event_data)==null?void 0:m.project_title),1)]),a("div",ot,[(r(!0),h(V,null,S((d=t.event_data)==null?void 0:d.updated_fields,p=>{var H,G;return r(),h("div",{key:p,class:"update-item mb-2"},[a("div",nt,[i(v,{size:"x-small",color:"info",class:"mr-2"},{default:l(()=>[u(n(f.getFieldDisplayName(p)),1)]),_:2},1024)]),a("div",rt,[a("div",dt,[s[7]||(s[7]=a("span",{class:"text-medium-emphasis"},"从：",-1)),a("span",ct,n((H=t.event_data)==null?void 0:H.old_values[p]),1)]),a("div",mt,[s[8]||(s[8]=a("span",{class:"text-medium-emphasis"},"到：",-1)),a("span",ut,n((G=t.event_data)==null?void 0:G.new_values[p]),1)])])])}),128))]),a("div",_t,[i(v,{size:"x-small",class:"mr-1"},{default:l(()=>{var p;return[u(n((p=t.event_data)==null?void 0:p.project_type),1)]}),_:2},1024),i(v,{size:"x-small"},{default:l(()=>{var p;return[u(n((p=t.event_data)==null?void 0:p.project_state),1)]}),_:2},1024)])]}),_:2},1024)]),_:2},1032,["to"])):D("",!0)],64)):(r(),h("div",pt,[t.type==="comment_create"?(r(),h(V,{key:0},[((F=t.target)==null?void 0:F.type)==="project"?(r(),h("a",{key:0,href:`/app/link/project?id=${t.target.id}#comment-${t.target.id}`,class:"text-decoration-none"}," 在作品「"+n(((O=t.event_data)==null?void 0:O.project_name)||`#${t.target.id}`)+"」中 ",9,ht)):((q=t.target)==null?void 0:q.type)==="user"?(r(),h("a",{key:1,href:`/app/link/user?id=${t.target.id}#comment-${t.target.id}`,class:"text-decoration-none"}," 在用户「"+n(((W=t.event_data)==null?void 0:W.user_name)||`#${t.target.id}`)+"」主页中 ",9,ft)):D("",!0),(Z=t.event_data)!=null&&Z.comment_text?(r(),h("p",yt,n(t.event_data.comment_text),1)):D("",!0)],64)):t.type==="user_profile_update"?(r(),h("div",vt," 更新了："+n(f.getUpdatedFields((A=t.event_data)==null?void 0:A.updated_fields)),1)):(r(),h("div",gt,n(f.getTargetContent(t.target,t.type)),1))]))])]}),_:2},1024))),128))]),_:1}),a("div",xt,[f.hasMoreEvents?(r(),b(ze,{key:0,loading:o.isLoadingMore,variant:"tonal",onClick:f.loadMoreEvents},{default:l(()=>s[9]||(s[9]=[u(" 加载更多 ")])),_:1},8,["loading","onClick"])):o.timeline.events.length>0?(r(),h("div",bt," 没有更多内容了 ")):D("",!0)])]),_:1})]),_:1},8,["modelValue"])]),_:1})}const Rt=Te(Re,[["render",Ct],["__scopeId","data-v-29d28136"]]);export{Rt as default};
