import{d as t,l as o}from"./db-B6Gkor3i.js";import{J as u}from"./index-ztfH9wvp.js";async function n(e){if(e.id=Number(e.id),await t.users.get(e.id))return await t.users.put(e),`用户 ${e.display_name} 更新成功.`;{const r=await t.users.add(e);return`用户 ${e.display_name} 成功缓存. 获取到id为 ${r}`}}async function l(e){try{return Array.isArray(e)||(e=[e]),(await Promise.all(e.map(async r=>await n(r)))).join(`
`)}catch(s){return`添加缓存失败: ${s}`}}async function y(e){try{const s=await t.users.get(Number(e));return s?(await t.users.delete(Number(e)),`用户 ${s.display_name} 删除成功.`):`删除 ${e} 失败: User not found`}catch(s){return`删除 ${e} 失败: ${s}`}}async function i(e){Array.isArray(e)||(e=[e]);try{return(await Promise.all(e.map(async r=>{const a=await u.get(`/api/getuserinfo?id=${r}`);if(console.log(a),a.status==="success"){const c={id:a.info.user.id,display_name:a.info.user.display_name,motto:a.info.user.motto,images:a.info.user.images,regTime:a.info.user.regTime,sex:a.info.user.sex,username:a.info.user.username};return await n(c)}else return`刷新 ${r} 失败: ${a.status}`}))).join(`
`)}catch(s){return`刷新 ${e} 失败: ${s}`}}function g(e,s){return Array.isArray(e)||(e=[e]),o(()=>t.users.where("id").anyOf(e).toArray()).subscribe(s)}function d(e){return o(()=>t.users.toArray()).subscribe(e)}function p(e){return t.users.get(Number(e)).then(s=>s||{id:e,display_name:"未知用户",motto:"",images:""})}async function h(e){const s=await u.get(`/api/getuserinfo?id=${e}`);if(s.status==="success"){const r={id:s.info.user.id,display_name:s.info.user.display_name,motto:s.info.user.motto,images:s.info.user.images,regTime:s.info.user.regTime,sex:s.info.user.sex,username:s.info.user.username};return await n(r),r}else return{id:e,display_name:"未知用户",motto:"",images:""}}async function w(e){const s=await t.users.get(Number(e));if(s)return i(e),s;{const r={id:e,display_name:"示例用户",motto:"这是一个示例",images:"default.png",regTime:"0000-00-00T00:00:00.000Z",sex:"未知",username:"exampleuser"};return i(e),r}}export{d as D,l as a,i as b,p as c,h as f,w as g,g as l,y as r};
