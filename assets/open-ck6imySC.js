import{_ as n,G as i,o as p,c as m,w as e,a as r,N as a,P as s,a2 as c,L as o,U as b,a3 as d}from"./index-B4S81A1B.js";import{V as f}from"./VContainer-BCdknvvL.js";const V={setup(){i({title:"Open Scratch Content"})},data(){return{scratchprojectid:"",scratchstudioid:"",scratchusername:""}},async created(){},methods:{}};function x(S,t,y,j,l,h){return p(),m(f,null,{default:e(()=>[r(b,{subtitle:"这是Scratch上的内容",title:"ScratchMirror"},{actions:e(()=>[r(a,{href:"https://scratch.mit.edu/explore/projects/all"},{default:e(()=>t[4]||(t[4]=[s("Scratch上的发现页")])),_:1}),r(a,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:e(()=>t[5]||(t[5]=[s("Scratch使用条款")])),_:1})]),default:e(()=>[r(c,{class:"bg-surface-light pt-4"},{default:e(()=>t[3]||(t[3]=[s(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),s("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),s("查看协议全文。 ")])),_:1})]),_:1}),t[9]||(t[9]=o("br",null,null,-1)),r(d,{label:"输入Scratch作品ID",variant:"outlined",modelValue:l.scratchprojectid,"onUpdate:modelValue":t[0]||(t[0]=u=>l.scratchprojectid=u)},null,8,["modelValue"]),r(a,{to:"/proxy/"+l.scratchprojectid,disabled:l.scratchprojectid=="",color:"primary"},{default:e(()=>t[6]||(t[6]=[s("打开")])),_:1},8,["to","disabled"]),t[10]||(t[10]=o("br",null,null,-1)),t[11]||(t[11]=o("br",null,null,-1)),r(d,{label:"输入Scratch工作室ID",variant:"outlined",modelValue:l.scratchstudioid,"onUpdate:modelValue":t[1]||(t[1]=u=>l.scratchstudioid=u)},null,8,["modelValue"]),r(a,{to:"/proxy/studio/"+l.scratchstudioid,disabled:l.scratchstudioid=="",color:"primary"},{default:e(()=>t[7]||(t[7]=[s("打开")])),_:1},8,["to","disabled"]),t[12]||(t[12]=o("br",null,null,-1)),t[13]||(t[13]=o("br",null,null,-1)),r(d,{label:"输入Scratch用户名称",variant:"outlined",modelValue:l.scratchusername,"onUpdate:modelValue":t[2]||(t[2]=u=>l.scratchusername=u)},null,8,["modelValue"]),r(a,{to:"/proxy/user/"+l.scratchusername,disabled:l.scratchusername=="",color:"primary"},{default:e(()=>t[8]||(t[8]=[s("打开")])),_:1},8,["to","disabled"]),t[14]||(t[14]=o("br",null,null,-1))]),_:1})}const v=n(V,[["render",x]]);export{v as default};
