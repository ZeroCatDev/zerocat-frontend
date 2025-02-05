import{u as ke,a as Ce,m as we}from"./VSelect-CLzRD2pM.js";import{f as Se,p as xe,aN as Ae,R,$ as A,az as H,a5 as g,by as Fe,aM as De,bz as Ie,bA as Pe,a0 as _,bh as G,bk as Re,i as _e,aj as J,a as o,M,W as Q,bL as Me,af as Te,al as S,ag as Ee,L as Y,P as Le,bB as Ne,X as Be,H as Oe,aC as Ke,bC as Ue,aD as ze,bD as He,bE as Z,bF as ee}from"./index-D0HrcQOC.js";import{u as We,m as $e}from"./filter-D3O4-iln.js";import{V as je}from"./VCheckboxBtn-D3diWHT0.js";import{V as qe}from"./VChip-B0uQpSOf.js";function Xe(l,V,u){if(V==null)return l;if(Array.isArray(V))throw new Error("Multiple matches is not implemented");return typeof V=="number"&&~V?o(M,null,[o("span",{class:"v-autocomplete__unmask"},[l.substr(0,V)]),o("span",{class:"v-autocomplete__mask"},[l.substr(V,u)]),o("span",{class:"v-autocomplete__unmask"},[l.substr(V+u)])]):l}const Ge=xe({autoSelectFirst:{type:[Boolean,String]},clearOnSelect:Boolean,search:String,...$e({filterKeys:["title"]}),...we(),...ze(He({modelValue:null,role:"combobox"}),["validationValue","dirty","appendInnerIcon"]),...Ue({transition:!1})},"VAutocomplete"),ll=Se()({name:"VAutocomplete",props:Ge(),emits:{"update:focused":l=>!0,"update:search":l=>!0,"update:modelValue":l=>!0,"update:menu":l=>!0},setup(l,V){let{slots:u}=V;const{t:T}=Ae(),h=R(),y=A(!1),k=A(!0),E=A(!1),W=R(),L=R(),N=H(l,"menu"),c=g({get:()=>N.value,set:e=>{var a;N.value&&!e&&((a=W.value)!=null&&a.ΨopenChildren.size)||(N.value=e)}}),s=A(-1),le=g(()=>{var e;return(e=h.value)==null?void 0:e.color}),$=g(()=>c.value?l.closeText:l.openText),{items:j,transformIn:ae,transformOut:te}=Fe(l),{textColorClasses:ue,textColorStyles:ne}=De(le),v=H(l,"search",""),n=H(l,"modelValue",[],e=>ae(e===null?[null]:Ie(e)),e=>{const a=te(e);return l.multiple?a:a[0]??null}),oe=g(()=>typeof l.counterValue=="function"?l.counterValue(n.value):typeof l.counterValue=="number"?l.counterValue:n.value.length),F=Pe(l),{filteredItems:B,getMatches:ie}=We(l,j,()=>k.value?"":v.value),b=g(()=>l.hideSelected?B.value.filter(e=>!n.value.some(a=>a.value===e.value)):B.value),D=g(()=>!!(l.chips||u.chip)),x=g(()=>D.value||!!u.selection),se=g(()=>n.value.map(e=>e.props.value)),O=g(()=>{var a;return(l.autoSelectFirst===!0||l.autoSelectFirst==="exact"&&v.value===((a=b.value[0])==null?void 0:a.title))&&b.value.length>0&&!k.value&&!E.value}),K=g(()=>l.hideNoData&&!b.value.length||F.isReadonly.value||F.isDisabled.value),U=R(),re=ke(U,h);function ce(e){l.openOnClear&&(c.value=!0),v.value=""}function ve(){K.value||(c.value=!0)}function de(e){K.value||(y.value&&(e.preventDefault(),e.stopPropagation()),c.value=!c.value)}function fe(e){var a;e.key!==" "&&Z(e)&&((a=h.value)==null||a.focus())}function me(e){var t,i,m;if(F.isReadonly.value)return;const a=h.value.selectionStart,r=n.value.length;if(["Enter","ArrowDown","ArrowUp"].includes(e.key)&&e.preventDefault(),["Enter","ArrowDown"].includes(e.key)&&(c.value=!0),["Escape"].includes(e.key)&&(c.value=!1),O.value&&["Enter","Tab"].includes(e.key)&&!n.value.some(d=>{let{value:f}=d;return f===b.value[0].value})&&C(b.value[0]),e.key==="ArrowDown"&&O.value&&((t=U.value)==null||t.focus("next")),["Backspace","Delete"].includes(e.key)){if(!l.multiple&&x.value&&n.value.length>0&&!v.value)return C(n.value[0],!1);if(~s.value){e.preventDefault();const d=s.value;C(n.value[s.value],!1),s.value=d>=r-1?r-2:d}else e.key==="Backspace"&&!v.value&&(s.value=r-1);return}if(l.multiple)if(e.key==="ArrowLeft"){if(s.value<0&&a>0)return;const d=s.value>-1?s.value-1:r-1;n.value[d]?s.value=d:(s.value=-1,h.value.setSelectionRange((i=v.value)==null?void 0:i.length,(m=v.value)==null?void 0:m.length))}else if(e.key==="ArrowRight"){if(s.value<0)return;const d=s.value+1;n.value[d]?s.value=d:(s.value=-1,h.value.setSelectionRange(0,0))}else~s.value&&Z(e)&&(s.value=-1)}function pe(e){if(ee(h.value,":autofill")||ee(h.value,":-webkit-autofill")){const a=j.value.find(r=>r.title===e.target.value);a&&C(a)}}function he(){var e;l.eager&&((e=L.value)==null||e.calculateVisibleItems())}function ge(){var e;y.value&&(k.value=!0,(e=h.value)==null||e.focus())}function Ve(e){y.value=!0,setTimeout(()=>{E.value=!0})}function ye(e){E.value=!1}function be(e){(e==null||e===""&&!l.multiple&&!x.value)&&(n.value=[])}const z=A(!1);function C(e){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;if(!(!e||e.props.disabled))if(l.multiple){const r=n.value.findIndex(i=>l.valueComparator(i.value,e.value)),t=a??!~r;if(~r){const i=t?[...n.value,e]:[...n.value];i.splice(r,1),n.value=i}else t&&(n.value=[...n.value,e]);l.clearOnSelect&&(v.value="")}else{const r=a!==!1;n.value=r?[e]:[],v.value=r&&!x.value?e.title:"",G(()=>{c.value=!1,k.value=!0})}}return _(y,(e,a)=>{var r;e!==a&&(e?(z.value=!0,v.value=l.multiple||x.value?"":String(((r=n.value.at(-1))==null?void 0:r.props.title)??""),k.value=!0,G(()=>z.value=!1)):(!l.multiple&&v.value==null&&(n.value=[]),c.value=!1,n.value.some(t=>{let{title:i}=t;return i===v.value})||(v.value=""),s.value=-1))}),_(v,e=>{!y.value||z.value||(e&&(c.value=!0),k.value=!e)}),_(c,()=>{if(!l.hideSelected&&c.value&&n.value.length){const e=b.value.findIndex(a=>n.value.some(r=>a.value===r.value));Re&&window.requestAnimationFrame(()=>{var a;e>=0&&((a=L.value)==null||a.scrollToIndex(e))})}}),_(()=>l.items,(e,a)=>{c.value||y.value&&!a.length&&e.length&&(c.value=!0)}),_e(()=>{const e=!!(!l.hideNoData||b.value.length||u["prepend-item"]||u["append-item"]||u["no-data"]),a=n.value.length>0,r=J.filterProps(l);return o(J,S({ref:h},r,{modelValue:v.value,"onUpdate:modelValue":[t=>v.value=t,be],focused:y.value,"onUpdate:focused":t=>y.value=t,validationValue:n.externalValue,counterValue:oe.value,dirty:a,onChange:pe,class:["v-autocomplete",`v-autocomplete--${l.multiple?"multiple":"single"}`,{"v-autocomplete--active-menu":c.value,"v-autocomplete--chips":!!l.chips,"v-autocomplete--selection-slot":!!x.value,"v-autocomplete--selecting-index":s.value>-1},l.class],style:l.style,readonly:F.isReadonly.value,placeholder:a?void 0:l.placeholder,"onClick:clear":ce,"onMousedown:control":ve,onKeydown:me}),{...u,default:()=>o(M,null,[o(Te,S({ref:W,modelValue:c.value,"onUpdate:modelValue":t=>c.value=t,activator:"parent",contentClass:"v-autocomplete__content",disabled:K.value,eager:l.eager,maxHeight:310,openOnClick:!1,closeOnContentClick:!1,transition:l.transition,onAfterEnter:he,onAfterLeave:ge},l.menuProps),{default:()=>[e&&o(Ee,S({ref:U,selected:se.value,selectStrategy:l.multiple?"independent":"single-independent",onMousedown:t=>t.preventDefault(),onKeydown:fe,onFocusin:Ve,onFocusout:ye,tabindex:"-1","aria-live":"polite",color:l.itemColor??l.color},re,l.listProps),{default:()=>{var t,i,m;return[(t=u["prepend-item"])==null?void 0:t.call(u),!b.value.length&&!l.hideNoData&&(((i=u["no-data"])==null?void 0:i.call(u))??o(Y,{key:"no-data",title:T(l.noDataText)},null)),o(Ce,{ref:L,renderless:!0,items:b.value},{default:d=>{var X;let{item:f,index:w,itemRef:p}=d;const q=S(f.props,{ref:p,key:f.value,active:O.value&&w===0?!0:void 0,onClick:()=>C(f,null)});return((X=u.item)==null?void 0:X.call(u,{item:f,index:w,props:q}))??o(Y,S(q,{role:"option"}),{prepend:I=>{let{isSelected:P}=I;return o(M,null,[l.multiple&&!l.hideSelected?o(je,{key:f.value,modelValue:P,ripple:!1,tabindex:"-1"},null):void 0,f.props.prependAvatar&&o(Le,{image:f.props.prependAvatar},null),f.props.prependIcon&&o(Q,{icon:f.props.prependIcon},null)])},title:()=>{var I,P;return k.value?f.title:Xe(f.title,(I=ie(f))==null?void 0:I.title,((P=v.value)==null?void 0:P.length)??0)}})}}),(m=u["append-item"])==null?void 0:m.call(u)]}})]}),n.value.map((t,i)=>{function m(p){p.stopPropagation(),p.preventDefault(),C(t,!1)}const d={"onClick:close":m,onKeydown(p){p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),p.stopPropagation(),m(p))},onMousedown(p){p.preventDefault(),p.stopPropagation()},modelValue:!0,"onUpdate:modelValue":void 0},f=D.value?!!u.chip:!!u.selection,w=f?Ne(D.value?u.chip({item:t,index:i,props:d}):u.selection({item:t,index:i})):void 0;if(!(f&&!w))return o("div",{key:t.value,class:["v-autocomplete__selection",i===s.value&&["v-autocomplete__selection--selected",ue.value]],style:i===s.value?ne.value:{}},[D.value?u.chip?o(Be,{key:"chip-defaults",defaults:{VChip:{closable:l.closableChips,size:"small",text:t.title}}},{default:()=>[w]}):o(qe,S({key:"chip",closable:l.closableChips,size:"small",text:t.title,disabled:t.props.disabled},d),null):w??o("span",{class:"v-autocomplete__selection-text"},[t.title,l.multiple&&i<n.value.length-1&&o("span",{class:"v-autocomplete__selection-comma"},[Oe(",")])])])})]),"append-inner":function(){var d;for(var t=arguments.length,i=new Array(t),m=0;m<t;m++)i[m]=arguments[m];return o(M,null,[(d=u["append-inner"])==null?void 0:d.call(u,...i),l.menuIcon?o(Q,{class:"v-autocomplete__menu-icon",icon:l.menuIcon,onMousedown:de,onClick:Me,"aria-label":T($.value),title:T($.value),tabindex:"-1"},null):void 0])}})}),Ke({isFocused:y,isPristine:k,menu:c,search:v,filteredItems:B,select:C},h)}});export{ll as V};
