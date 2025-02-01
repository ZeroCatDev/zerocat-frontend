import{_ as b,c as w,o as m,w as i,a as t,H as o,G as c,e as C,I as n,ae as d,af as E,M as S,N as x,K as f,a7 as p,O as y,aE as U,a6 as K,a8 as D,$ as T,ac as k,a1 as L,L as A,S as V,Q as g}from"./index-CATzfh6C.js";import{V as v}from"./VSelect-DjG3CZOz.js";import{V as P}from"./VSpacer-Bxq25iYR.js";import{V as I}from"./VDialog-jZclfJMg.js";import{V as R}from"./VContainer-Dc5lw8sj.js";import"./VCheckboxBtn-CDWNJgOK.js";import"./VSelectionControl-D7yZc67T.js";import"./VChip-B53Sd2dI.js";/* empty css              */const M={data(){return{localuser:V,configs:[],searchKey:"",createDialog:!1,deleteDialog:!1,editItemData:{},newConfig:{key:"",value:"",is_public:!1},deleteItemData:{},deleteItemId:null,loading:!1,infomation:{"s3.bucket":"S3桶名称","s3.region":"S3地区","s3.endpoint":"S3端点","s3.AWS_ACCESS_KEY_ID":"S3访问密钥ID","s3.AWS_SECRET_ACCESS_KEY":"S3访问秘钥","s3.staticurl":"S3静态文件路径",cors:"跨域","mail.from":"发件人","mail.host":"SMTP主机","mail.port":"SMTP端口","mail.user":"SMTP用户名","mail.pass":"SMTP密码","mail.service":"SMTP服务商","mail.fromname":"发件人名称","site.tos":"用户服务协议","site.privacy":"隐私政策","site.name":"网站名称","site.email":"网站邮箱","site.domain":"网站域名","site.slogan":"网站标语","urls.editor":"编辑器URL","urls.static":"静态文件URL","waline.url":"Waline URL","captcha.GEE_API_SERVER":"极验API服务端","captcha.GEE_CAPTCHA_ID":"极验验证码 ID","captcha.GEE_CAPTCHA_KEY":"极验验证码 KEY","feedback.txcid":"兔小巢ID","feedback.txckey":"兔小巢KEY","security.jwttoken":"令牌签发密钥","security.SessionSecret":"保持与令牌签发密钥相同","security.adminuser":"管理员邮箱(无效)","urls.frontend":"前端URL","urls.backend":"后端URL","feedback.qq.link":"QQ群链接","feedback.qq.group":"QQ群号","feedback.qq.description":"QQ群描述","theme.mdui.color.primary":"MDUI主题颜色"}}},computed:{filteredConfigs(){const s=this.searchKey.toLowerCase();return this.configs.filter(e=>e.key.toLowerCase().includes(s))}},methods:{async loadData(){try{const s=await g.get("/api/admin/config/all");s.data.status==="success"&&(this.configs=s.data.data)}catch(s){console.error("加载配置失败",s)}},toggleEdit(s){this.editItemData.id===s.id?this.editItemData={}:this.editItemData={...s}},async saveEdit(){try{(await g.put(`/api/admin/config/${this.editItemData.id}`,this.editItemData)).data.status==="success"&&(this.$toast.add({severity:"success",summary:"成功",detail:"保存配置成功"}),this.loadData(),this.editItemData={})}catch(s){this.$toast.add({severity:"error",summary:"错误",detail:"保存配置失败"}),console.error("保存配置失败",s)}},cancelEdit(){this.editItemData={}},confirmDeleteItem(s){this.deleteItemId=s.id,this.deleteItemData=s,this.deleteDialog=!0},async deleteItem(s){try{(await g.delete(`/api/admin/config/${s}`)).data.status==="success"&&(this.$toast.add({severity:"success",summary:"成功",detail:"保存配置成功"}),this.loadData(),this.deleteDialog=!1)}catch(e){this.$toast.add({severity:"error",summary:"错误",detail:"保存配置失败"}),console.error("删除配置失败",e)}},openCreateDialog(){this.newConfig={key:"",value:"",is_public:!1},this.createDialog=!0},async createConfig(){try{(await g.post("/api/admin/config",this.newConfig)).data.status==="success"&&(this.$toast.add({severity:"success",summary:"成功",detail:"创建配置成功"}),this.loadData(),this.createDialog=!1)}catch(s){console.error("创建配置失败",s),this.$toast.add({severity:"error",summary:"错误",detail:"创建配置失败"})}}},created(){(V.isLogin.value===!1||V.user.value.id!==1)&&this.$router.push("/"),this.loadData()}},Q={class:"d-flex align-center"},q={key:0};function B(s,e,N,Y,l,r){return m(),w(R,null,{default:i(()=>[t(n,{onClick:r.openCreateDialog,color:"primary"},{default:i(()=>e[13]||(e[13]=[o("创建配置")])),_:1},8,["onClick"]),e[25]||(e[25]=o()),t(n,{onClick:r.loadData,variant:"text"},{default:i(()=>e[14]||(e[14]=[o("刷新")])),_:1},8,["onClick"]),e[26]||(e[26]=c("br",null,null,-1)),e[27]||(e[27]=c("br",null,null,-1)),t(d,{modelValue:l.searchKey,"onUpdate:modelValue":e[0]||(e[0]=a=>l.searchKey=a),label:"搜索",clearable:"",onKeyup:e[1]||(e[1]=E(a=>r.loadData(),["enter"])),variant:"outlined"},null,8,["modelValue"]),(m(!0),C(S,null,x(r.filteredConfigs,a=>(m(),C("div",{key:a.id},[t(f,{class:"d-flex justify-space-between align-center",title:a.key,subtitle:l.infomation[a.key]||a.key,onClick:u=>r.toggleEdit(a),color:a.is_public==!0?"success":"",variant:a.is_public==!0?"tonal":""},{default:i(()=>[c("div",Q,[t(p,null,{default:i(()=>[o(y(a.value),1)]),_:2},1024)])]),_:2},1032,["title","subtitle","onClick","color","variant"]),t(U,null,{default:i(()=>[l.editItemData.id===a.id?(m(),C("div",q,[t(f,{flat:""},{default:i(()=>[t(p,null,{default:i(()=>[t(d,{modelValue:l.editItemData.key,"onUpdate:modelValue":e[2]||(e[2]=u=>l.editItemData.key=u),label:"名称",disabled:""},null,8,["modelValue"]),t(d,{modelValue:l.editItemData.value,"onUpdate:modelValue":e[3]||(e[3]=u=>l.editItemData.value=u),label:"值"},null,8,["modelValue"]),t(v,{modelValue:l.editItemData.is_public,"onUpdate:modelValue":e[4]||(e[4]=u=>l.editItemData.is_public=u),items:[{text:"公开",value:!0},{text:"内部",value:!1}],label:"可见性","item-title":"text","item-value":"value"},null,8,["modelValue"]),o(y(l.editItemData),1)]),_:1}),t(D,null,{default:i(()=>[t(n,{onClick:u=>r.confirmDeleteItem(a),color:"error"},{default:i(()=>e[15]||(e[15]=[o("删除")])),_:2},1032,["onClick"]),t(P),t(n,{onClick:r.cancelEdit},{default:i(()=>e[16]||(e[16]=[o("取消")])),_:1},8,["onClick"]),t(n,{onClick:r.saveEdit,color:"primary"},{default:i(()=>e[17]||(e[17]=[o("保存")])),_:1},8,["onClick"])]),_:2},1024)]),_:2},1024)])):K("",!0)]),_:2},1024),t(T)]))),128)),t(I,{modelValue:l.createDialog,"onUpdate:modelValue":e[9]||(e[9]=a=>l.createDialog=a),"max-width":"500px"},{default:i(()=>[t(f,{color:l.newConfig.is_public==!0?"success":""},{default:i(()=>[t(k,null,{default:i(()=>e[18]||(e[18]=[o("创建配置")])),_:1}),t(p,null,{default:i(()=>[t(d,{modelValue:l.newConfig.key,"onUpdate:modelValue":e[5]||(e[5]=a=>l.newConfig.key=a),label:"名称",variant:"outlined"},null,8,["modelValue"]),t(d,{modelValue:l.newConfig.value,"onUpdate:modelValue":e[6]||(e[6]=a=>l.newConfig.value=a),label:"值",variant:"outlined"},null,8,["modelValue"]),t(v,{modelValue:l.newConfig.is_public,"onUpdate:modelValue":e[7]||(e[7]=a=>l.newConfig.is_public=a),items:[{text:"公开",value:!0},{text:"内部",value:!1}],label:"可见性","item-title":"text","item-value":"value"},null,8,["modelValue"]),o(y(l.newConfig),1)]),_:1}),t(D,null,{default:i(()=>[t(n,{onClick:e[8]||(e[8]=a=>l.createDialog=!1)},{default:i(()=>e[19]||(e[19]=[o("取消")])),_:1}),t(n,{onClick:r.createConfig,color:l.newConfig.is_public==!0?"on-success":"primary",disabled:!l.newConfig.key||!l.newConfig.value||l.configs.find(a=>a.key===l.newConfig.key)},{default:i(()=>e[20]||(e[20]=[o("创建")])),_:1},8,["onClick","color","disabled"])]),_:1})]),_:1},8,["color"])]),_:1},8,["modelValue"]),t(I,{modelValue:l.deleteDialog,"onUpdate:modelValue":e[12]||(e[12]=a=>l.deleteDialog=a),"max-width":"500px"},{default:i(()=>[t(f,null,{default:i(()=>[t(k,null,{default:i(()=>e[21]||(e[21]=[o("确认删除")])),_:1}),t(p,null,{default:i(()=>[e[22]||(e[22]=o("您确定要删除此配置吗？ ")),t(L,null,{default:i(()=>[t(A,{title:l.deleteItemData.key,subtitle:l.deleteItemData.value},null,8,["title","subtitle"])]),_:1})]),_:1}),t(D,null,{default:i(()=>[t(n,{onClick:e[10]||(e[10]=a=>l.deleteDialog=!1),color:"primary"},{default:i(()=>e[23]||(e[23]=[o("取消")])),_:1}),t(n,{onClick:e[11]||(e[11]=a=>{r.deleteItem(l.deleteItemId),s.editDialog=!1}),color:"error"},{default:i(()=>e[24]||(e[24]=[o("确认")])),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}const X=b(M,[["render",B]]);export{X as default};
