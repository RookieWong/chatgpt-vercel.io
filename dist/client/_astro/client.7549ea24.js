import{c as p,r as e}from"./index.d7373e3e.js";var l,f,u=p;f=u.createRoot,l=u.hydrateRoot;const a=({value:t,name:r})=>t?e.createElement("astro-slot",{name:r,suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:t}}):null;a.shouldComponentUpdate=()=>!1;function E(t){for(const r in t)if(r.startsWith("__reactContainer"))return r}const v=t=>(r,n,{default:o,...d},{client:y})=>{if(!t.hasAttribute("ssr"))return;for(const[i,m]of Object.entries(d))n[i]=e.createElement(a,{value:m,name:i});const s=e.createElement(r,n,o!=null?e.createElement(a,{value:o}):o),c=E(t);return c&&delete t[c],y==="only"?e.startTransition(()=>{f(t).render(s)}):e.startTransition(()=>{l(t,s)})};export{v as default};
