import{Q as s}from"./index-KvBOkYOg.js";async function o(){try{return(await s.get("/projectlist/lists/my")).data}catch(t){return console.error("获取我的项目列表失败:",t),{status:"error",data:[]}}}async function a(t){try{return(await s.get(`/projectlist/lists/listid/${t}`)).data}catch(r){return console.error("获取项目列表失败:",r),{status:"error",data:{projects:[]}}}}async function n(t){try{return(await s.post("/projectlist/stars/star",{projectid:t})).data}catch(r){return console.error("收藏项目失败:",r),{status:"error",message:"收藏失败"}}}async function c(t){try{return(await s.post("/projectlist/stars/unstar",{projectid:t})).data}catch(r){return console.error("取消收藏失败:",r),{status:"error",message:"取消收藏失败"}}}async function i(t){try{return(await s.get(`/projectlist/stars/checkstar?projectid=${t}`)).data}catch(r){return console.error("检查收藏状态失败:",r),{status:"error",star:!1}}}async function u(t){try{return(await s.get(`/projectlist/stars/project/${t}/stars`)).data}catch(r){return console.error("获取项目收藏数失败:",r),{status:"error",data:0}}}export{a,o as b,i as c,u as g,n as s,c as u};
