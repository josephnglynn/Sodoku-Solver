var app=function(){"use strict";function t(){}const e=t=>t;function n(t){return t()}function l(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}const s="undefined"!=typeof window;let c=s?()=>window.performance.now():()=>Date.now(),u=s?t=>requestAnimationFrame(t):t;const a=new Set;function f(t){a.forEach((e=>{e.c(t)||(a.delete(e),e.f())})),0!==a.size&&u(f)}function d(t,e){t.appendChild(e)}function h(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function g(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function m(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function v(){return $(" ")}function b(){return $("")}function x(t,e,n,l){return t.addEventListener(e,n,l),()=>t.removeEventListener(e,n,l)}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t){return""===t?null:+t}function S(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function k(t,e){t.value=null==e?"":e}function _(t,e,n,l){t.style.setProperty(e,n,l?"important":"")}const M=new Set;let C,T=0;function L(t,e,n,l,o,r,i,s=0){const c=16.666/l;let u="{\n";for(let t=0;t<=1;t+=c){const l=e+(n-e)*r(t);u+=100*t+`%{${i(l,1-l)}}\n`}const a=u+`100% {${i(n,1-n)}}\n}`,f=`__svelte_${function(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}(a)}_${s}`,d=t.ownerDocument;M.add(d);const h=d.__svelte_stylesheet||(d.__svelte_stylesheet=d.head.appendChild(m("style")).sheet),p=d.__svelte_rules||(d.__svelte_rules={});p[f]||(p[f]=!0,h.insertRule(`@keyframes ${f} ${a}`,h.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${f} ${l}ms linear ${o}ms 1 both`,T+=1,f}function P(t,e){const n=(t.style.animation||"").split(", "),l=n.filter(e?t=>t.indexOf(e)<0:t=>-1===t.indexOf("__svelte")),o=n.length-l.length;o&&(t.style.animation=l.join(", "),T-=o,T||u((()=>{T||(M.forEach((t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}})),M.clear())})))}function A(t){C=t}function q(t){(function(){if(!C)throw new Error("Function called outside component initialization");return C})().$$.on_mount.push(t)}const E=[],O=[],I=[],j=[],B=Promise.resolve();let G=!1;function W(t){I.push(t)}let N=!1;const z=new Set;function F(){if(!N){N=!0;do{for(let t=0;t<E.length;t+=1){const e=E[t];A(e),H(e.$$)}for(A(null),E.length=0;O.length;)O.pop()();for(let t=0;t<I.length;t+=1){const e=I[t];z.has(e)||(z.add(e),e())}I.length=0}while(E.length);for(;j.length;)j.pop()();G=!1,N=!1,z.clear()}}function H(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(W)}}let D;function R(t,e,n){t.dispatchEvent(function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(`${e?"intro":"outro"}${n}`))}const J=new Set;let U;function Y(){U={r:0,c:[],p:U}}function K(){U.r||o(U.c),U=U.p}function Q(t,e){t&&t.i&&(J.delete(t),t.i(e))}function V(t,e,n,l){if(t&&t.o){if(J.has(t))return;J.add(t),U.c.push((()=>{J.delete(t),l&&(n&&t.d(1),l())})),t.o(e)}}const X={duration:0};function Z(n,l,i,s){let d=l(n,i),h=s?0:1,p=null,g=null,m=null;function $(){m&&P(n,m)}function v(t,e){const n=t.b-h;return e*=Math.abs(n),{a:h,b:t.b,d:n,duration:e,start:t.start,end:t.start+e,group:t.group}}function b(l){const{delay:r=0,duration:i=300,easing:s=e,tick:b=t,css:x}=d||X,y={start:c()+r,b:l};l||(y.group=U,U.r+=1),p||g?g=y:(x&&($(),m=L(n,h,l,i,r,s,x)),l&&b(0,1),p=v(y,i),W((()=>R(n,l,"start"))),function(t){let e;0===a.size&&u(f),new Promise((n=>{a.add(e={c:t,f:n})}))}((t=>{if(g&&t>g.start&&(p=v(g,i),g=null,R(n,p.b,"start"),x&&($(),m=L(n,h,p.b,p.duration,0,s,d.css))),p)if(t>=p.end)b(h=p.b,1-h),R(n,p.b,"end"),g||(p.b?$():--p.group.r||o(p.group.c)),p=null;else if(t>=p.start){const e=t-p.start;h=p.a+p.d*s(e/p.duration),b(h,1-h)}return!(!p&&!g)})))}return{run(t){r(d)?(D||(D=Promise.resolve(),D.then((()=>{D=null}))),D).then((()=>{d=d(),b(t)})):b(t)},end(){$(),p=g=null}}}function tt(t){t&&t.c()}function et(t,e,l){const{fragment:i,on_mount:s,on_destroy:c,after_update:u}=t.$$;i&&i.m(e,l),W((()=>{const e=s.map(n).filter(r);c?c.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(W)}function nt(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function lt(t,e){-1===t.$$.dirty[0]&&(E.push(t),G||(G=!0,B.then(F)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ot(e,n,r,i,s,c,u=[-1]){const a=C;A(e);const f=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:s,bound:l(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:l(),dirty:u,skip_bound:!1};let d=!1;if(f.ctx=r?r(e,n.props||{},((t,n,...l)=>{const o=l.length?l[0]:n;return f.ctx&&s(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),d&&lt(e,t)),n})):[],f.update(),d=!0,o(f.before_update),f.fragment=!!i&&i(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(p)}else f.fragment&&f.fragment.c();n.intro&&Q(e.$$.fragment),et(e,n.target,n.anchor),F()}A(a)}class rt{$destroy(){nt(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}var it;!function(t){t[t.Welcome=0]="Welcome",t[t.ChooseSize=1]="ChooseSize",t[t.SetSudoku=2]="SetSudoku",t[t.Solver=3]="Solver"}(it||(it={}));const st=[];function ct(e){let n,l,o,r,i,s,c,u;return{c(){n=m("label"),l=m("label"),l.textContent="Dark Mode Toggle",o=v(),r=m("input"),i=v(),s=m("span"),y(l,"class","hidden-label"),y(l,"for","darkModeToggle"),y(r,"id","darkModeToggle"),y(r,"type","checkbox"),y(r,"class","svelte-15moqbj"),y(s,"class","slider svelte-15moqbj"),y(n,"class","switch svelte-15moqbj")},m(t,a){h(t,n,a),d(n,l),d(n,o),d(n,r),d(n,i),d(n,s),c||(u=x(r,"click",e[2]),c=!0)},p:t,d(t){t&&p(n),c=!1,u()}}}function ut(e){let n,l,o,r,i,s,c,u;return{c(){n=m("label"),l=m("label"),l.textContent="Dark Mode Toggle",o=v(),r=m("input"),i=v(),s=m("span"),y(l,"class","hidden-label"),y(l,"for","darkModeToggle"),y(r,"id","darkModeToggle"),r.checked="checked",y(r,"type","checkbox"),y(r,"class","svelte-15moqbj"),y(s,"class","slider svelte-15moqbj"),y(n,"class","switch svelte-15moqbj")},m(t,a){h(t,n,a),d(n,l),d(n,o),d(n,r),d(n,i),d(n,s),c||(u=x(r,"click",e[2]),c=!0)},p:t,d(t){t&&p(n),c=!1,u()}}}function at(e){let n,l,o,r,i,s,c,u,a,f,g,$,b;function w(t,e){return t[1]?ut:ct}let S=w(e),k=S(e);return{c(){n=m("main"),l=m("div"),l.innerHTML='<h1 class="svelte-15moqbj">Welcome To Sudoku <br/> Solver</h1> \n        <br/> \n        <p>A Simple Way To Solve Sudokus</p>',o=v(),r=m("div"),i=v(),s=m("footer"),c=m("button"),c.textContent="Continue",u=v(),a=m("div"),k.c(),f=v(),g=m("p"),g.textContent="Written By Joseph Glynn",_(l,"padding-bottom","20px"),_(r,"flex","1"),y(c,"class","is-primary button"),_(a,"display","flex"),_(a,"justify-content","space-between"),_(n,"display","flex"),_(n,"flex-direction","column"),_(n,"min-height","100vh"),_(n,"min-width","100vw"),y(n,"class","svelte-15moqbj")},m(t,p){h(t,n,p),d(n,l),d(n,o),d(n,r),d(n,i),d(n,s),d(s,c),d(s,u),d(s,a),k.m(a,null),d(a,f),d(a,g),$||(b=x(c,"click",e[3]),$=!0)},p(t,[e]){S===(S=w(t))&&k?k.p(t,e):(k.d(1),k=S(t),k&&(k.c(),k.m(a,f)))},i:t,o:t,d(t){t&&p(n),k.d(),$=!1,b()}}}function ft(e,n,l){let{changePage:o}=n;const r=localStorage.getItem("theme"),s=function(e,n=t){let l;const o=[];function r(t){if(i(e,t)&&(e=t,l)){const t=!st.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),st.push(n,e)}if(t){for(let t=0;t<st.length;t+=2)st[t][0](st[t+1]);st.length=0}}}return{set:r,update:function(t){r(t(e))},subscribe:function(i,s=t){const c=[i,s];return o.push(c),1===o.length&&(l=n(r)||t),i(e),()=>{const t=o.indexOf(c);-1!==t&&o.splice(t,1),0===o.length&&(l(),l=null)}}}}(r);s.subscribe((t=>{localStorage.setItem("theme","dark-mode"===t?"dark-mode":"")}));let c=!1,u=!1;q((()=>{null!=r&&"dark-mode"==r&&(a(),l(1,u=!0))}));const a=()=>{c=!c,c?(document.body.classList.add("dark-mode"),s.set("dark-mode")):(document.body.classList.remove("dark-mode"),s.set(""))};return e.$$set=t=>{"changePage"in t&&l(0,o=t.changePage)},[o,u,a,()=>o(it.ChooseSize)]}class dt extends rt{constructor(t){super(),ot(this,t,ft,at,i,{changePage:0})}}const ht=t=>{const e=t*t,n=[];let l=[];for(let t=0;t<e;t++){let o=[];for(let t=0;t<e;t++)o.push(0);n.push(o),l.push(t+1)}for(let t=0;t<e;t++){const n=Math.floor(Math.random()*(e-1))+1;[l[t],l[n]]=[l[n],l[t]]}n[0]=l;for(let l=1;l<e;l++)n[l]=gt(l%t==0?1:t,n[l-1]);return pt(n,t)},pt=(t,e)=>{const n=[];for(let t=0;t<e;t++)n.push([]);for(let l=0;l<t.length;l++)for(let o=0;o<e;o++)n[o].push(t[l].slice(e*o,e*o+e));return[n[0],n[1]]=[n[1],n[0]],t},gt=(t,e)=>{const n=[];for(let l=t;l<e.length;l++)n.push(e[l]);for(let l=0;l<t;l++)n.push(e[l]);return n};function mt(t,e,n){const l=t.slice();return l[2]=e[n],l[4]=n,l}function $t(t,e,n){const l=t.slice();return l[5]=e[n],l[7]=n,l}function vt(t,e,n){const l=t.slice();return l[5]=e[n],l[7]=n,l}function bt(t){let e,n,l=t[2],o=[];for(let e=0;e<l.length;e+=1)o[e]=St($t(t,l,e));return{c(){e=m("tr");for(let t=0;t<o.length;t+=1)o[t].c();n=v(),y(e,"class","svelte-1cp22h7")},m(t,l){h(t,e,l);for(let t=0;t<o.length;t+=1)o[t].m(e,null);d(e,n)},p(t,r){if(3&r){let i;for(l=t[2],i=0;i<l.length;i+=1){const s=$t(t,l,i);o[i]?o[i].p(s,r):(o[i]=St(s),o[i].c(),o[i].m(e,n))}for(;i<o.length;i+=1)o[i].d(1);o.length=l.length}},d(t){t&&p(e),g(o,t)}}}function xt(t){let e,n,l=t[2],o=[];for(let e=0;e<l.length;e+=1)o[e]=Mt(vt(t,l,e));return{c(){e=m("tr");for(let t=0;t<o.length;t+=1)o[t].c();n=v(),_(e,"border-bottom","solid"),y(e,"class","svelte-1cp22h7")},m(t,l){h(t,e,l);for(let t=0;t<o.length;t+=1)o[t].m(e,null);d(e,n)},p(t,r){if(3&r){let i;for(l=t[2],i=0;i<l.length;i+=1){const s=vt(t,l,i);o[i]?o[i].p(s,r):(o[i]=Mt(s),o[i].c(),o[i].m(e,n))}for(;i<o.length;i+=1)o[i].d(1);o.length=l.length}},d(t){t&&p(e),g(o,t)}}}function yt(t){let e,n,l=t[5]+"";return{c(){e=m("td"),n=$(l),y(e,"class","svelte-1cp22h7")},m(t,l){h(t,e,l),d(e,n)},p(t,e){1&e&&l!==(l=t[5]+"")&&S(n,l)},d(t){t&&p(e)}}}function wt(t){let e,n,l=t[5]+"";return{c(){e=m("td"),n=$(l),_(e,"border-right","solid"),y(e,"class","svelte-1cp22h7")},m(t,l){h(t,e,l),d(e,n)},p(t,e){1&e&&l!==(l=t[5]+"")&&S(n,l)},d(t){t&&p(e)}}}function St(t){let e;let n=function(t,e){return(t[7]+1)%t[1]==0?wt:yt}(t)(t);return{c(){n.c(),e=b()},m(t,l){n.m(t,l),h(t,e,l)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&p(e)}}}function kt(t){let e,n,l=t[5]+"";return{c(){e=m("td"),n=$(l),y(e,"class","svelte-1cp22h7")},m(t,l){h(t,e,l),d(e,n)},p(t,e){1&e&&l!==(l=t[5]+"")&&S(n,l)},d(t){t&&p(e)}}}function _t(t){let e,n,l=t[5]+"";return{c(){e=m("td"),n=$(l),_(e,"border-right","solid"),y(e,"class","svelte-1cp22h7")},m(t,l){h(t,e,l),d(e,n)},p(t,e){1&e&&l!==(l=t[5]+"")&&S(n,l)},d(t){t&&p(e)}}}function Mt(t){let e;let n=function(t,e){return(t[7]+1)%t[1]==0?_t:kt}(t)(t);return{c(){n.c(),e=b()},m(t,l){n.m(t,l),h(t,e,l)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&p(e)}}}function Ct(t){let e;let n=function(t,e){return(t[4]+1)%t[1]==0?xt:bt}(t)(t);return{c(){n.c(),e=b()},m(t,l){n.m(t,l),h(t,e,l)},p(t,e){n.p(t,e)},d(t){n.d(t),t&&p(e)}}}function Tt(e){let n,l=e[0],o=[];for(let t=0;t<l.length;t+=1)o[t]=Ct(mt(e,l,t));return{c(){n=m("table");for(let t=0;t<o.length;t+=1)o[t].c();y(n,"class","svelte-1cp22h7")},m(t,e){h(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null)},p(t,[e]){if(3&e){let r;for(l=t[0],r=0;r<l.length;r+=1){const i=mt(t,l,r);o[r]?o[r].p(i,e):(o[r]=Ct(i),o[r].c(),o[r].m(n,null))}for(;r<o.length;r+=1)o[r].d(1);o.length=l.length}},i:t,o:t,d(t){t&&p(n),g(o,t)}}}function Lt(t,e,n){let{state:l=ht(3)}=e,o=Math.sqrt(l.length);return t.$$set=t=>{"state"in t&&n(0,l=t.state)},[l,o]}class Pt extends rt{constructor(t){super(),ot(this,t,Lt,Tt,i,{state:0})}}function At(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1}function qt(t){const e=t-1;return e*e*e+1}function Et(t,{delay:e=0,duration:n=400,easing:l=At,amount:o=5,opacity:r=0}={}){const i=getComputedStyle(t),s=+i.opacity,c="none"===i.filter?"":i.filter,u=s*(1-r);return{delay:e,duration:n,easing:l,css:(t,e)=>`opacity: ${s-u*e}; filter: ${c} blur(${e*o}px);`}}function Ot(t,{delay:e=0,duration:n=400,easing:l=qt,x:o=0,y:r=0,opacity:i=0}={}){const s=getComputedStyle(t),c=+s.opacity,u="none"===s.transform?"":s.transform,a=c*(1-i);return{delay:e,duration:n,easing:l,css:(t,e)=>`\n\t\t\ttransform: ${u} translate(${(1-t)*o}px, ${(1-t)*r}px);\n\t\t\topacity: ${c-a*e}`}}function It(t,{delay:e=0,duration:n=400,easing:l=qt}={}){const o=getComputedStyle(t),r=+o.opacity,i=parseFloat(o.height),s=parseFloat(o.paddingTop),c=parseFloat(o.paddingBottom),u=parseFloat(o.marginTop),a=parseFloat(o.marginBottom),f=parseFloat(o.borderTopWidth),d=parseFloat(o.borderBottomWidth);return{delay:e,duration:n,easing:l,css:t=>`overflow: hidden;opacity: ${Math.min(20*t,1)*r};height: ${t*i}px;padding-top: ${t*s}px;padding-bottom: ${t*c}px;margin-top: ${t*u}px;margin-bottom: ${t*a}px;border-top-width: ${t*f}px;border-bottom-width: ${t*d}px;`}}function jt(t){let e,n,l;return{c(){e=m("div"),e.innerHTML='<h6 class="is-warning" style="color: red">Warning: This Field Can&#39;t Be Empty</h6>'},m(t,n){h(t,e,n),l=!0},i(t){l||(W((()=>{n||(n=Z(e,It,{},!0)),n.run(1)})),l=!0)},o(t){n||(n=Z(e,It,{},!1)),n.run(0),l=!1},d(t){t&&p(e),t&&n&&n.end()}}}function Bt(t){let e,n,l;return{c(){e=m("div"),e.innerHTML='<h6 class="is-warning" style="color: red">Warning: Are You Sure You Want It To Be This Size. If So Press\n                    Continue Button Again</h6>'},m(t,n){h(t,e,n),l=!0},i(t){l||(W((()=>{n||(n=Z(e,It,{},!0)),n.run(1)})),l=!0)},o(t){n||(n=Z(e,It,{},!1)),n.run(0),l=!1},d(t){t&&p(e),t&&n&&n.end()}}}function Gt(t){let e,n,l;return{c(){e=m("div"),e.innerHTML='<h6 class="is-danger" style="color: red">Error: Must Be Greater Than 1</h6>'},m(t,n){h(t,e,n),l=!0},i(t){l||(W((()=>{n||(n=Z(e,It,{},!0)),n.run(1)})),l=!0)},o(t){n||(n=Z(e,It,{},!1)),n.run(0),l=!1},d(t){t&&p(e),t&&n&&n.end()}}}function Wt(t){let e,n,l,r,i,s,c,u,a,f,g,$,b,S,M,C,T,L,P,A,q,E;i=new Pt({});const O=[Gt,Bt,jt],I=[];function j(t,e){return t[2]===t[1].TO_SMALL?0:t[2]===t[1].TO_BIG?1:t[2]===t[1].NULL?2:-1}return~(b=j(t))&&(S=I[b]=O[b](t)),{c(){e=m("main"),n=m("div"),n.innerHTML='<h1 class="svelte-1s4dw2w">Please Enter Sudoku Size</h1>',l=v(),r=m("div"),tt(i.$$.fragment),s=v(),c=m("h4"),c.textContent="Example Of Size Of 3",u=v(),a=m("label"),a.textContent="Input Size Of Sudoku",f=v(),g=m("input"),$=v(),S&&S.c(),M=v(),C=m("footer"),T=m("button"),T.textContent="Continue",L=v(),P=m("div"),P.innerHTML="<p>Written By Joseph Glynn</p>",y(a,"class","hidden-label"),y(a,"for","sudokuSizeInput"),y(g,"id","sudokuSizeInput"),y(g,"type","number"),_(r,"flex","1"),_(r,"display","flex"),_(r,"justify-content","center"),_(r,"align-items","center"),_(r,"flex-direction","column"),_(r,"margin-bottom","20px"),y(T,"class","is-primary button"),_(P,"display","flex"),_(P,"justify-content","flex-end"),_(e,"display","flex"),_(e,"flex-direction","column"),_(e,"min-height","100vh"),_(e,"min-width","100vw"),y(e,"class","svelte-1s4dw2w")},m(o,p){h(o,e,p),d(e,n),d(e,l),d(e,r),et(i,r,null),d(r,s),d(r,c),d(r,u),d(r,a),d(r,f),d(r,g),k(g,t[0]),d(r,$),~b&&I[b].m(r,null),d(e,M),d(e,C),d(C,T),d(C,L),d(C,P),A=!0,q||(E=[x(g,"input",t[5]),x(T,"click",t[6])],q=!0)},p(t,[e]){1&e&&w(g.value)!==t[0]&&k(g,t[0]);let n=b;b=j(t),b!==n&&(S&&(Y(),V(I[n],1,1,(()=>{I[n]=null})),K()),~b?(S=I[b],S||(S=I[b]=O[b](t),S.c()),Q(S,1),S.m(r,null)):S=null)},i(t){A||(Q(i.$$.fragment,t),Q(S),A=!0)},o(t){V(i.$$.fragment,t),V(S),A=!1},d(t){t&&p(e),nt(i),~b&&I[b].d(),q=!1,o(E)}}}function Nt(t,e,n){let{changePage:l}=e,o=null;var r;!function(t){t[t.TO_BIG=0]="TO_BIG",t[t.TO_SMALL=1]="TO_SMALL",t[t.NULL=2]="NULL"}(r||(r={}));let i=null;const s=()=>{document.getElementById("sudokuSizeInput").focus(),null==o?n(2,i=r.NULL):o>=5&&i!=r.TO_BIG?n(2,i=r.TO_BIG):o<=1?n(2,i=r.TO_SMALL):l(it.SetSudoku,o)};return t.$$set=t=>{"changePage"in t&&n(4,l=t.changePage)},[o,r,i,s,l,function(){o=w(this.value),n(0,o)},()=>s()]}class zt extends rt{constructor(t){super(),ot(this,t,Nt,Wt,i,{changePage:4})}}function Ft(t,e,n){const l=t.slice();return l[6]=e[n],l[7]=e,l[8]=n,l}function Ht(t,e,n){const l=t.slice();return l[9]=e[n],l[12]=e,l[11]=n,l}function Dt(t,e,n){const l=t.slice();return l[9]=e[n],l[10]=e,l[11]=n,l}function Rt(t){let e,n,l=t[6],o=[];for(let e=0;e<l.length;e+=1)o[e]=Kt(Ht(t,l,e));return{c(){e=m("tr");for(let t=0;t<o.length;t+=1)o[t].c();n=v(),y(e,"class","svelte-92bqe7")},m(t,l){h(t,e,l);for(let t=0;t<o.length;t+=1)o[t].m(e,null);d(e,n)},p(t,r){if(3&r){let i;for(l=t[6],i=0;i<l.length;i+=1){const s=Ht(t,l,i);o[i]?o[i].p(s,r):(o[i]=Kt(s),o[i].c(),o[i].m(e,n))}for(;i<o.length;i+=1)o[i].d(1);o.length=l.length}},d(t){t&&p(e),g(o,t)}}}function Jt(t){let e,n,l=t[6],o=[];for(let e=0;e<l.length;e+=1)o[e]=Xt(Dt(t,l,e));return{c(){e=m("tr");for(let t=0;t<o.length;t+=1)o[t].c();n=v(),_(e,"border-bottom","solid"),y(e,"class","svelte-92bqe7")},m(t,l){h(t,e,l);for(let t=0;t<o.length;t+=1)o[t].m(e,null);d(e,n)},p(t,r){if(3&r){let i;for(l=t[6],i=0;i<l.length;i+=1){const s=Dt(t,l,i);o[i]?o[i].p(s,r):(o[i]=Xt(s),o[i].c(),o[i].m(e,n))}for(;i<o.length;i+=1)o[i].d(1);o.length=l.length}},d(t){t&&p(e),g(o,t)}}}function Ut(t){let e,n,l,o,r,i;function s(){t[5].call(n,t[8],t[11])}return{c(){e=m("td"),n=m("input"),l=v(),o=m("label"),y(n,"type","number"),y(n,"id",t[11].toString()+"4"),n.required=!0,y(n,"class","svelte-92bqe7"),y(o,"class","hidden-label"),y(o,"for",t[11].toString()+"4"),y(e,"class","svelte-92bqe7")},m(c,u){h(c,e,u),d(e,n),k(n,t[0][t[8]][t[11]]),d(e,l),d(e,o),r||(i=x(n,"input",s),r=!0)},p(e,l){t=e,1&l&&w(n.value)!==t[0][t[8]][t[11]]&&k(n,t[0][t[8]][t[11]])},d(t){t&&p(e),r=!1,i()}}}function Yt(t){let e,n,l,o,r,i;function s(){t[4].call(n,t[8],t[11])}return{c(){e=m("td"),n=m("input"),l=v(),o=m("label"),y(n,"type","number"),y(n,"id",t[11].toString()+"3"),n.required=!0,y(n,"class","svelte-92bqe7"),y(o,"class","hidden-label"),y(o,"for",t[11].toString()+"3"),_(e,"border-right","solid"),y(e,"class","svelte-92bqe7")},m(c,u){h(c,e,u),d(e,n),k(n,t[0][t[8]][t[11]]),d(e,l),d(e,o),r||(i=x(n,"input",s),r=!0)},p(e,l){t=e,1&l&&w(n.value)!==t[0][t[8]][t[11]]&&k(n,t[0][t[8]][t[11]])},d(t){t&&p(e),r=!1,i()}}}function Kt(t){let e;function n(t,e){return(t[11]+1)%t[1]==0?Yt:Ut}let l=n(t),o=l(t);return{c(){o.c(),e=b()},m(t,n){o.m(t,n),h(t,e,n)},p(t,r){l===(l=n(t))&&o?o.p(t,r):(o.d(1),o=l(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&p(e)}}}function Qt(t){let e,n,l,o,r,i;function s(){t[3].call(n,t[8],t[11])}return{c(){e=m("td"),n=m("input"),l=v(),o=m("label"),y(n,"type","number"),y(n,"id",t[11].toString()+"2"),n.required=!0,y(n,"class","svelte-92bqe7"),y(o,"class","hidden-label"),y(o,"for",t[11].toString()+"2"),y(e,"class","svelte-92bqe7")},m(c,u){h(c,e,u),d(e,n),k(n,t[0][t[8]][t[11]]),d(e,l),d(e,o),r||(i=x(n,"input",s),r=!0)},p(e,l){t=e,1&l&&w(n.value)!==t[0][t[8]][t[11]]&&k(n,t[0][t[8]][t[11]])},d(t){t&&p(e),r=!1,i()}}}function Vt(t){let e,n,l,o,r,i;function s(){t[2].call(n,t[8],t[11])}return{c(){e=m("td"),n=m("input"),l=v(),o=m("label"),y(n,"type","number"),y(n,"id",t[11].toString()+"1"),n.required=!0,y(n,"class","svelte-92bqe7"),y(o,"class","hidden-label"),y(o,"for",t[11].toString()+"1"),_(e,"border-right","solid"),y(e,"class","svelte-92bqe7")},m(c,u){h(c,e,u),d(e,n),k(n,t[0][t[8]][t[11]]),d(e,l),d(e,o),r||(i=x(n,"input",s),r=!0)},p(e,l){t=e,1&l&&w(n.value)!==t[0][t[8]][t[11]]&&k(n,t[0][t[8]][t[11]])},d(t){t&&p(e),r=!1,i()}}}function Xt(t){let e;function n(t,e){return(t[11]+1)%t[1]==0?Vt:Qt}let l=n(t),o=l(t);return{c(){o.c(),e=b()},m(t,n){o.m(t,n),h(t,e,n)},p(t,r){l===(l=n(t))&&o?o.p(t,r):(o.d(1),o=l(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&p(e)}}}function Zt(t){let e;function n(t,e){return(t[8]+1)%t[1]==0?Jt:Rt}let l=n(t),o=l(t);return{c(){o.c(),e=b()},m(t,n){o.m(t,n),h(t,e,n)},p(t,r){l===(l=n(t))&&o?o.p(t,r):(o.d(1),o=l(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&p(e)}}}function te(e){let n,l=e[0],o=[];for(let t=0;t<l.length;t+=1)o[t]=Zt(Ft(e,l,t));return{c(){n=m("table");for(let t=0;t<o.length;t+=1)o[t].c();y(n,"class","svelte-92bqe7")},m(t,e){h(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null)},p(t,[e]){if(3&e){let r;for(l=t[0],r=0;r<l.length;r+=1){const i=Ft(t,l,r);o[r]?o[r].p(i,e):(o[r]=Zt(i),o[r].c(),o[r].m(n,null))}for(;r<o.length;r+=1)o[r].d(1);o.length=l.length}},i:t,o:t,d(t){t&&p(n),g(o,t)}}}function ee(t,e,n){let{length:l=3}=e,{state:o=[]}=e;for(let t=0;t<l*l;t++){o.push([]);for(let e=0;e<l*l;e++)o[t].push(null)}return t.$$set=t=>{"length"in t&&n(1,l=t.length),"state"in t&&n(0,o=t.state)},[o,l,function(t,e){o[t][e]=w(this.value),n(0,o)},function(t,e){o[t][e]=w(this.value),n(0,o)},function(t,e){o[t][e]=w(this.value),n(0,o)},function(t,e){o[t][e]=w(this.value),n(0,o)}]}class ne extends rt{constructor(t){super(),ot(this,t,ee,te,i,{length:1,state:0})}}function le(t){let e,n,l,r,i,s,c,u,a,f,g,$,b,w,S,k,M;function C(e){t[5].call(null,e)}let T={length:t[0]};return void 0!==t[1]&&(T.state=t[1]),i=new ne({props:T}),O.push((()=>function(t,e,n){const l=t.$$.props[e];void 0!==l&&(t.$$.bound[l]=n,n(t.$$.ctx[l]))}(i,"state",C))),{c(){e=m("main"),n=m("div"),n.innerHTML='<h1 class="svelte-15in3xw">Please Enter Known Sudoku Numbers</h1>',l=v(),r=m("div"),tt(i.$$.fragment),c=v(),u=m("footer"),a=m("div"),f=m("button"),f.textContent="Calculate Step By\n                Step",g=v(),$=m("button"),$.textContent="Calculate All In One\n                Go",b=v(),w=m("div"),w.innerHTML="<p>Written By Joseph Glynn</p>",_(r,"flex","1"),_(r,"display","flex"),_(r,"justify-content","center"),_(r,"align-items","center"),_(r,"flex-direction","column"),_(f,"margin","15px"),y(f,"class","is-primary button"),_($,"margin","15px"),y($,"class","is-primary button"),_(a,"display","flex"),_(a,"flex-direction","unset"),_(a,"justify-content","center"),_(a,"flex-wrap","wrap"),_(w,"display","flex"),_(w,"justify-content","flex-end"),_(u,"margin-top","40px"),_(e,"display","flex"),_(e,"flex-direction","column"),_(e,"min-height","100vh"),_(e,"min-width","100vw"),y(e,"class","svelte-15in3xw")},m(o,s){h(o,e,s),d(e,n),d(e,l),d(e,r),et(i,r,null),d(e,c),d(e,u),d(u,a),d(a,f),d(a,g),d(a,$),d(u,b),d(u,w),S=!0,k||(M=[x(f,"click",t[6]),x($,"click",t[7])],k=!0)},p(t,[e]){const n={};var l;1&e&&(n.length=t[0]),!s&&2&e&&(s=!0,n.state=t[1],l=()=>s=!1,j.push(l)),i.$set(n)},i(t){S||(Q(i.$$.fragment,t),S=!0)},o(t){V(i.$$.fragment,t),S=!1},d(t){t&&p(e),nt(i),k=!1,o(M)}}}function oe(t,e,n){let{length:l=3}=e,{changePage:o}=e,{showMessage:r}=e,i=[];const s=t=>{(()=>{for(let t=0;t<i.length;t++)for(let e=0;e<i.length;e++)if(null!=i[t][e]&&(i[t][e]<=0||i[t][e]>i.length))return!1;return!0})()?o(it.Solver,i,t):r("The sudoku is invalid",(()=>{}),(()=>{}))};return t.$$set=t=>{"length"in t&&n(0,l=t.length),"changePage"in t&&n(3,o=t.changePage),"showMessage"in t&&n(4,r=t.showMessage)},[l,i,s,o,r,function(t){i=t,n(1,i)},()=>s(!1),()=>s(!0)]}class re extends rt{constructor(t){super(),ot(this,t,oe,le,i,{length:0,changePage:3,showMessage:4})}}const ie=(t,e,n,l,o)=>{for(let r=0;r<o*o;r++){const i=o*Math.floor(e/o)+Math.floor(r/o),s=o*Math.floor(n/o)+r%o;if(t[e][r]==l||t[r][n]==l||t[i][s]==l)return!1}return!0},se=(t,e)=>{for(let n=0;n<t.length;n++)for(let l=0;l<t.length;l++)if(0==t[n][l]){for(let o=1;o<=e*e;o++)if(ie(t,n,l,o,e)){if(t[n][l]=o,se(t,e))return!0;t[n][l]=0}return!1}return!0},ce=t=>{for(let e=0;e<t.length;e++)for(let n=0;n<t.length;n++)if(0==t[e][n])return!1;return!0},ue=(t,e)=>(se(t,e),t),ae=(t,e,n,l)=>{let o=fe(e*e);return de(t,o)||he(t,o)||pe(t,e,o)||ge(t,e)||(null!=l||ce(t)?l("This Sudoku Proved To Be To Difficult\nReverting To Brute Force",(()=>n(ue(t,e))),(()=>{})):ue(t,e)),[t,ce(t)]},fe=t=>{let e=0;for(let n=1;n<=t;n++)e+=n;return e},de=(t,e)=>{for(let n=0;n<t.length;n++){let l=0,o=0,r=0;for(let e=0;e<t.length;e++)l+=t[n][e],0==t[n][e]&&(r++,o=e);if(1==r)return t[n][o]=e-l,!0}return!1},he=(t,e)=>{for(let n=0;n<t.length;n++){let l=0,o=0,r=0;for(let e=0;e<t.length;e++)l+=t[e][n],0==t[e][n]&&(r++,o=e);if(1==r)return t[o][n]=e-l,!0}return!1},pe=(t,e,n)=>{for(let l=0;l<e;l++){let o=0,r=0;for(let n=l*e;n<(l+1)*e;n++)for(let i=l*e;i<(l+1)*e;i++)0==t[i][n]?o++:r+=t[i][n];if(1==o)for(let o=l*e;o<(l+1)*e;o++)for(let i=l*e;i<(l+1)*e;i++)if(0==t[i][o])return t[i][o]=n-r,!0}return!1},ge=(t,e)=>{let n=[];for(let t=1;t<=e*e;t++)n.push(t);let l=new Array(e*e);for(let o=0;o<t.length;o++){l[o]=new Array(e*e);for(let e=0;e<t.length;e++)0==t[o][e]?l[o][e]=n:l[o][e]=[t[o][e]]}for(let e=0;e<t.length;e++)for(let n=0;n<t.length;n++)if(1==l[e][n].length)for(let o=0;o<t.length;o++)1!=l[e][o].length&&(l[e][o]=l[e][o].filter((t=>t!=l[e][n][0]))),1!=l[o][n].length&&(l[o][n]=l[o][n].filter((t=>t!=l[e][n][0])));for(let n=0;n<t.length;n+=e)for(let o=0;o<t.length;o+=e){let t=[];for(let r=n;r<n+e;r++)for(let n=o;n<o+e;n++)1==l[r][n].length&&t.push(l[r][n][0]);for(let r=n;r<n+e;r++)for(let n=o;n<o+e;n++)l[r][n].length>1&&(l[r][n]=l[r][n].filter((e=>{for(let n=0;n<t.length;n++)if(e==t[n])return!1;return!0})))}for(let e=0;e<t.length;e++)for(let n=0;n<t.length;n++)if(1==l[e][n].length){if(0==t[e][n])return t[e][n]=l[e][n][0],!0;t[e][n]=l[e][n][0]}return!1};function me(e){let n;return{c(){n=m("h1"),n.textContent="Calculating . . .",y(n,"class","svelte-dwp07x")},m(t,e){h(t,n,e)},i:t,o:t,d(t){t&&p(n)}}}function $e(t){let e,n,l;return{c(){e=m("h1"),e.textContent="Finished!",y(e,"class","svelte-dwp07x")},m(t,n){h(t,e,n),l=!0},i(t){l||(W((()=>{n||(n=Z(e,Et,{},!0)),n.run(1)})),l=!0)},o(t){n||(n=Z(e,Et,{},!1)),n.run(0),l=!1},d(t){t&&p(e),t&&n&&n.end()}}}function ve(e){let n,l,o,r,i;return{c(){n=m("button"),n.textContent="Next Step",y(n,"class","is-primary button")},m(t,l){h(t,n,l),o=!0,r||(i=x(n,"click",e[9]),r=!0)},p:t,i(t){o||(W((()=>{l||(l=Z(n,Ot,{},!0)),l.run(1)})),o=!0)},o(t){l||(l=Z(n,Ot,{},!1)),l.run(0),o=!1},d(t){t&&p(n),t&&l&&l.end(),r=!1,i()}}}function be(e){let n,l,o,r,i;return{c(){n=m("button"),n.textContent="Start Again",y(n,"class","is-primary button")},m(t,l){h(t,n,l),o=!0,r||(i=x(n,"click",e[8]),r=!0)},p:t,i(t){o||(W((()=>{l||(l=Z(n,Ot,{},!0)),l.run(1)})),o=!0)},o(t){l||(l=Z(n,Ot,{},!1)),l.run(0),o=!1},d(t){t&&p(n),t&&l&&l.end(),r=!1,i()}}}function xe(t){let e,n,l=t[4]&&ye(t);return{c(){l&&l.c(),e=b()},m(t,o){l&&l.m(t,o),h(t,e,o),n=!0},p(t,n){t[4]?l?(l.p(t,n),16&n&&Q(l,1)):(l=ye(t),l.c(),Q(l,1),l.m(e.parentNode,e)):l&&(Y(),V(l,1,1,(()=>{l=null})),K())},i(t){n||(Q(l),n=!0)},o(t){V(l),n=!1},d(t){l&&l.d(t),t&&p(e)}}}function ye(e){let n,l,o,r,i;return{c(){n=m("button"),n.textContent="Start Again",y(n,"class","is-primary button")},m(t,l){h(t,n,l),o=!0,r||(i=x(n,"click",e[7]),r=!0)},p:t,i(t){o||(W((()=>{l||(l=Z(n,Ot,{},!0)),l.run(1)})),o=!0)},o(t){l||(l=Z(n,Ot,{},!1)),l.run(0),o=!1},d(t){t&&p(n),t&&l&&l.end(),r=!1,i()}}}function we(t){let e,n,l,o,r,i,s,c,u,a,f,g,$,b;const x=[$e,me],w=[];function S(t,e){return t[4]?0:1}l=S(t),o=w[l]=x[l](t),s=new Pt({props:{state:t[0]}});const k=[xe,be,ve],M=[];function C(t,e){return t[1]?0:t[4]?1:2}return a=C(t),f=M[a]=k[a](t),{c(){e=m("main"),n=m("div"),o.c(),r=v(),i=m("div"),tt(s.$$.fragment),c=v(),u=m("footer"),f.c(),g=v(),$=m("div"),$.innerHTML="<p>Written By Joseph Glynn</p>",_(i,"flex","1"),_(i,"display","flex"),_(i,"justify-content","center"),_(i,"align-items","center"),_(i,"flex-direction","column"),_($,"display","flex"),_($,"justify-content","flex-end"),_(e,"display","flex"),_(e,"flex-direction","column"),_(e,"min-height","100vh"),_(e,"min-width","100vw"),y(e,"class","svelte-dwp07x")},m(t,o){h(t,e,o),d(e,n),w[l].m(n,null),d(e,r),d(e,i),et(s,i,null),d(e,c),d(e,u),M[a].m(u,null),d(u,g),d(u,$),b=!0},p(t,[e]){let r=l;l=S(t),l!==r&&(Y(),V(w[r],1,1,(()=>{w[r]=null})),K(),o=w[l],o||(o=w[l]=x[l](t),o.c()),Q(o,1),o.m(n,null));const i={};1&e&&(i.state=t[0]),s.$set(i);let c=a;a=C(t),a===c?M[a].p(t,e):(Y(),V(M[c],1,1,(()=>{M[c]=null})),K(),f=M[a],f?f.p(t,e):(f=M[a]=k[a](t),f.c()),Q(f,1),f.m(u,g))},i(t){b||(Q(o),Q(s.$$.fragment,t),Q(f),b=!0)},o(t){V(o),V(s.$$.fragment,t),V(f),b=!1},d(t){t&&p(e),w[l].d(),nt(s),M[a].d()}}}function Se(t,e,n){var l=this&&this.__awaiter||function(t,e,n,l){return new(n||(n=Promise))((function(o,r){function i(t){try{c(l.next(t))}catch(t){r(t)}}function s(t){try{c(l.throw(t))}catch(t){r(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,s)}c((l=l.apply(t,e||[])).next())}))};let{state:o=[]}=e,{allInOneGo:r=!0}=e,{changePage:i}=e,{showMessage:s}=e,c=!1;for(let t=0;t<o.length;t++)for(let e=0;e<o[t].length;e++)null==o[t][e]&&(o[t][e]=0);const u=t=>{n(0,o=t),n(4,c=!0)};let a=Math.sqrt(o.length);q((()=>l(void 0,void 0,void 0,(function*(){if(r)for(n(0,[o,c]=ae(o,a,u,null),o,n(4,c));!c;)n(0,[o,c]=ae(o,a,u,null),o,n(4,c));else n(0,[o,c]=ae(o,a,u,s),o,n(4,c))}))));return t.$$set=t=>{"state"in t&&n(0,o=t.state),"allInOneGo"in t&&n(1,r=t.allInOneGo),"changePage"in t&&n(2,i=t.changePage),"showMessage"in t&&n(3,s=t.showMessage)},[o,r,i,s,c,u,a,()=>i(it.Welcome),()=>i(it.Welcome),()=>n(0,[o,c]=ae(o,a,u,s),o,n(4,c))]}class ke extends rt{constructor(t){super(),ot(this,t,Se,we,i,{state:0,allInOneGo:1,changePage:2,showMessage:3})}}function _e(e){let n,l,r,i,s,c,u,a,f,g,b;return{c(){n=m("div"),l=m("div"),r=m("h1"),i=$(e[0]),s=v(),c=m("div"),u=m("button"),u.textContent="CANCEL",a=v(),f=m("button"),f.textContent="OK",_(r,"text-align","center"),_(r,"padding","20px"),y(r,"class","svelte-17klwlx"),y(u,"class","is-danger button svelte-17klwlx"),_(u,"display","inline"),y(f,"class","is-primary button svelte-17klwlx"),_(f,"display","inline"),_(c,"display","flex"),_(c,"justify-content","space-around"),_(c,"flex-direction","row"),y(l,"class","holder svelte-17klwlx"),_(l,"align-self","center"),_(l,"background-color","black"),_(l,"padding","20px"),_(l,"border-radius","10px"),_(l,"margin","20px"),_(n,"width","100vw"),_(n,"height","100vh"),_(n,"position","relative"),_(n,"display","flex"),_(n,"justify-content","center")},m(t,o){h(t,n,o),d(n,l),d(l,r),d(r,i),d(l,s),d(l,c),d(c,u),d(c,a),d(c,f),g||(b=[x(u,"click",e[4]),x(f,"click",e[5])],g=!0)},p(t,[e]){1&e&&S(i,t[0])},i:t,o:t,d(t){t&&p(n),g=!1,o(b)}}}function Me(t,e,n){let{text:l}=e,{onAccept:o}=e,{onCancel:r}=e,{clearMessage:i}=e;return t.$$set=t=>{"text"in t&&n(0,l=t.text),"onAccept"in t&&n(1,o=t.onAccept),"onCancel"in t&&n(2,r=t.onCancel),"clearMessage"in t&&n(3,i=t.clearMessage)},[l,o,r,i,()=>{r(),i()},()=>{o(),i()}]}class Ce extends rt{constructor(t){super(),ot(this,t,Me,_e,i,{text:0,onAccept:1,onCancel:2,clearMessage:3})}}function Te(t){let e,n,l,o;return n=new ke({props:{allInOneGo:t[2],changePage:t[7],state:t[1],showMessage:t[10]}}),{c(){e=m("div"),tt(n.$$.fragment)},m(t,l){h(t,e,l),et(n,e,null),o=!0},p(t,e){const l={};4&e&&(l.allInOneGo=t[2]),2&e&&(l.state=t[1]),n.$set(l)},i(t){o||(Q(n.$$.fragment,t),W((()=>{l||(l=Z(e,It,{},!0)),l.run(1)})),o=!0)},o(t){V(n.$$.fragment,t),l||(l=Z(e,It,{},!1)),l.run(0),o=!1},d(t){t&&p(e),nt(n),t&&l&&l.end()}}}function Le(t){let e,n,l,o;return n=new re({props:{length:t[0],changePage:t[9],showMessage:t[10]}}),{c(){e=m("div"),tt(n.$$.fragment)},m(t,l){h(t,e,l),et(n,e,null),o=!0},p(t,e){const l={};1&e&&(l.length=t[0]),n.$set(l)},i(t){o||(Q(n.$$.fragment,t),W((()=>{l||(l=Z(e,It,{},!0)),l.run(1)})),o=!0)},o(t){V(n.$$.fragment,t),l||(l=Z(e,It,{},!1)),l.run(0),o=!1},d(t){t&&p(e),nt(n),t&&l&&l.end()}}}function Pe(e){let n,l,o,r;return l=new zt({props:{changePage:e[8]}}),{c(){n=m("div"),tt(l.$$.fragment)},m(t,e){h(t,n,e),et(l,n,null),r=!0},p:t,i(t){r||(Q(l.$$.fragment,t),W((()=>{o||(o=Z(n,It,{},!0)),o.run(1)})),r=!0)},o(t){V(l.$$.fragment,t),o||(o=Z(n,It,{},!1)),o.run(0),r=!1},d(t){t&&p(n),nt(l),t&&o&&o.end()}}}function Ae(e){let n,l,o,r;return l=new dt({props:{changePage:e[7]}}),{c(){n=m("div"),tt(l.$$.fragment)},m(t,e){h(t,n,e),et(l,n,null),r=!0},p:t,i(t){r||(Q(l.$$.fragment,t),W((()=>{o||(o=Z(n,It,{},!0)),o.run(1)})),r=!0)},o(t){V(l.$$.fragment,t),o||(o=Z(n,It,{},!1)),o.run(0),r=!1},d(t){t&&p(n),nt(l),t&&o&&o.end()}}}function qe(t){let e,n,l;return n=new Ce({props:{text:t[4],onAccept:t[5],onCancel:t[6],clearMessage:t[11]}}),{c(){e=m("div"),tt(n.$$.fragment),_(e,"position","absolute"),_(e,"top","0"),_(e,"left","0"),_(e,"width","100vw"),_(e,"height","100vh")},m(t,o){h(t,e,o),et(n,e,null),l=!0},p(t,e){const l={};16&e&&(l.text=t[4]),32&e&&(l.onAccept=t[5]),64&e&&(l.onCancel=t[6]),n.$set(l)},i(t){l||(Q(n.$$.fragment,t),l=!0)},o(t){V(n.$$.fragment,t),l=!1},d(t){t&&p(e),nt(n)}}}function Ee(t){let e,n,l,o,r,i;const s=[Ae,Pe,Le,Te],c=[];function u(t,e){return t[3]===it.Welcome?0:t[3]===it.ChooseSize?1:t[3]===it.SetSudoku?2:t[3]===it.Solver?3:-1}~(n=u(t))&&(l=c[n]=s[n](t));let a=null!=t[4]&&null!=t[5]&&null!=t[6]&&qe(t);return{c(){e=m("div"),l&&l.c(),o=v(),a&&a.c(),r=b()},m(t,l){h(t,e,l),~n&&c[n].m(e,null),h(t,o,l),a&&a.m(t,l),h(t,r,l),i=!0},p(t,[o]){let i=n;n=u(t),n===i?~n&&c[n].p(t,o):(l&&(Y(),V(c[i],1,1,(()=>{c[i]=null})),K()),~n?(l=c[n],l?l.p(t,o):(l=c[n]=s[n](t),l.c()),Q(l,1),l.m(e,null)):l=null),null!=t[4]&&null!=t[5]&&null!=t[6]?a?(a.p(t,o),112&o&&Q(a,1)):(a=qe(t),a.c(),Q(a,1),a.m(r.parentNode,r)):a&&(Y(),V(a,1,1,(()=>{a=null})),K())},i(t){i||(Q(l),Q(a),i=!0)},o(t){V(l),V(a),i=!1},d(t){t&&p(e),~n&&c[n].d(),t&&p(o),a&&a.d(t),t&&p(r)}}}function Oe(t,e,n){let l=0,o=[],r=!1,i=it.Welcome;let s=null,c=null,u=null;return[l,o,r,i,s,c,u,t=>{n(3,i=t)},(t,e)=>{n(0,l=e),n(3,i=t)},(t,e,l)=>{n(1,o=e),n(2,r=l),n(3,i=t)},(t,e,l)=>{console.log(`DISPLAYING MESSAGE: ${t}`),n(4,s=t),n(5,c=e),n(6,u=l)},()=>{n(4,s=null),n(5,c=null),n(6,u=null),console.log("CLEARED MESSAGES")}]}return new class extends rt{constructor(t){super(),ot(this,t,Oe,Ee,i,{})}}({target:document.body,props:{}})}();
