import{_ as S,G as k,J as _,o as V,c as x,w as r,a as s,R as d,a0 as p,X as i,a1 as b,O as e,a2 as h,a8 as u,L as o,W as m,a4 as w,N as f,a5 as v}from"./index-C840rCbu.js";import{a as g,V as y}from"./VRow-C9ulTvU0.js";import{V as C}from"./VSelect-DqlI71P_.js";import{V as D}from"./VContainer-CPhamQLs.js";/* empty css              */import"./VCheckboxBtn-BGSJ0WSz.js";import"./VSelectionControl-dmOrAC2P.js";import"./VChip-CDrc1Zhr.js";const M={setup(){k({title:"Scratch桌面版镜像"})},data(){return{release:{stat:0,url:{windows:"",macos:"",windows_link:"",macos_link:""},date:"一周以内",scratch_version:"未知",scratch_link_version:"未知"},download_source:{state:"ghproxy",abbr:"mirror.ghproxy.com/https://github.com"},download_source_list:[{state:"Github",abbr:"github.com"},{state:"gh.api.99988866.xyz",abbr:"gh.api.99988866.xyz/https://github.com"},{state:"ghproxy",abbr:"mirror.ghproxy.com/https://github.com"},{state:"自定义",abbr:""}],loading:!1,scratch_proxy:"https://scratch.192325.xyz"}},created(){this.loading=!0,this.release.stat=0,_.get(this.scratch_proxy+"/asdm").then(a=>{this.release.stat=1,this.release.url.windows=a.assets.filter(t=>t.name=="scratch-win.exe")[0].browser_download_url.replace("https://github.com",""),this.release.url.macos=a.assets.filter(t=>t.name=="scratch-mac.dmg")[0].browser_download_url.replace("https://github.com",""),this.release.url.windows_link=a.assets.filter(t=>t.name=="scratch-link-win.zip")[0].browser_download_url.replace("https://github.com",""),this.release.url.macos_link=a.assets.filter(t=>t.name=="scratch-link-mac.zip")[0].browser_download_url.replace("https://github.com",""),this.release.date=new Date(a.published_at).toLocaleString(),this.release.scratch_version=JSON.parse(a.body).scratch_version.split("-")[0],this.release.scratch_link_version=JSON.parse(a.body).scratch_version.split("-")[1],this.loading=!1}).catch(a=>{console.log(a),axios.get("https://api.github.com/repos/sunwuyuan/AutoScratchDesktopMirror/releases/latest").then(t=>{this.release.stat=1,this.release.url.windows=t.assets.filter(n=>n.name=="scratch-win.exe")[0].browser_download_url.replace("https://github.com",""),this.release.url.macos=t.assets.filter(n=>n.name=="scratch-mac.dmg")[0].browser_download_url.replace("https://github.com",""),this.release.url.windows_link=t.assets.filter(n=>n.name=="scratch-link-win.zip")[0].browser_download_url.replace("https://github.com",""),this.release.url.macos_link=t.assets.filter(n=>n.name=="scratch-link-mac.zip")[0].browser_download_url.replace("https://github.com",""),this.release.date=new Date(t.published_at).toLocaleString(),this.release.scratch_version=JSON.parse(t.body).scratch_version.split("-")[0],this.release.scratch_link_version=JSON.parse(t.body).scratch_version.split("-")[1],this.loading=!1}).catch(t=>{this.release.stat=0,this.release.stat=t.response.status,this.loading=!1})})}},G={class:"mt-2 font-weight-bold"},N={class:"mt-2 font-weight-bold"};function z(a,t,n,A,l,O){return V(),x(D,null,{default:r(()=>[s(y,null,{default:r(()=>[s(g,{cols:"12",md:"6"},{default:r(()=>[s(d,{hover:"",border:""},{default:r(()=>[s(p,null,{prepend:r(()=>[s(i,{icon:"mdi-download-box"})]),default:r(()=>[s(b,null,{default:r(()=>t[2]||(t[2]=[e("Auto Scratch-Desktop Mirror")])),_:1}),s(h,null,{default:r(()=>t[3]||(t[3]=[e("Scratch桌面版镜像")])),_:1})]),_:1}),s(u,{class:"bg-surface-light pt-4"},{default:r(()=>t[4]||(t[4]=[e(" Auto Scratch-Desktop Mirror 是一个基于 GitHub Action 的开源镜像项目，它会每周自动从 Scratch 官方网站下载最新的 Scratch 3.0 安装包并上传至 GitHub Release 提供给用户以供下载。 ")])),_:1})]),_:1}),s(d,{class:"mt-7",hover:"",border:""},{default:r(()=>[s(p,null,{prepend:r(()=>[s(i,{icon:"mdi-heart"})]),default:r(()=>[s(b,null,{default:r(()=>t[5]||(t[5]=[e("感谢ASDM的开发者们")])),_:1}),s(h,null,{default:r(()=>t[6]||(t[6]=[e("以下附 ASDM 的原始声明")])),_:1})]),_:1}),s(u,{class:"bg-surface-light pt-4"},{default:r(()=>t[7]||(t[7]=[e(" Auto Scratch Desktop Mirror 是一个 Scratch 桌面版的开源下载镜像项目。我们通过 Github Workflow 自动下载 Scratch 官网的 Scratch 桌面版程序，并透过 CDN 或 Github Pages 提供，以方便中国大陆地区的用户下载。 "),o("p",{class:"font-weight-light mt-2 text-caption"},[e(" 项目开源于 "),o("a",{href:"https://github.com/scratch-bar/asdm"},"GitHub"),e("，本版本由 waterblock79 开发。 "),o("br"),e(" 感谢: Scratch Team, GitHub, Vue.js, Vuetify.js 以及所有为这个项目添砖加瓦的人们! ")],-1)])),_:1}),s(u,null,{default:r(()=>t[8]||(t[8]=[e("此版本开源于 "),o("a",{href:"https://github.com/sunwuyuan/AutoScratchDesktopMirror"},"GitHub",-1),o("br",null,null,-1),e(" 任何问题欢迎加QQ群沟通 964979747"),o("br",null,null,-1),o("p",{class:"font-weight-light mt-2 text-caption"},[e(" 此站点目前由 "),o("a",{href:"https://wuyuan.dev"},"孙悟元"),e("("),o("a",{href:"https://zerocat.wuyuan.dev"},"ZeroCat社区"),e(") 维护。"),o("br"),e(" 感谢: Scratch Team, GitHub, Vue.js, Vuetify.js, scratch-bar, waterblock79 , wrj2009 以及所有为这个项目添砖加瓦的人们! ")],-1)])),_:1})]),_:1})]),_:1}),s(g,{cols:"12",md:"6"},{default:r(()=>[s(d,{hover:"",loading:l.loading,border:""},{default:r(()=>[s(p,null,{prepend:r(()=>[s(i,{icon:"mdi-download"})]),default:r(()=>[s(b,{class:"font-weight-black"},{default:r(()=>t[9]||(t[9]=[e("下载 Scratch 3.0")])),_:1}),s(h,null,{default:r(()=>t[10]||(t[10]=[e("公益Scratch桌面版镜像")])),_:1})]),_:1}),s(u,{class:"bg-surface-light pt-4"},{default:r(()=>[t[11]||(t[11]=e(" 未正确加载下载地址？您可以尝试在应用商店中下载 ")),t[12]||(t[12]=o("a",{href:"https://apps.apple.com/cn/app/scratch-desktop/id1446785996?mt=12",class:"on-surface"},"Mac OS 版本",-1)),t[13]||(t[13]=e(" 和 ")),t[14]||(t[14]=o("a",{href:"https://www.microsoft.com/zh-cn/p/scratch-3/9pfgj25jl6x3",class:"on-surface"},"Windows 10 以上版本",-1)),t[15]||(t[15]=e(" 的 Scratch 桌面版。 ")),o("p",G," 该版本镜像于 "+m(l.release.date)+"，Scratch 版本为 "+m(l.release.scratch_version)+"。 ",1)]),_:1}),s(w,null,{default:r(()=>[s(f,{disabled:l.release.stat==0,href:`https://${l.download_source.abbr}${l.release.url.windows}`,variant:"tonal"},{default:r(()=>[s(i,{right:"",icon:"mdi-microsoft-windows"}),t[16]||(t[16]=e(" Windows 下载 "))]),_:1},8,["disabled","href"]),s(f,{disabled:l.release.stat==0,href:`https://${l.download_source.abbr}${l.release.url.macos}`,variant:"tonal"},{default:r(()=>[s(i,{right:"",icon:"mdi-apple"}),t[17]||(t[17]=e(" MacOS 下载 "))]),_:1},8,["disabled","href"])]),_:1})]),_:1},8,["loading"]),s(d,{hover:"",loading:l.loading,class:"mt-7",border:""},{default:r(()=>[s(p,null,{prepend:r(()=>[s(i,{icon:"mdi-download"})]),default:r(()=>[s(b,{class:"font-weight-black"},{default:r(()=>t[18]||(t[18]=[e("下载 Scratch Link")])),_:1}),s(h,null,{default:r(()=>t[19]||(t[19]=[e("公益ScratchLink镜像")])),_:1})]),_:1}),s(u,{class:"bg-surface-light pt-4"},{default:r(()=>[t[20]||(t[20]=e(" 未正确加载下载地址？您可以尝试在应用商店中下载 ")),t[21]||(t[21]=o("a",{href:"https://itunes.apple.com/us/app/scratch-link/id1408863490",class:"on-surface"},"Mac OS 版本",-1)),t[22]||(t[22]=e(" 和 ")),t[23]||(t[23]=o("a",{href:"https://www.microsoft.com/store/productId/9N48XLLCZH0X",class:"on-surface"},"Windows 10 以上版本",-1)),t[24]||(t[24]=e(" 的 Scratch 桌面版。 ")),o("p",N," 该版本镜像于 "+m(l.release.date)+"，ScratchLink版本为 "+m(l.release.scratch_link_version)+"。 ",1)]),_:1}),s(w,null,{default:r(()=>[s(f,{disabled:l.release.stat==0,href:`https://${l.download_source.abbr}${l.release.url.windows_link}`,variant:"tonal"},{default:r(()=>[s(i,{right:"",icon:"mdi-microsoft-windows"}),t[25]||(t[25]=e(" Windows 下载 "))]),_:1},8,["disabled","href"]),s(f,{disabled:l.release.stat==0,href:`https://${l.download_source.abbr}${l.release.url.macos_link}`,variant:"tonal"},{default:r(()=>[s(i,{right:"",icon:"mdi-apple"}),t[26]||(t[26]=e(" MacOS 下载 "))]),_:1},8,["disabled","href"])]),_:1})]),_:1},8,["loading"]),s(d,{class:"mt-7",hover:"",border:""},{default:r(()=>[s(p,null,{prepend:r(()=>[s(i,{icon:"mdi-server"})]),default:r(()=>[s(b,{class:"font-weight-black"},{default:r(()=>t[27]||(t[27]=[e("设置下载源")])),_:1}),s(h,null,{default:r(()=>t[28]||(t[28]=[e("如无法下载请检查此处")])),_:1})]),_:1}),s(u,null,{default:r(()=>[t[29]||(t[29]=e(" 默认使用 ")),t[30]||(t[30]=o("b",null,[o("a",{href:"https://mirror.ghproxy.com/",class:"on-surface"},"ghproxy")],-1)),t[31]||(t[31]=e(" 镜像源")),t[32]||(t[32]=o("br",null,null,-1)),t[33]||(t[33]=e(" 通常情况下您")),t[34]||(t[34]=o("b",null,"不需要更改下载源",-1)),t[35]||(t[35]=e("，但如果默认下载源不可用，您可以更改为另外一个，或者自定义下载源。 ")),t[36]||(t[36]=o("br",null,null,-1)),t[37]||(t[37]=o("br",null,null,-1)),s(C,{modelValue:l.download_source,"onUpdate:modelValue":t[0]||(t[0]=c=>l.download_source=c),hint:`${l.download_source.state}, ${l.download_source.abbr}`,items:l.download_source_list,"item-title":"state","item-value":"abbr",label:"Select","persistent-hint":"","return-object":"","single-line":""},null,8,["modelValue","hint","items"]),t[38]||(t[38]=o("br",null,null,-1)),s(v,{label:"可直接编辑",modelValue:l.download_source.abbr,"onUpdate:modelValue":t[1]||(t[1]=c=>l.download_source.abbr=c)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}const R=S(M,[["render",z]]);export{R as default};
