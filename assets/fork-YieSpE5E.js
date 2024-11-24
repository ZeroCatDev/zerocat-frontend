import{_ as j,az as a,l as V,h as d,r as C,o as v,c as w,w as o,j as n,p as e,z as s,a as r,v as p,J as m,m as x,E as y}from"./index-Dx4WUln-.js";import{V as f}from"./VCheckbox-BN-t2_ph.js";import{V as g}from"./VContainer-oDghGbA3.js";const N={data(){return{project:{},openEditor:a,localuser:V,checktext:"",checkknow:!1,checklicense:!1,textRules:[u=>u?!0:"记得输入内容哦~",u=>{if(u!="我保证会好好对待改编的作品")return"输的不太对~"}]}},async created(){await this.getproject()},methods:{async getproject(){this.project=await d({url:"/project/"+this.$route.params.id,method:"get"}),console.log(this.project)},async forkproject(u){await d({url:"/project/"+u+"/fork",method:"post"}).then(t=>{console.log(t),this.$toast.add({severity:"success",summary:"成功",detail:"分叉成功",life:3e3}),t.id&&this.$router.push("/projects/"+t.id)}).catch(t=>{console.log(t),this.$toast.add({severity:"error",summary:"错误",detail:t,life:3e3})})}}},B={class:"d-flex justify-space-between"},U={class:"text-h4"},Z=["textContent"],z=["textContent"];function F(u,t,E,L,l,k){const b=C("v-text");return v(),w(g,{class:"pa-md-12"},{default:o(()=>[n("div",B,[n("h1",U,[t[4]||(t[4]=e("Fork ")),n("span",{textContent:s(l.project.title)},null,8,Z)])]),t[20]||(t[20]=n("br",null,null,-1)),r(p,null,{title:o(()=>[e(s(l.project.title),1)]),subtitle:o(()=>[e(" 作者"+s(l.project.author.display_name)+"，发布于："+s(l.project.time)+"，"+s(l.project.view_count)+"次浏览 ",1)]),text:o(()=>[e(s(l.project.description),1)]),_:1}),t[21]||(t[21]=n("br",null,null,-1)),r(p,null,{title:o(()=>t[5]||(t[5]=[e(" 你正在分叉一个项目 ")])),subtitle:o(()=>t[6]||(t[6]=[e("等等，确认点事 ")])),text:o(()=>[t[7]||(t[7]=e(" 你正在分叉 ")),n("span",{textContent:s(l.project.title)},null,8,z),t[8]||(t[8]=e(" ，这将会从此项目的生产环境创建一个一模一样的项目，新的项目将拥有一样的名称，简介与源代码内容。分叉是一个技术概念，不代表作者对你有任何授权。 ")),t[9]||(t[9]=n("br",null,null,-1)),t[10]||(t[10]=e("改编设立的目的是为了让社区中的作品得到更好的发展，请不要滥用改编，更不能直接抄袭。 "))]),default:o(()=>[r(m,null,{default:o(()=>[r(f,{label:"我已了解并确认",modelValue:l.checkknow,"onUpdate:modelValue":t[0]||(t[0]=i=>l.checkknow=i)},null,8,["modelValue"])]),_:1})]),_:1}),t[22]||(t[22]=n("br",null,null,-1)),r(p,null,{title:o(()=>[e(s(l.project.license),1)]),subtitle:o(()=>[e(" 你需要遵守："+s(l.project.license)+"许可证。 ",1)]),text:o(()=>[r(x,{href:"https://choosealicense.com/licenses/"+l.project.license,target:"_blank",variant:"outlined"},{default:o(()=>t[11]||(t[11]=[e("了解此许可证")])),_:1},8,["href"]),t[12]||(t[12]=n("br",null,null,-1)),t[13]||(t[13]=n("br",null,null,-1)),t[14]||(t[14]=e(" 开源许可证授予您某些权利，前提是您必须遵守相关许可证条款。如未明确标示许可证（显示为NULL），则默认作品受专有版权保护。在分发该作品之前，您需联系作者并获得授权。 ")),t[15]||(t[15]=n("br",null,null,-1)),t[16]||(t[16]=e(" 用户在ZeroCatNext上分发该作品，并不意味着其拥有该作品的所有权。作品的分叉仅为技术行为，不等同于获得作者的法律授权。")),t[17]||(t[17]=n("br",null,null,-1)),t[18]||(t[18]=e(" ZeroCatNext对用户上传、分发或使用的任何作品不承担任何法律责任。ZeroCatNext仅提供技术支持和托管服务，用户对所上传、分发及使用的作品负责，若因作品内容引发任何法律纠纷或损失，ZeroCatNext不承担任何责任。 "))]),default:o(()=>[r(m,null,{default:o(()=>[r(f,{label:"我已了解并确认",modelValue:l.checklicense,"onUpdate:modelValue":t[1]||(t[1]=i=>l.checklicense=i)},null,8,["modelValue"])]),_:1})]),_:1}),t[23]||(t[23]=n("br",null,null,-1)),r(b,null,{default:o(()=>t[19]||(t[19]=[e("如果您已了解以上内容，请在下方的输入框中输入")])),_:1}),t[24]||(t[24]=e()),t[25]||(t[25]=n("br",null,null,-1)),t[26]||(t[26]=n("br",null,null,-1)),r(y,{hint:"请准确输入上方的话",label:"我保证会好好对待改编的作品",type:"input",modelValue:l.checktext,"onUpdate:modelValue":t[2]||(t[2]=i=>l.checktext=i),rules:l.textRules,required:"",variant:"outlined",clearable:""},null,8,["modelValue","rules"]),t[27]||(t[27]=n("br",null,null,-1)),r(x,{class:"text-none",color:"primary",rounded:"xl",text:"Fork",variant:"flat",size:"large",onClick:t[3]||(t[3]=i=>k.forkproject(l.project.id)),"append-icon":"mdi-arrow-right",disabled:!l.checkknow||!l.checklicense||!l.checktext},null,8,["disabled"])]),_:1})}const A=j(N,[["render",F]]);export{A as default};
