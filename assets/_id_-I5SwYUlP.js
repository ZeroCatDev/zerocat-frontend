import{_ as d}from"./Comment-Q7wMxSC-.js";import{_ as m}from"./showProjects-O_1JNVXT.js";import{_ as j,c as h,o as V,w as s,a as t,G as l,K as b,a7 as x,H as r,O as o,Z as c,ai as C,Q as L,T as u,S as n}from"./index-DhXuRan5.js";import{V as p}from"./VChip-Qn5ojB0u.js";import{V as T}from"./VContainer-CPEWPjzm.js";import"./VForm-BMVgxgM4.js";import"./VTextarea-CF7N7tkB.js";import"./VDialog-DNFoXVck.js";import"./projectService-583v_S66.js";import"./user-DMgSebAS.js";import"./43-lazyload-CBkwrR6M.js";import"./VRow-WMa017UQ.js";/* empty css              */const w={components:{showProjects:m,Comment:d},data(){return{localuser:n,projectid:this.$route.params.id,projectlist:{status:"1",message:"加载中",data:{id:7,authorid:1,title:"加载中",description:"加载中",state:"private",list:"",updateTime:null,createTime:"2000-00-01T00:00:00.000Z",data:{projects:[],users:[]}}},localuser:n,Loading:!0}},setup(){u({title:"ZeroCat - 列表"})},async created(){n.isLogin.value===!1&&this.$router.push("/app/account/login")},methods:{async getprojectlist(){const a=await L.get(`/projectlist/listid/${this.$route.params.id}`);a.data.status==="success"?this.projectlist=a.data.data:this.$router.push("/404"),u({title:""+this.projectlist.title}),console.log(this.projectlist)}},mounted(){this.Loading=!0,this.getprojectlist(),this.Loading=!1}},I={class:"font-weight-black"};function k(a,i,v,y,e,B){const _=m,f=d;return V(),h(T,null,{default:s(()=>[t(b,{class:"mx-auto",disabled:e.Loading,loading:e.Loading,border:""},{title:s(()=>[l("span",I,o(e.projectlist.title),1)]),loader:s(({isActive:g})=>[t(C,{active:g,height:"4",indeterminate:""},null,8,["active"])]),subtitle:s(()=>[t(p,null,{default:s(()=>[t(c,{icon:"mdi-account-circle",start:""}),r(" ID:"+o(e.projectlist.id),1)]),_:1}),t(p,null,{default:s(()=>[t(c,{icon:"mdi-account-circle",start:""}),r(" "+o(e.projectlist.state),1)]),_:1}),t(p,null,{default:s(()=>[t(c,{icon:"mdi-clock",start:""}),r(" "+o(e.projectlist.createTime)+"创建 ",1)]),_:1})]),default:s(()=>[t(x,{class:"bg-surface-light pt-4"},{default:s(()=>[r(o(e.projectlist.description),1)]),_:1})]),_:1},8,["disabled","loading"]),i[0]||(i[0]=l("br",null,null,-1)),t(_,{projectIds:e.projectlist.projects},null,8,["projectIds"]),i[1]||(i[1]=l("br",null,null,-1)),t(f,{url:"projectlist-"+e.projectlist.id,name:"列表"},null,8,["url"])]),_:1})}const E=j(w,[["render",k]]);export{E as default};
