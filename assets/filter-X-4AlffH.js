import{p as w,aE as j,aj as I,b4 as M,b5 as L,aG as v,b6 as O}from"./index-CobhglhN.js";const S=(t,l,e)=>t==null||l==null?-1:t.toString().toLocaleLowerCase().indexOf(l.toString().toLocaleLowerCase()),_=w({customFilter:Function,customKeyFilter:Object,filterKeys:[Array,String],filterMode:{type:String,default:"intersection"},noFilter:Boolean},"filter");function x(t,l,e){var F;const a=[],s=(e==null?void 0:e.default)??S,i=e!=null&&e.filterKeys?v(e.filterKeys):!1,y=Object.keys((e==null?void 0:e.customKeyFilter)??{}).length;if(!(t!=null&&t.length))return a;e:for(let c=0;c<t.length;c++){const[f,g=f]=v(t[c]),m={},u={};let r=-1;if((l||y>0)&&!(e!=null&&e.noFilter)){if(typeof f=="object"){const K=i||Object.keys(g);for(const n of K){const k=O(g,n),b=(F=e==null?void 0:e.customKeyFilter)==null?void 0:F[n];if(r=b?b(k,l,f):s(k,l,f),r!==-1&&r!==!1)b?m[n]=r:u[n]=r;else if((e==null?void 0:e.filterMode)==="every")continue e}}else r=s(f,l,f),r!==-1&&r!==!1&&(u.title=r);const h=Object.keys(u).length,d=Object.keys(m).length;if(!h&&!d||(e==null?void 0:e.filterMode)==="union"&&d!==y&&!h||(e==null?void 0:e.filterMode)==="intersection"&&(d!==y||!h))continue}a.push({index:c,matches:{...u,...m}})}return a}function A(t,l,e,a){const s=j([]),i=j(new Map),y=I(()=>M(l));L(()=>{const c=typeof e=="function"?e():M(e),f=typeof c!="string"&&typeof c!="number"?"":String(c),g=x(y.value,f,{customKeyFilter:{...t.customKeyFilter,...M(a==null?void 0:a.customKeyFilter)},default:t.customFilter,filterKeys:t.filterKeys,filterMode:t.filterMode,noFilter:t.noFilter}),m=M(l),u=[],r=new Map;g.forEach(h=>{let{index:d,matches:K}=h;const n=m[d];u.push(n),r.set(n.value,K)}),s.value=u,i.value=r});function F(c){return i.value.get(c.value)}return{filteredItems:s,filteredMatches:i,getMatches:F}}export{_ as m,A as u};
