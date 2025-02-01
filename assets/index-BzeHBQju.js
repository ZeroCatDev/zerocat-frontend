import{_ as V}from"./Projects-CGHSxTtW.js";import{_ as g,c,o as p,w as r,a as t,ae as d,G as h,I as n,H as s,Z as b,O as w,ah as _,a6 as v,T as C}from"./index-DhXuRan5.js";import{V as f,a as o}from"./VRow-WMa017UQ.js";import{V as k}from"./VAutocomplete-iH7vhHfD.js";import{V as m}from"./VSelect-D9rHMrlS.js";import{V as x}from"./VContainer-CPEWPjzm.js";import"./showProjects-O_1JNVXT.js";import"./projectService-583v_S66.js";import"./user-DMgSebAS.js";import"./43-lazyload-CBkwrR6M.js";import"./VChip-Qn5ojB0u.js";import"./VPagination-DQ1FCukc.js";/* empty css              */import"./filter-CeBf2D5A.js";import"./VCheckboxBtn-TrmoJWrj.js";import"./VSelectionControl-DYW0yaeb.js";const S={components:{Projects:V},setup(){C({title:"项目"})},data(){return{search:{title:"",type:"scratch",description:"",source:"",order:"view_up",authorid:"",state:"public",tag:"",limit:20},showAdvancedSearch:!1,searchstates:[{state:"所有",abbr:"public"}],typeitems:[{name:"所有",type:""},{name:"Scratch",type:"scratch"},{name:"Python",type:"python"}],orderitems:[{name:"观看量升序",type:"view_up"},{name:"观看量降序",type:"view_down"},{name:"时间升序",type:"time_up"},{name:"时间降序",type:"time_down"},{name:"序号升序",type:"id_up"},{name:"序号降序",type:"id_down"}],tags:["","动画","故事","音乐","硬核","艺术","水"],url:""}},methods:{toggleAdvancedSearch(){this.showAdvancedSearch=!this.showAdvancedSearch},onPageChange(){const u=new Date().getTime();this.url=`/searchapi?search_userid=${this.search.authorid}&search_type=${this.search.type}&search_title=${this.search.title}&search_source=${this.search.source}&search_description=${this.search.description}&search_orderby=${this.search.order}&search_state=${this.search.state}&search_tag=${this.search.tag}&timestamp=${u}`},resetSearch(){this.search={title:"",type:"scratch",description:"",source:"",order:"view_up",authorid:"",state:"public",tag:"",limit:20},this.onPageChange()},viewLatest(){this.search.order="time_down",this.onPageChange()},viewPopular(){this.search.order="view_down",this.onPageChange()}},async created(){this.onPageChange()}};function P(u,e,A,U,l,i){const y=V;return p(),c(x,null,{default:r(()=>[t(f,null,{default:r(()=>[t(o,{cols:"12"},{default:r(()=>[t(d,{modelValue:l.search.title,"onUpdate:modelValue":e[0]||(e[0]=a=>l.search.title=a),label:"作品名","prepend-inner-icon":"mdi-magnify",clearable:""},null,8,["modelValue"])]),_:1}),t(o,{cols:"12"},{default:r(()=>[t(n,{onClick:i.toggleAdvancedSearch,variant:"text"},{default:r(()=>[t(b,null,{default:r(()=>[s(w(l.showAdvancedSearch?"mdi-chevron-up":"mdi-chevron-down"),1)]),_:1}),e[8]||(e[8]=s(" 高级搜索 "))]),_:1},8,["onClick"]),e[9]||(e[9]=h("br",null,null,-1)),e[10]||(e[10]=h("br",null,null,-1)),t(_,null,{default:r(()=>[l.showAdvancedSearch?(p(),c(f,{key:0},{default:r(()=>[t(o,{cols:"6"},{default:r(()=>[t(d,{modelValue:l.search.description,"onUpdate:modelValue":e[1]||(e[1]=a=>l.search.description=a),label:"作品描述","prepend-inner-icon":"mdi-text",clearable:""},null,8,["modelValue"])]),_:1}),t(o,{cols:"6"},{default:r(()=>[t(d,{modelValue:l.search.source,"onUpdate:modelValue":e[2]||(e[2]=a=>l.search.source=a),label:"作品内容","prepend-inner-icon":"mdi-file",clearable:""},null,8,["modelValue"])]),_:1}),t(o,{cols:"6"},{default:r(()=>[t(d,{modelValue:l.search.authorid,"onUpdate:modelValue":e[3]||(e[3]=a=>l.search.authorid=a),label:"用户ID","prepend-inner-icon":"mdi-account",clearable:""},null,8,["modelValue"])]),_:1}),t(o,{cols:"6"},{default:r(()=>[t(k,{modelValue:l.search.tag,"onUpdate:modelValue":e[4]||(e[4]=a=>l.search.tag=a),items:l.tags,label:"标签","prepend-inner-icon":"mdi-tag",clearable:""},null,8,["modelValue","items"])]),_:1}),t(o,{cols:"4"},{default:r(()=>[t(m,{modelValue:l.search.order,"onUpdate:modelValue":e[5]||(e[5]=a=>l.search.order=a),items:l.orderitems,"item-title":"name","item-value":"type",label:"排序","prepend-inner-icon":"mdi-sort",clearable:""},null,8,["modelValue","items"])]),_:1}),t(o,{cols:"4"},{default:r(()=>[t(m,{modelValue:l.search.type,"onUpdate:modelValue":e[6]||(e[6]=a=>l.search.type=a),items:l.typeitems,"item-title":"name","item-value":"type",label:"项目类型","prepend-inner-icon":"mdi-format-list-bulleted",clearable:""},null,8,["modelValue","items"])]),_:1}),t(o,{cols:"4"},{default:r(()=>[t(m,{modelValue:l.search.state,"onUpdate:modelValue":e[7]||(e[7]=a=>l.search.state=a),items:l.searchstates,"item-title":"state","item-value":"abbr",label:"项目状态","prepend-inner-icon":"mdi-state-machine",clearable:""},null,8,["modelValue","items"])]),_:1})]),_:1})):v("",!0)]),_:1})]),_:1}),t(o,{cols:"12",class:"d-flex justify-end"},{default:r(()=>[t(n,{color:"primary",onClick:i.onPageChange,"append-icon":"mdi-magnify",class:"mr-2"},{default:r(()=>e[11]||(e[11]=[s(" 搜索 ")])),_:1},8,["onClick"]),t(n,{onClick:i.resetSearch,"append-icon":"mdi-refresh"},{default:r(()=>e[12]||(e[12]=[s(" 重置 ")])),_:1},8,["onClick"])]),_:1}),t(o,{cols:"12",class:"d-flex justify-end mt-4"},{default:r(()=>[t(n,{color:"secondary",onClick:i.viewLatest,"append-icon":"mdi-new-box",class:"mr-2"},{default:r(()=>e[13]||(e[13]=[s(" 最新作品 ")])),_:1},8,["onClick"]),t(n,{color:"secondary",onClick:i.viewPopular,"append-icon":"mdi-fire"},{default:r(()=>e[14]||(e[14]=[s(" 最热门作品 ")])),_:1},8,["onClick"])]),_:1})]),_:1}),t(y,{url:l.url},null,8,["url"])]),_:1})}const J=g(S,[["render",P]]);export{J as default};
