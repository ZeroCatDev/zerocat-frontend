import{P as V}from"./Projects-Cgmr3JYi.js";import{_ as g,G as b,o as c,c as p,w as a,a as t,a5 as d,M as n,X as w,L as o,T as v,K as h,as as C,a3 as _}from"./index-Br6O0dGK.js";import{a as s,V as f}from"./VRow-lRcUnfcN.js";import{V as k}from"./VAutocomplete-meFFzSNv.js";import{V as m}from"./VSelect-B0iJiz09.js";import{V as x}from"./VContainer-D-SemzeR.js";import"./showProjects-D5Yc-eRN.js";import"./43-lazyload-CBkwrR6M.js";import"./VChip-DcdvECOZ.js";import"./VPagination-C5yRlVpf.js";/* empty css              */import"./filter-ZM2qZSMI.js";import"./VCheckboxBtn-v-GXAmO7.js";import"./VSelectionControl-CAniPfYq.js";const P={components:{Projects:V},setup(){b({title:"项目"})},data(){return{search:{title:"",type:"scratch",description:"",source:"",order:"view_up",authorid:"",state:"public",tag:"",limit:20},showAdvancedSearch:!1,searchstates:[{state:"所有",abbr:"public"}],typeitems:[{name:"所有",type:""},{name:"Scratch",type:"scratch"},{name:"Python",type:"python"}],orderitems:[{name:"观看量升序",type:"view_up"},{name:"观看量降序",type:"view_down"},{name:"时间升序",type:"time_up"},{name:"时间降序",type:"time_down"},{name:"序号升序",type:"id_up"},{name:"序号降序",type:"id_down"}],tags:["","动画","故事","音乐","硬核","艺术","水"],url:""}},methods:{toggleAdvancedSearch(){this.showAdvancedSearch=!this.showAdvancedSearch},onPageChange(){const u=new Date().getTime();this.url=`/searchapi?search_userid=${this.search.authorid}&search_type=${this.search.type}&search_title=${this.search.title}&search_source=${this.search.source}&search_description=${this.search.description}&search_orderby=${this.search.order}&search_state=${this.search.state}&search_tag=${this.search.tag}&timestamp=${u}`},resetSearch(){this.search={title:"",type:"scratch",description:"",source:"",order:"view_up",authorid:"",state:"public",tag:"",limit:20},this.onPageChange()},viewLatest(){this.search.order="time_down",this.onPageChange()},viewPopular(){this.search.order="view_down",this.onPageChange()}},async created(){await this.onPageChange()}};function S(u,e,A,U,l,i){const y=V;return c(),p(x,null,{default:a(()=>[t(f,null,{default:a(()=>[t(s,{cols:"12"},{default:a(()=>[t(d,{modelValue:l.search.title,"onUpdate:modelValue":e[0]||(e[0]=r=>l.search.title=r),label:"作品名","prepend-inner-icon":"mdi-magnify",clearable:""},null,8,["modelValue"])]),_:1}),t(s,{cols:"12"},{default:a(()=>[t(n,{onClick:i.toggleAdvancedSearch,variant:"text"},{default:a(()=>[t(w,null,{default:a(()=>[o(v(l.showAdvancedSearch?"mdi-chevron-up":"mdi-chevron-down"),1)]),_:1}),e[8]||(e[8]=o(" 高级搜索 "))]),_:1},8,["onClick"]),e[9]||(e[9]=h("br",null,null,-1)),e[10]||(e[10]=h("br",null,null,-1)),t(C,null,{default:a(()=>[l.showAdvancedSearch?(c(),p(f,{key:0},{default:a(()=>[t(s,{cols:"6"},{default:a(()=>[t(d,{modelValue:l.search.description,"onUpdate:modelValue":e[1]||(e[1]=r=>l.search.description=r),label:"作品描述","prepend-inner-icon":"mdi-text",clearable:""},null,8,["modelValue"])]),_:1}),t(s,{cols:"6"},{default:a(()=>[t(d,{modelValue:l.search.source,"onUpdate:modelValue":e[2]||(e[2]=r=>l.search.source=r),label:"作品内容","prepend-inner-icon":"mdi-file",clearable:""},null,8,["modelValue"])]),_:1}),t(s,{cols:"6"},{default:a(()=>[t(d,{modelValue:l.search.authorid,"onUpdate:modelValue":e[3]||(e[3]=r=>l.search.authorid=r),label:"用户ID","prepend-inner-icon":"mdi-account",clearable:""},null,8,["modelValue"])]),_:1}),t(s,{cols:"6"},{default:a(()=>[t(k,{modelValue:l.search.tag,"onUpdate:modelValue":e[4]||(e[4]=r=>l.search.tag=r),items:l.tags,label:"标签","prepend-inner-icon":"mdi-tag",clearable:""},null,8,["modelValue","items"])]),_:1}),t(s,{cols:"4"},{default:a(()=>[t(m,{modelValue:l.search.order,"onUpdate:modelValue":e[5]||(e[5]=r=>l.search.order=r),items:l.orderitems,"item-title":"name","item-value":"type",label:"排序","prepend-inner-icon":"mdi-sort",clearable:""},null,8,["modelValue","items"])]),_:1}),t(s,{cols:"4"},{default:a(()=>[t(m,{modelValue:l.search.type,"onUpdate:modelValue":e[6]||(e[6]=r=>l.search.type=r),items:l.typeitems,"item-title":"name","item-value":"type",label:"项目类型","prepend-inner-icon":"mdi-format-list-bulleted",clearable:""},null,8,["modelValue","items"])]),_:1}),t(s,{cols:"4"},{default:a(()=>[t(m,{modelValue:l.search.state,"onUpdate:modelValue":e[7]||(e[7]=r=>l.search.state=r),items:l.searchstates,"item-title":"state","item-value":"abbr",label:"项目状态","prepend-inner-icon":"mdi-state-machine",clearable:""},null,8,["modelValue","items"])]),_:1})]),_:1})):_("",!0)]),_:1})]),_:1}),t(s,{cols:"12",class:"d-flex justify-end"},{default:a(()=>[t(n,{color:"primary",onClick:i.onPageChange,"append-icon":"mdi-magnify",class:"mr-2"},{default:a(()=>e[11]||(e[11]=[o(" 搜索 ")])),_:1},8,["onClick"]),t(n,{onClick:i.resetSearch,"append-icon":"mdi-refresh"},{default:a(()=>e[12]||(e[12]=[o(" 重置 ")])),_:1},8,["onClick"])]),_:1}),t(s,{cols:"12",class:"d-flex justify-end mt-4"},{default:a(()=>[t(n,{color:"secondary",onClick:i.viewLatest,"append-icon":"mdi-new-box",class:"mr-2"},{default:a(()=>e[13]||(e[13]=[o(" 最新作品 ")])),_:1},8,["onClick"]),t(n,{color:"secondary",onClick:i.viewPopular,"append-icon":"mdi-fire"},{default:a(()=>e[14]||(e[14]=[o(" 最热门作品 ")])),_:1},8,["onClick"])]),_:1})]),_:1}),t(y,{url:l.url},null,8,["url"])]),_:1})}const X=g(P,[["render",S]]);export{X as default};
