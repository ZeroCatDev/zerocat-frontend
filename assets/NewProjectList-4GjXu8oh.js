import{o as d}from"./openEdit-AJJkPSPH.js";import{_ as c,J as f,o as p,c as u,w as o,a as e,ac as m,ab as V,$ as _,aa as b,M as n,P as w}from"./index-McIR37H2.js";import{V as x,a as I}from"./VRow-C5BVDfSN.js";import{V as h}from"./VSpacer-CAKtwwcK.js";const j={data(){return{projectInfo:{title:"新建项目列表"},created:!1,newId:0,isVisibleDialog:!1,openEdit:d}},props:{callback:{type:Function,required:!1},close:{type:Function,required:!1}},methods:{show(){this.projectInfo={title:"新建项目列表"},this.created=!1,this.newId=0,this.isVisibleDialog=!0},async newProjectList(){await f.post("/projectlist/create",this.projectInfo).then(a=>{console.log(a),this.$toast.add({severity:"info",summary:"info",detail:a.data,life:3e3}),a.data.status=="success"&&(this.newId=a.data.id)}),this.callback()}}};function C(a,t,l,k,s,r){return p(),u(w,{"prepend-icon":"mdi-xml",title:"新建列表",border:""},{default:o(()=>[e(m,null,{default:o(()=>[e(x,{dense:""},{default:o(()=>[e(I,{cols:"12",md:"12",sm:"12"},{default:o(()=>[e(V,{label:"标题",required:"",hint:"将便于查找",modelValue:s.projectInfo.title,"onUpdate:modelValue":t[0]||(t[0]=i=>s.projectInfo.title=i),disabled:""},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(_),e(b,null,{default:o(()=>[e(h),e(n,{text:"关闭",variant:"plain",onClick:t[1]||(t[1]=i=>l.close())}),e(n,{color:"primary",text:"创建",variant:"tonal",onClick:t[2]||(t[2]=i=>{r.newProjectList(),l.close()}),disabled:s.created},null,8,["disabled"])]),_:1})]),_:1})}const B=c(j,[["render",C]]);export{B as _};
