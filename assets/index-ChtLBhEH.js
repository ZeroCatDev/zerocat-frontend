import{_ as b}from"./NewProjectList-CUAcrgXM.js";import{_ as w,J as p,o as m,c as _,w as l,a as e,a7 as P,a4 as V,a3 as C,M as a,P as v,H as x,G as D,e as g,K as c,R as L,S as N,$ as E,a0 as S,L as r,T as f,a1 as h}from"./index-CKXrJDOz.js";import{V as T}from"./VSelect-CiNHHwEs.js";import{V as q}from"./VSpacer-wfIWC8_m.js";import{V as B}from"./VContainer-BTDJiuwb.js";import{V as j}from"./VDialog-DF_4rrUn.js";import{V as O}from"./VChip-C5rSDCkt.js";import"./openEdit-AJJkPSPH.js";import"./VRow-BM72lIds.js";/* empty css              */import"./VCheckboxBtn-BYlkLyAU.js";import"./VSelectionControl-DeFiw9vy.js";const U={data(){return{listStates:[{state:"私密",abbr:"private"},{state:"公开",abbr:"public"}],created:!1,newid:0,isVisible:!1,listInfo:{},newListInfo:{}}},props:{listid:{type:String,required:!0},callback:{type:Function,required:!1},close:{type:Function,required:!1}},methods:{show(){this.created=!1,this.newid=0,this.isVisible=!0},async getProjectList(n){await p.get("/projectlist/listid/"+n).then(t=>{console.log(t),this.$toast.add({severity:"info",summary:"info",detail:t,life:3e3}),t.status=="success"&&(this.listInfo=Object.assign({},t.data),this.newListInfo=Object.assign({},t.data))}),this.callback()},async updateProjectList(n){await p.post("/projectlist/update/"+n,this.newListInfo).then(t=>{console.log(t),this.$toast.add({severity:"info",summary:"info",detail:t,life:3e3}),t.status=="1"&&(this.listInfo=Object.assign({},t.data),this.newListInfo=Object.assign({},t.data))}),this.callback()},async deleteProjectList(n){await p.delete("/projectlist/"+n).then(t=>{console.log(t),this.$toast.add({severity:"info",summary:"info",detail:t,life:3e3})}),this.callback()}},mounted(){this.getProjectList(this.listid)}};function F(n,t,d,k,i,u){return m(),_(v,{border:"",title:`${i.listInfo.title}(#${i.listInfo.id})`},{default:l(()=>[e(P,null,{default:l(()=>[e(V,{modelValue:i.newListInfo.title,"onUpdate:modelValue":t[0]||(t[0]=o=>i.newListInfo.title=o),label:"名称",required:""},null,8,["modelValue"]),e(V,{modelValue:i.newListInfo.description,"onUpdate:modelValue":t[1]||(t[1]=o=>i.newListInfo.description=o),label:"简介",required:""},null,8,["modelValue"]),e(T,{modelValue:i.newListInfo.state,"onUpdate:modelValue":t[2]||(t[2]=o=>i.newListInfo.state=o),items:i.listStates,"item-title":"state","item-value":"abbr",label:"项目状态"},null,8,["modelValue","items"])]),_:1}),e(C,null,{default:l(()=>[e(a,{text:"删除",variant:"plain",onClick:t[3]||(t[3]=o=>{u.deleteProjectList(d.listid),d.close()}),color:"red"}),e(q),e(a,{text:"回退",variant:"plain",onClick:t[4]||(t[4]=o=>i.newListInfo=Object.assign({},i.listInfo))}),e(a,{text:"关闭",variant:"plain",onClick:t[5]||(t[5]=o=>d.close())}),e(a,{color:"primary",text:"保存",variant:"tonal",onClick:t[6]||(t[6]=o=>u.updateProjectList(d.listid))})]),_:1})]),_:1},8,["title"])}const y=w(U,[["render",F]]),H={components:{NewProjectList:b,EditProjectListConfig:y},async created(){this.localuser.islogin==!1&&this.$router.push("/app/account/login")},data(){return{localuser:x,editlistid:0,EditProjectListConfigDialog:!1,NewProjectListDialog:!1,lists:[]}},methods:{async getProjectList(){this.lists=(await p({url:"/projectlist/my",method:"get"})).data}},mounted(){this.getProjectList()},name:"projectlist",setup(){D({title:"列表"})}},A={class:"d-flex justify-space-between mb-4"},G={class:"d-flex ga-2"};function J(n,t,d,k,i,u){const o=y,I=b;return m(),g(L,null,[e(B,null,{default:l(()=>[c("div",A,[t[3]||(t[3]=c("h1",null,"列表",-1)),c("div",G,[e(a,{onClick:t[0]||(t[0]=s=>i.NewProjectListDialog=!0),border:"",color:"primary",rounded:"lg",slim:"",text:"创建",variant:"flat"})])]),(m(!0),g(L,null,N(i.lists,s=>(m(),g("div",{key:s.id},[e(v,{border:""},{default:l(()=>[e(E,null,{default:l(()=>[e(S,null,{default:l(()=>[r(f(s.title),1),e(O,{color:s.state=="private"?"primary":"green"},{default:l(()=>[r(f(s.state=="private"?"私密":"公开"),1)]),_:2},1032,["color"])]),_:2},1024),e(h,null,{default:l(()=>[r(f(s.createTime+"创建，"+s.updateTime+"更新"),1)]),_:2},1024)]),_:2},1024),e(P,null,{default:l(()=>[r(f(s.description),1)]),_:2},1024),e(C,null,{default:l(()=>[e(a,{onClick:K=>{i.editlistid=s.id,i.EditProjectListConfigDialog=!0}},{default:l(()=>t[4]||(t[4]=[r("编辑")])),_:2},1032,["onClick"]),e(a,{to:`/app/projectlist/${s.id}`},{default:l(()=>t[5]||(t[5]=[r("打开")])),_:2},1032,["to"])]),_:2},1024)]),_:2},1024),t[6]||(t[6]=c("br",null,null,-1))]))),128))]),_:1}),e(j,{modelValue:i.EditProjectListConfigDialog,"onUpdate:modelValue":t[1]||(t[1]=s=>i.EditProjectListConfigDialog=s)},{default:l(()=>[e(o,{listid:i.editlistid,close:()=>i.EditProjectListConfigDialog=!1,callback:u.getProjectList},null,8,["listid","close","callback"])]),_:1},8,["modelValue"]),e(j,{modelValue:i.NewProjectListDialog,"onUpdate:modelValue":t[2]||(t[2]=s=>i.NewProjectListDialog=s)},{default:l(()=>[e(I,{listid:i.editlistid,close:()=>i.NewProjectListDialog=!1,callback:u.getProjectList},null,8,["listid","close","callback"])]),_:1},8,["modelValue"])],64)}const lt=w(H,[["render",J]]);export{lt as default};
