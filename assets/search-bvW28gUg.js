import{_ as i}from"./ProxyShowProjects-C3ghU_9e.js";import{_ as p,o as c,c as h,w as t,a as r,M as n,L as l,a6 as f,K as s,P as V,ae as x}from"./index-BYqNdXv5.js";import{a as u,V as b}from"./VRow-BuSSGV1N.js";import{V as _}from"./VSelect-DN2sNov4.js";import{V as y}from"./VContainer-DNrC1FRA.js";import"./43-lazyload-CBkwrR6M.js";/* empty css              */import"./VCheckboxBtn-DWAMhTf7.js";import"./VSelectionControl-CvVrleF3.js";import"./VChip-CTXK6dhh.js";const S={components:{ProxyShowProjects:i},data(){return{orderitems:[{name:"热门的",type:"trending"},{name:"最受欢迎的",type:"popular"},{name:"新建的",type:"recent"}],search:{text:"",order:"trending"},searchUrl:""}},methods:{onSearch(){this.searchUrl=`/projects/search/projects?mode=${this.search.order}&q=${this.search.text}&`}},watch:{"$route.query":{handler(){this.search.text=this.$route.query.text||"",this.search.order=this.$route.query.order||"trending"},immediate:!0}}};function g(C,e,w,j,o,m){const d=i;return c(),h(y,null,{default:t(()=>[r(V,{subtitle:"这是Scratch上的内容",title:"ZeroCatScratchMirror",border:""},{actions:t(()=>[r(n,{href:"https://scratch.mit.edu/explore/projects/all"},{default:t(()=>e[3]||(e[3]=[l("Scratch上的发现页")])),_:1}),r(n,{href:"https://scratch.mit.edu/terms_of_use",target:"_blank"},{default:t(()=>e[4]||(e[4]=[l("Scratch使用条款")])),_:1})]),default:t(()=>[r(f,{class:"bg-surface-light pt-4"},{default:t(()=>e[2]||(e[2]=[l(" 我们使用这种方式促进Scratch及其社区的发展，这些内容是按照"),s("a",null,"署名-相同方式共享 2.0 通用",-1),l("协议传播的，您可以在"),s("a",null,"https://creativecommons.org/licenses/by-sa/2.0/",-1),l("查看协议全文。 ")])),_:1})]),_:1}),e[6]||(e[6]=s("br",null,null,-1)),r(b,null,{default:t(()=>[r(u,{cols:"12"},{default:t(()=>[r(x,{label:"搜索 为："+o.search.text,modelValue:o.search.text,"onUpdate:modelValue":e[0]||(e[0]=a=>o.search.text=a)},null,8,["label","modelValue"])]),_:1}),r(u,{cols:"3"},{default:t(()=>[r(_,{modelValue:o.search.order,"onUpdate:modelValue":e[1]||(e[1]=a=>o.search.order=a),items:o.orderitems,"item-title":"name","item-value":"type",label:"排序 为："+o.search.order},null,8,["modelValue","items","label"])]),_:1}),r(u,{cols:"3"},{default:t(()=>[r(n,{onClick:m.onSearch},{default:t(()=>e[5]||(e[5]=[l(" 搜索 ")])),_:1},8,["onClick"])]),_:1})]),_:1}),e[7]||(e[7]=s("br",null,null,-1)),e[8]||(e[8]=s("br",null,null,-1)),r(d,{url:o.searchUrl,"show-user-info":!0},null,8,["url"])]),_:1})}const K=p(S,[["render",g]]);export{K as default};
