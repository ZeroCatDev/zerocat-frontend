import{_ as h,o as e,e as c,c as n,w as d,L as r,R as l,a1 as o,T as p}from"./index-BCe8u7sk.js";const y={data(){return{embedurl:"/",watchedtype:"",watchedid:"",pythonplayer:"",code:""}},props:{type:{type:String,default:"text"},id:{type:String,default:"1"}},watch:{type:async function(t,i){this.watchedtype=t,this.watchedid=t,this.type==="scratch"&&(this.embedurl=`/scratch/embed.html?id=${this.id}&branch=main&ref=latest&embed=true`),this.type==="python"&&(this.pythonplayer="/python/nextplay.html?id="+this.id)}}},m=["src"],u={key:1},_={style:{width:"100%",height:"100%","aspect-ratio":"4 / 3"}},f=["src"];function b(t,i,s,w,a,g){return e(),c(p,null,[s.type==="scratch"?(e(),n(l,{key:0,hover:"",border:"",style:{"aspect-ratio":"4 / 3"}},{default:d(()=>[r("iframe",{src:a.embedurl,scrolling:"no",frameborder:"0",style:{width:"100%",height:"100%"}},null,8,m)]),_:1})):o("",!0),s.type==="python"?(e(),c("div",u,[r("div",_,[r("iframe",{src:a.pythonplayer,scrolling:"no",frameborder:"0",style:{width:"100%",height:"100%"}},null,8,f)])])):o("",!0)],64)}const k=h(y,[["render",b]]);export{k as P};
