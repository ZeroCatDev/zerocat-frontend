import{_ as y,Q as d,c as h,o as V,w as a,a as s,U as u,am as f,al as c,I as r,K as m,as as I,H as n,O as b}from"./index-F5qDKYkW.js";import{V as v}from"./VSelect-DF5gvIZP.js";import{V as p}from"./VSpacer-B6Wnk0eJ.js";import{V as w}from"./VDialog-gGeIcDsD.js";const L={data(){return{listStates:[{state:"私密",abbr:"private"},{state:"公开",abbr:"public"}],loading:!0,saving:!1,deleting:!1,deleteDialog:!1,listInfo:{},newListInfo:{}}},props:{listid:{type:String,required:!0},callback:{type:Function,required:!1},close:{type:Function,required:!1}},computed:{hasChanges(){return JSON.stringify(this.listInfo)!==JSON.stringify(this.newListInfo)}},methods:{async getProjectList(i){this.loading=!0;try{const t=await d.get(`/projectlist/lists/listid/${i}`);t.data.status==="success"?(this.listInfo=JSON.parse(JSON.stringify(t.data.data)),this.newListInfo=JSON.parse(JSON.stringify(t.data.data))):this.$toast.add({severity:"error",summary:"错误",detail:t.data.message||"获取列表信息失败",life:3e3})}catch(t){console.error("获取列表信息失败:",t),this.$toast.add({severity:"error",summary:"错误",detail:"获取列表信息失败",life:3e3})}finally{this.loading=!1}},async updateProjectList(){if(this.newListInfo.title){this.saving=!0;try{const i=await d.post(`/projectlist/lists/update/${this.listid}`,this.newListInfo);this.$toast.add({severity:i.data.status==="success"?"success":"error",summary:i.data.status==="success"?"成功":"错误",detail:i.data.message||"更新列表信息",life:3e3}),i.data.status==="success"&&(this.listInfo=JSON.parse(JSON.stringify(this.newListInfo)),this.callback&&this.callback())}catch(i){console.error("更新列表信息失败:",i),this.$toast.add({severity:"error",summary:"错误",detail:"更新列表信息失败",life:3e3})}finally{this.saving=!1}}},confirmDelete(){this.deleteDialog=!0},async deleteProjectList(){this.deleting=!0;try{const i=await d.post("/projectlist/lists/delete",{id:this.listid});this.$toast.add({severity:i.data.status==="success"?"info":"error",summary:i.data.status==="success"?"成功":"错误",detail:i.data.message||"删除列表",life:3e3}),i.data.status==="success"&&(this.deleteDialog=!1,this.callback&&this.callback(),this.close&&this.close())}catch(i){console.error("删除列表失败:",i),this.$toast.add({severity:"error",summary:"错误",detail:"删除列表失败",life:3e3})}finally{this.deleting=!1}}},mounted(){this.getProjectList(this.listid)}};function x(i,t,g,C,e,o){return V(),h(m,{border:"",title:`${e.listInfo.title||"加载中..."}`,subtitle:`ID: ${e.listInfo.id||""}`,loading:e.loading},{default:a(()=>[s(u,null,{default:a(()=>[s(f,{modelValue:e.newListInfo.title,"onUpdate:modelValue":t[0]||(t[0]=l=>e.newListInfo.title=l),label:"名称",required:"",rules:[l=>!!l||"名称不能为空"]},null,8,["modelValue","rules"]),s(f,{modelValue:e.newListInfo.description,"onUpdate:modelValue":t[1]||(t[1]=l=>e.newListInfo.description=l),label:"简介"},null,8,["modelValue"]),s(v,{modelValue:e.newListInfo.state,"onUpdate:modelValue":t[2]||(t[2]=l=>e.newListInfo.state=l),items:e.listStates,"item-title":"state","item-value":"abbr",label:"项目状态"},null,8,["modelValue","items"])]),_:1}),s(c,null,{default:a(()=>[s(r,{text:"删除",variant:"plain",onClick:o.confirmDelete,color:"error","prepend-icon":"mdi-delete"},null,8,["onClick"]),s(p),s(r,{text:"重置",variant:"plain",onClick:t[3]||(t[3]=l=>e.newListInfo=JSON.parse(JSON.stringify(e.listInfo))),"prepend-icon":"mdi-refresh",disabled:!o.hasChanges},null,8,["disabled"]),s(r,{text:"关闭",variant:"plain",onClick:t[4]||(t[4]=l=>g.close())}),s(r,{color:"primary",text:"保存",variant:"tonal",onClick:o.updateProjectList,loading:e.saving,disabled:!o.hasChanges||!e.newListInfo.title,"prepend-icon":"mdi-content-save"},null,8,["onClick","loading","disabled"])]),_:1}),s(w,{modelValue:e.deleteDialog,"onUpdate:modelValue":t[6]||(t[6]=l=>e.deleteDialog=l),"max-width":"500px"},{default:a(()=>[s(m,null,{default:a(()=>[s(I,{class:"text-h5"},{default:a(()=>t[7]||(t[7]=[n("确认删除")])),_:1}),s(u,null,{default:a(()=>[n(' 您确定要删除列表 "'+b(e.listInfo.title)+'" 吗？此操作不可撤销。 ',1)]),_:1}),s(c,null,{default:a(()=>[s(p),s(r,{color:"primary",variant:"text",onClick:t[5]||(t[5]=l=>e.deleteDialog=!1)},{default:a(()=>t[8]||(t[8]=[n("取消")])),_:1}),s(r,{color:"error",variant:"text",onClick:o.deleteProjectList,loading:e.deleting},{default:a(()=>t[9]||(t[9]=[n("删除")])),_:1},8,["onClick","loading"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["title","subtitle","loading"])}const O=y(L,[["render",x]]);export{O as _};
