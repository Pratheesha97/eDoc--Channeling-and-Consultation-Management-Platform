(self.webpackChunkhospital_reservation_app=self.webpackChunkhospital_reservation_app||[]).push([[300],{96300:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>u});var a=n(89526),r=(n(79007),n(28886)),o=n(2984),l=n(2652),i=n.n(l),c=n(57892),s=function(e){var t=e.auth,n=t.isAuthenticated,o=t.user,l=a.createElement("ul",{className:"navbar-nav ml-auto mt-2 mt-lg-0"},a.createElement("span",{className:"navbar-text mr-3"},a.createElement("strong",null,o?"Welcome, ".concat(o.first_name,"!"):"")),a.createElement("form",{className:"form-inline "},a.createElement("button",{type:"button",className:"btn btn-outline-light rounded-pill",onClick:function(){e.logout(),location.href="/"}},a.createElement("b",null,"Logout")))),i=a.createElement("form",{className:"form-inline "},a.createElement("button",{type:"button",className:"btn btn-outline-light rounded-pill",onClick:function(){e.signInOutSwitch()}},a.createElement("b",null,"Login")),a.createElement("button",{className:"btn btn-outline-light rounded-pill ml-3 mr-3",type:"button",onClick:function(){e.signUpSwitch()}},a.createElement("b",null,"Register")));return a.createElement("nav",{className:"navbar navbar-expand-lg navbar-dark ".concat(n?"bg-dark":"headerZIndex"," header")},a.createElement("a",{className:"navbar-brand",href:n?null:""},a.createElement("img",{src:r.Z,width:"80",height:"50"})),a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarTogglerDemo02","aria-controls":"navbarTogglerDemo02","aria-expanded":"false","aria-label":"Toggle navigation"},a.createElement("span",{className:"navbar-toggler-icon"})),a.createElement("div",{className:"collapse navbar-collapse",id:"navbarTogglerDemo02"},a.createElement("ul",{className:"navbar-nav mr-auto align-middle"},n?"":a.createElement("li",{className:"nav-item active"},a.createElement("a",{className:"nav-link",href:""},"Home ",a.createElement("span",{className:"sr-only"},"(current)")))),e.isDoctorMode||e.isStaffMode?"":n?l:i))};d=s,s.propTypes={auth:i().object.isRequired,logout:i().func.isRequired};const u=(0,o.$j)((function(e){return{auth:e.auth}}),{logout:c.kS})(s);var d;$RefreshReg$(d,"Navbar")},28290:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>o});var a=n(60352),r=n.n(a)()((function(e){return e[1]}));r.push([e.id,'.header {\r\n  font-family: "Raleway";\r\n  font-weight: bold;\r\n}\r\n.bg-dark {\r\n  background-color: black !important;\r\n}\r\n\r\n.headerZIndex {\r\n  z-index: 4;\r\n}\r\n',""]);const o=r},28886:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});const a=n.p+"75bdb9d8dee592cced47957b9e1a14d5.png"},60352:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=e(t);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,a){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(a)for(var o=0;o<this.length;o++){var l=this[o][0];null!=l&&(r[l]=!0)}for(var i=0;i<e.length;i++){var c=[].concat(e[i]);a&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),t.push(c))}},t}},75701:(e,t,n)=>{"use strict";var a,r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),o=[];function l(e){for(var t=-1,n=0;n<o.length;n++)if(o[n].identifier===e){t=n;break}return t}function i(e,t){for(var n={},a=[],r=0;r<e.length;r++){var i=e[r],c=t.base?i[0]+t.base:i[0],s=n[c]||0,u="".concat(c," ").concat(s);n[c]=s+1;var d=l(u),f={css:i[1],media:i[2],sourceMap:i[3]};-1!==d?(o[d].references++,o[d].updater(f)):o.push({identifier:u,updater:p(f,t),references:1}),a.push(u)}return a}function c(e){var t=document.createElement("style"),a=e.attributes||{};if(void 0===a.nonce){var o=n.nc;o&&(a.nonce=o)}if(Object.keys(a).forEach((function(e){t.setAttribute(e,a[e])})),"function"==typeof e.insert)e.insert(t);else{var l=r(e.insert||"head");if(!l)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");l.appendChild(t)}return t}var s,u=(s=[],function(e,t){return s[e]=t,s.filter(Boolean).join("\n")});function d(e,t,n,a){var r=n?"":a.media?"@media ".concat(a.media," {").concat(a.css,"}"):a.css;if(e.styleSheet)e.styleSheet.cssText=u(t,r);else{var o=document.createTextNode(r),l=e.childNodes;l[t]&&e.removeChild(l[t]),l.length?e.insertBefore(o,l[t]):e.appendChild(o)}}function f(e,t,n){var a=n.css,r=n.media,o=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(a+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}var m=null,v=0;function p(e,t){var n,a,r;if(t.singleton){var o=v++;n=m||(m=c(t)),a=d.bind(null,n,o,!1),r=d.bind(null,n,o,!0)}else n=c(t),a=f.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===a&&(a=Boolean(window&&document&&document.all&&!window.atob)),a));var n=i(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var a=0;a<n.length;a++){var r=l(n[a]);o[r].references--}for(var c=i(e,t),s=0;s<n.length;s++){var u=l(n[s]);0===o[u].references&&(o[u].updater(),o.splice(u,1))}n=c}}}},79007:(e,t,n)=>{"use strict";var a=n(75701),r=n.n(a),o=n(28290),l=r()(o.default,{insert:"head",singleton:!1});if(!o.default.locals||e.hot.invalidate){var i=o.default.locals;e.hot.accept(28290,(t=>{o=n(28290),function(e,t,n){if(!e&&t||e&&!t)return!1;var a;for(a in e)if(e[a]!==t[a])return!1;for(a in t)if(!e[a])return!1;return!0}(i,o.default.locals)?(i=o.default.locals,l(o.default)):e.hot.invalidate()}))}e.hot.dispose((function(){l()})),o.default.locals}}]);