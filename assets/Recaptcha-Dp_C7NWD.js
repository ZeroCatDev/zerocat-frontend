import"https://static.geetest.com/v4/gt4.js";import{_ as c,e as a,o,a8 as i,c as r,w as l,H as d,I as h}from"./index-B5WfG9ST.js";const p={props:{recaptchaId:{type:String,required:!0},product:{type:String,default:"popup"},showNormal:{type:Boolean,default:!0}},data(){return{captchaObj:null,bindCaptchaObj:null}},mounted(){this.showNormal&&this.initRecaptcha()},methods:{initRecaptcha(){console.log("1cf35895f55079736b4140971e20d367"),initGeetest4({captchaId:"1cf35895f55079736b4140971e20d367",product:this.product},e=>{this.captchaObj=e,window.gt4=e,e.appendTo(`#${this.recaptchaId}`),e.onReady(()=>{console.log("Challenge Ready")}).onSuccess(()=>{console.log("Challenge Success")}).onError(()=>{console.log("Challenge Error")})})},initBindRecaptcha(){initGeetest4({captchaId:"1cf35895f55079736b4140971e20d367",product:"bind",mask:{outside:!0,bgColor:"#0000004d"}},e=>{this.bindCaptchaObj=e,e.onReady(()=>{console.log("Bind Challenge Ready")}).onSuccess(()=>{console.log("Bind Challenge Success"),this.$emit("bindVerified",this.getBindResponse())}).onError(()=>{console.log("Bind Challenge Error"),this.$emit("bindError")}).onClose(()=>{console.log("Bind Challenge Closed"),this.$emit("bindClose")})})},resetCaptcha(){var e;(e=this.captchaObj)==null||e.reset()},getResponse(){var e;return(e=this.captchaObj)==null?void 0:e.getValidate()},getBindResponse(){var e;return(e=this.bindCaptchaObj)==null?void 0:e.getValidate()},showBindCaptcha(){this.bindCaptchaObj?this.bindCaptchaObj.showBox():this.initBindRecaptcha()}}},u=["id"];function g(e,n,t,C,b,s){return o(),a("div",null,[t.showNormal?(o(),a("div",{key:0,id:t.recaptchaId},null,8,u)):i("",!0),t.showNormal?(o(),r(h,{key:1,onClick:s.resetCaptcha,variant:"text"},{default:l(()=>n[0]||(n[0]=[d("刷新")])),_:1},8,["onClick"])):i("",!0)])}const B=c(p,[["render",g]]);export{B as _};
