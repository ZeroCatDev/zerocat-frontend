import{_ as n,G as i,o as p,c as m,w as e,a as l,N as u,O as s,a8 as c,L as o,R as b,a5 as d}from"./index-C840rCbu.js";import{V as f}from"./VContainer-CPhamQLs.js";/* empty css              */const V={setup(){i({title:"Open Scratch Content"})},data(){return{scratchprojectid:"",scratchstudioid:"",scratchusername:""}},async created(){},methods:{}};function x(S,t,y,j,r,C){return p(),m(f,null,{default:e(()=>[l(b,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:e(()=>[l(u,{href:"https://scratch.mit.edu/explore/projects/all"},{default:e(()=>t[4]||(t[4]=[s("Scratch上的发现页")])),_:1}),l(u,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:e(()=>t[5]||(t[5]=[s("Scratch使用条款")])),_:1})]),default:e(()=>[l(c,{class:"bg-surface-light pt-4"},{default:e(()=>t[3]||(t[3]=[s(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),o("a",null,"署名-相同方式共享 2.0 通用",-1),s("协议传播的，您可以在"),o("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),s("查看协议全文。 ")])),_:1})]),_:1}),t[9]||(t[9]=o("br",null,null,-1)),l(d,{label:"输入Scratch作品ID",variant:"outlined",modelValue:r.scratchprojectid,"onUpdate:modelValue":t[0]||(t[0]=a=>r.scratchprojectid=a)},null,8,["modelValue"]),l(u,{to:"/proxy/"+r.scratchprojectid,disabled:r.scratchprojectid=="",color:"primary"},{default:e(()=>t[6]||(t[6]=[s("打开")])),_:1},8,["to","disabled"]),t[10]||(t[10]=o("br",null,null,-1)),t[11]||(t[11]=o("br",null,null,-1)),l(d,{label:"输入Scratch工作室ID",variant:"outlined",modelValue:r.scratchstudioid,"onUpdate:modelValue":t[1]||(t[1]=a=>r.scratchstudioid=a)},null,8,["modelValue"]),l(u,{to:"/proxy/studio/"+r.scratchstudioid,disabled:r.scratchstudioid=="",color:"primary"},{default:e(()=>t[7]||(t[7]=[s("打开")])),_:1},8,["to","disabled"]),t[12]||(t[12]=o("br",null,null,-1)),t[13]||(t[13]=o("br",null,null,-1)),l(d,{label:"输入Scratch用户名称",variant:"outlined",modelValue:r.scratchusername,"onUpdate:modelValue":t[2]||(t[2]=a=>r.scratchusername=a)},null,8,["modelValue"]),l(u,{to:"/app/proxy/user/"+r.scratchusername,disabled:r.scratchusername=="",color:"primary"},{default:e(()=>t[8]||(t[8]=[s("打开")])),_:1},8,["to","disabled"]),t[14]||(t[14]=o("br",null,null,-1))]),_:1})}const B=n(V,[["render",x]]);export{B as default};
