import{o as f}from"./openEdit-DBNuVmNU.js";import{_ as h,H as y,J as l,r as j,o as g,c as x,w as r,a as o,Q as k,ah as w,af as V,O as a,W as u,ag as b,R as v,L as i,a0 as $,N as _}from"./index-BNC8O3a1.js";import{_ as C}from"./43-lazyload-CBkwrR6M.js";import{V as R}from"./VContainer-Do90NQK4.js";/* empty css              */const F={data(){return{project:{},projectfile:{},newid:"",openEditor:f,localuser:y,checktext:"",checkknow:!1,checklicense:!1,scratch_proxy:"https://scratch.192325.xyz",textRules:[e=>e?!0:"记得输入内容哦~",e=>{if(e!="我保证会好好对待改编的作品")return"输的不太对~"}]}},async created(){await this.getproject()},methods:{async getproject(){this.project=await l({url:this.scratch_proxy+"/projects/"+this.$route.params.id,method:"get"}),console.log(this.project)},async forkproject(e){await l({url:"/project/"+e+"/fork",method:"post"}).then(t=>{console.log(t),this.$toast.add({severity:"success",summary:"成功",detail:"分叉成功",life:3e3}),t.id&&this.$router.push("/projects/"+t.id)}).catch(t=>{console.log(t),this.$toast.add({severity:"error",summary:"错误",detail:t,life:3e3})})},async getProjectFile(){try{await this.getproject();const e=await l({url:`${this.scratch_proxy}/projects/source/${this.$route.params.id}?token=${this.project.project_token}`,method:"get"});console.log(e),this.$toast.add({severity:"success",summary:"成功",detail:"获取项目文件成功",life:3e3}),this.projectfile=e;const t=await l.post("/project/",{title:this.project.title,type:"scratch",state:"public"});if(console.log(t),this.$toast.add({severity:"info",summary:"信息",detail:t,life:3e3}),t.status==="1"){this.newid=t.id;const n=await l.put(`/project/${this.newid}/source`,this.projectfile);console.log(n),this.$toast.add({severity:"info",summary:"信息",detail:n,life:3e3});const c=await l.post(`/project/${this.newid}/push`);console.log(c),this.$toast.add({severity:"info",summary:"信息",detail:c,life:3e3})}}catch(e){console.error(e),this.$toast.add({severity:"error",summary:"错误",detail:"操作失败，请稍后再试",life:3e3})}}}};function z(e,t,n,c,s,p){const m=j("v-text");return g(),x(R,{class:"pa-md-12"},{default:r(()=>[o(v,{style:{"aspect-ratio":"4/3"},rounded:"lg"},{default:r(()=>[o(k,{src:"https://scratch.192325.xyz/thumbnails/"+s.project.id,class:"align-end","lazy-src":C,height:"100%",gradient:"to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)",cover:""},{default:r(()=>[o(w,null,{default:r(()=>[o(V,null,{default:r(()=>[a(u(s.project.title),1)]),_:1}),o(b,null,{default:r(()=>[a(u(s.project.description),1)]),_:1})]),_:1})]),_:1},8,["src"])]),_:1}),t[3]||(t[3]=i("br",null,null,-1)),o(m,null,{default:r(()=>t[2]||(t[2]=[a("如果您已了解以上内容，请在下方的输入框中输入")])),_:1}),t[4]||(t[4]=a()),t[5]||(t[5]=i("br",null,null,-1)),t[6]||(t[6]=i("br",null,null,-1)),o($,{hint:"请准确输入上方的话",label:"我保证会好好对待改编的作品",type:"input",modelValue:s.checktext,"onUpdate:modelValue":t[0]||(t[0]=d=>s.checktext=d),rules:s.textRules,required:"",variant:"outlined",clearable:""},null,8,["modelValue","rules"]),t[7]||(t[7]=i("br",null,null,-1)),o(_,{class:"text-none",color:"primary",rounded:"xl",text:"Fork",variant:"flat",size:"large",onClick:t[1]||(t[1]=d=>p.getProjectFile(s.project.id)),"append-icon":"mdi-arrow-right",disabled:!s.checktext},null,8,["disabled"])]),_:1})}const S=h(F,[["render",z]]);export{S as default};
