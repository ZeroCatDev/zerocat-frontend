import{_ as p,G as f,H as c,aA as V,J as m,o as x,c as b,w as o,a as e,a2 as n,P as j,U as r,L as w,Q as y,R as i,a3 as v,a4 as C,aB as _,a7 as h,N as d,a8 as B}from"./index-B4S81A1B.js";import{V as k}from"./VContainer-BCdknvvL.js";const N={setup(){f({title:"新建作品"})},data(){return{localuser:c,projectinfo:{title:"新建作品",type:"scratch"},created:!1,newid:0,openEdit:V}},async created(){this.localuser.islogin==!1&&this.$router.push("/account/login")},methods:{async newProject(){await m.post("/project/",this.projectinfo).then(a=>{console.log(a),this.$toast.add({severity:"info",summary:"info",detail:a,life:3e3}),a.status=="1"&&(this.created=!0,this.newid=a.id)})}}};function g(a,t,P,T,l,u){return x(),b(k,null,{default:o(()=>[e(r,{hover:"",border:"",title:"新建作品"},{default:o(()=>[e(n,null,{default:o(()=>t[4]||(t[4]=[j(" 作品是你存储代码的地方，你可以选择你喜欢的类型以从模板创建，作品信息可以随时修改。 ")])),_:1})]),_:1}),t[5]||(t[5]=w("br",null,null,-1)),e(r,{hover:"",border:""},{default:o(()=>[e(n,null,{default:o(()=>[e(y,{dense:""},{default:o(()=>[e(i,{cols:"12",md:"12",sm:"12"},{default:o(()=>[e(v,{label:"标题",required:"",hint:"将会在首页展示",modelValue:l.projectinfo.title,"onUpdate:modelValue":t[0]||(t[0]=s=>l.projectinfo.title=s)},null,8,["modelValue"])]),_:1}),e(i,{cols:"12",sm:"6"},{default:o(()=>[e(C,{items:["scratch","python","text"],label:"类型",required:"",hint:"可以随时修改",modelValue:l.projectinfo.type,"onUpdate:modelValue":t[1]||(t[1]=s=>l.projectinfo.type=s)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(_),e(h,null,{default:o(()=>[e(d,{text:"打开",variant:"plain",onClick:t[2]||(t[2]=s=>l.openEdit(l.newid,l.projectinfo.type)),disabled:!l.created},null,8,["disabled"]),e(B),e(d,{border:"",color:"primary",text:"创建",variant:"tonal",onClick:t[3]||(t[3]=s=>u.newProject()),disabled:l.created},null,8,["disabled"])]),_:1})]),_:1})]),_:1})}const A=p(N,[["render",g]]);export{A as default};
