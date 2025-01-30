import{_ as I,H as c,G as U,J as d,r as B,o as V,c as j,w as r,a as t,K as a,ag as f,M as u,a1 as S,a3 as E,T as m,L as s,aa as y,P as b,a4 as F,Q as k,ae as P,a8 as D,a9 as T}from"./index-DFGDNXEX.js";import{g as L}from"./projectService-Bqkob48R.js";import{a as n,V as q}from"./VRow-CzGTsTAp.js";import{V as H}from"./VTextarea-aET61q5j.js";import{V as A}from"./VSelect-zJgCyV1G.js";import{V as G,a as J,b as K,c as M,d as O}from"./VExpansionPanels-BV-cb9rI.js";import{V as Q}from"./VChip-C18j0b7D.js";import{V as g}from"./VSpacer-Dpw5_gD2.js";import{V as h}from"./VDialog-Dri-Z7zh.js";import{V as R}from"./VContainer-XQBTMZ79.js";/* empty css              */import"./VCheckboxBtn-BBG2gdkB.js";import"./VSelectionControl-BnL_j-QK.js";import"./filter-wbK4TYHf.js";const Z={data(){return{localuser:c,states:[{state:"私密",abbr:"private"},{state:"公开",abbr:"public"}],projectID:this.$route.params.id,project:{},newProjectName:"",tags:{items:["动画","故事","音乐","硬核","艺术","水"],chips:[]},changeVisibility:!1,changeVisibilityText:"",confirmDelete:!1,confirmDeleteText:""}},async created(){c.isLogin.value||this.$router.push("/app/account/login"),await this.fetchProject()},setup(){U({title:"项目设置"})},methods:{removeTag(o){this.tags.chips.splice(this.tags.chips.indexOf(o),1)},async fetchProject(){try{const{username:o,projectname:e}=this.$route.params;this.project=await L(o,e),this.projectID=this.project.id,this.newProjectName=this.project.name,this.tags.chips=this.project.tags.map(v=>v.name)}catch(o){console.error(o),this.$toast.add({severity:"error",summary:"错误",detail:"无法获取项目数据",life:3e3})}},async deleteProject(){try{await d.delete(`/project/${this.projectID}`),this.$toast.add({severity:"info",summary:"成功",detail:"项目已删除",life:3e3}),this.$router.push("/explore")}catch(o){console.error(o),this.$toast.add({severity:"error",summary:"错误",detail:"删除项目失败",life:3e3})}},async saveProject(){this.project.tags=this.tags.chips.map(o=>o);try{const o=(await d.put(`/project/id/${this.projectID}`,{id:this.project.id,title:this.project.title,description:this.project.description,type:this.project.type,tags:this.project.tags})).data;this.$toast.add({severity:o.status,summary:o.message,detail:o.message,life:3e3})}catch(o){console.error(o),this.$toast.add({severity:"error",summary:"错误",detail:"保存项目失败",life:3e3})}},async renameProject(){try{const o=(await d.put(`/project/rename/${this.projectID}`,{newName:this.newProjectName})).data;this.$toast.add({severity:o.status,summary:o.message,detail:o.message,life:3e3})}catch(o){console.error(o),this.$toast.add({severity:"error",summary:"错误",detail:"修改项目名称失败",life:3e3})}},async changeProjectVisibility(){try{const o=(await d.put(`/project/changevisibility/${this.projectID}`,{newState:this.project.state==="public"?"private":"public"})).data;this.$toast.add({severity:o.status,summary:o.message,detail:o.message,life:3e3}),this.$router.push(`/explore/${c.user.value.username}/${this.project.name}`)}catch(o){console.error(o),this.$toast.add({severity:"error",summary:"错误",detail:"修改项目状态失败",life:3e3})}},cancel(){this.$router.push("/explore/my")}}};function z(o,e,v,W,l,p){const x=B("v-if");return V(),j(R,null,{default:r(()=>[t(q,null,{default:r(()=>[t(n,{cols:"12"},{default:r(()=>e[13]||(e[13]=[a("h1",null,"常规",-1)])),_:1}),t(n,{cols:"7"},{default:r(()=>[t(f,{label:"项目名称",required:"",modelValue:l.newProjectName,"onUpdate:modelValue":e[0]||(e[0]=i=>l.newProjectName=i),hint:"修改项目名称",variant:"outlined"},{append:r(()=>[t(u,{color:"primary",text:"修改名称",variant:"tonal",onClick:p.renameProject},null,8,["onClick"])]),_:1},8,["modelValue"])]),_:1}),t(n,{cols:"12"},{default:r(()=>[t(S)]),_:1}),t(n,{cols:"7"},{default:r(()=>[t(f,{label:"项目标题",required:"",modelValue:l.project.title,"onUpdate:modelValue":e[1]||(e[1]=i=>l.project.title=i),hint:"可读性更好的标题",variant:"outlined"},null,8,["modelValue"])]),_:1}),t(n,{cols:"12"},{default:r(()=>[t(H,{hint:"介绍作品类型，玩法，并向对这个作品有帮助的人致谢！",label:"简介",modelValue:l.project.description,"onUpdate:modelValue":e[2]||(e[2]=i=>l.project.description=i),variant:"outlined"},null,8,["modelValue"])]),_:1}),t(n,{cols:"12",sm:"6"},{default:r(()=>[t(A,{items:["scratch","python","text"],label:"类型",required:"",hint:"不建议你改",modelValue:l.project.type,"onUpdate:modelValue":e[3]||(e[3]=i=>l.project.type=i),variant:"outlined"},null,8,["modelValue"])]),_:1}),t(n,{cols:"12"},{default:r(()=>[t(G,{modelValue:l.tags.chips,"onUpdate:modelValue":e[4]||(e[4]=i=>l.tags.chips=i),items:l.tags.items,label:"标签","prepend-icon":"mdi-tag",variant:"outlined",chips:"",multiple:""},{selection:r(({attrs:i,item:C,select:w,selected:N})=>[t(Q,E(i,{"model-value":N,closable:"",onClick:w,"onClick:close":X=>p.removeTag(C)}),{default:r(()=>[a("strong",null,m(C.name),1),e[14]||(e[14]=s("  ")),e[15]||(e[15]=a("span",null,"(interest)",-1))]),_:2},1040,["model-value","onClick","onClick:close"])]),_:1},8,["modelValue","items"])]),_:1}),t(n,{cols:"12"},{default:r(()=>[t(y,null,{default:r(()=>[t(g),t(u,{text:"取消",variant:"plain",onClick:p.cancel},null,8,["onClick"]),t(u,{color:"primary",text:"保存",variant:"tonal",onClick:p.saveProject},null,8,["onClick"])]),_:1})]),_:1}),t(n,{cols:"12"},{default:r(()=>e[16]||(e[16]=[a("h1",null,"危险",-1)])),_:1}),t(n,{cols:"12"},{default:r(()=>[t(b,null,{default:r(()=>[t(F,null,{default:r(()=>[t(k,{title:"删除此项目",subtitle:"删除此项目后无法恢复。"},{append:r(()=>[t(u,{color:"error",text:"删除此项目",variant:"tonal",onClick:e[5]||(e[5]=i=>l.confirmDelete=!0)})]),_:1}),t(k,{title:"更改项目可见性",subtitle:"选择项目的可见性，公开或私密。"},{append:r(()=>[t(u,{color:"error",text:"更改项目可见性",variant:"tonal",onClick:e[6]||(e[6]=i=>l.changeVisibility=!0)})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),t(O,null,{default:r(()=>[t(J,null,{default:r(()=>[t(K,null,{default:r(()=>e[17]||(e[17]=[s("详细数据")])),_:1}),t(M,null,{default:r(()=>[s(m(l.project),1)]),_:1})]),_:1})]),_:1}),t(h,{modelValue:l.confirmDelete,"onUpdate:modelValue":e[9]||(e[9]=i=>l.confirmDelete=i),"max-width":"500px"},{default:r(()=>[t(b,null,{default:r(()=>[t(P,{class:"headline"},{default:r(()=>[s("删除 "+m(l.project.title),1)]),_:1}),t(D,null,{default:r(()=>[e[18]||(e[18]=s("你确定要删除这个项目吗？此操作无法撤销。")),e[19]||(e[19]=a("br",null,null,-1)),s("这将永久删除 "+m(l.project.title)+" 项目、推送、Star、评论、和其他所有数据，移除Fork对此项目的关联（但不会删除Fork）。",1),e[20]||(e[20]=a("br",null,null,-1)),e[21]||(e[21]=s("要确认，请在下面的框中输入提示的小字以确认您的操作。 ")),e[22]||(e[22]=a("br",null,null,-1)),e[23]||(e[23]=a("br",null,null,-1)),t(f,{variant:"outlined",label:`${l.localuser.user.username}/${l.project.name}`,modelValue:l.confirmDeleteText,"onUpdate:modelValue":e[7]||(e[7]=i=>l.confirmDeleteText=i)},null,8,["label","modelValue"])]),_:1}),t(y,null,{default:r(()=>[t(g),t(u,{color:"primary",text:"",onClick:e[8]||(e[8]=i=>{l.confirmDelete=!1,l.confirmDeleteText=""})},{default:r(()=>e[24]||(e[24]=[s("取消")])),_:1}),t(u,{color:"error",text:"",onClick:p.deleteProject,disabled:l.confirmDeleteText!==`${l.localuser.user.username}/${l.project.name}`},{default:r(()=>e[25]||(e[25]=[s("删除")])),_:1},8,["onClick","disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),t(h,{modelValue:l.changeVisibility,"onUpdate:modelValue":e[12]||(e[12]=i=>l.changeVisibility=i),"max-width":"500px"},{default:r(()=>[t(b,null,{default:r(()=>[t(P,{class:"headline"},{default:r(()=>[s(m(l.project.state==="public"?"私密":"公开")+" "+m(l.project.title),1)]),_:1}),t(D,null,{default:r(()=>[l.project.state==="public"?(V(),j(x,{key:0},{default:r(()=>e[26]||(e[26]=[s(" 将此仓库设为私有将删除不再有权访问此仓库的用户的 star。如果您决定在将来公开此存储库，则无法恢复这些 star ，这将影响项目的排名。"),a("br",null,null,-1),s(" 此项目的Fork将保持公开，且不再与此项目有任何关联。 ")])),_:1})):T("",!0),l.project.state==="private"?(V(),j(x,{key:1},{default:r(()=>e[27]||(e[27]=[s(" 该项目将对可以访问ZeroCat的每个人都可见"),a("br",null,null,-1),s(" 任何人都可以复制或下载您的仓库。"),a("br",null,null,-1),s(" 您的操作历史记录和日志将对所有人可见。 ")])),_:1})):T("",!0),e[28]||(e[28]=a("br",null,null,-1)),e[29]||(e[29]=a("br",null,null,-1)),e[30]||(e[30]=s(" 要确认，请在下面的框中输入提示的小字以确认您的操作。 ")),e[31]||(e[31]=a("br",null,null,-1)),e[32]||(e[32]=a("br",null,null,-1)),t(f,{variant:"outlined",label:`${l.localuser.user.username}/${l.project.name}`,modelValue:l.changeVisibilityText,"onUpdate:modelValue":e[10]||(e[10]=i=>l.changeVisibilityText=i)},null,8,["label","modelValue"])]),_:1}),t(y,null,{default:r(()=>[t(g),t(u,{color:"primary",text:"",onClick:e[11]||(e[11]=i=>l.changeVisibility=!1)},{default:r(()=>e[33]||(e[33]=[s("取消")])),_:1}),t(u,{color:"error",text:"",onClick:p.changeProjectVisibility,disabled:l.changeVisibilityText!==`${l.localuser.user.username}/${l.project.name}`},{default:r(()=>[s(m(l.project.state==="public"?"设置为私密":"设置为公开"),1)]),_:1},8,["onClick","disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}const pe=I(Z,[["render",z]]);export{pe as default};
