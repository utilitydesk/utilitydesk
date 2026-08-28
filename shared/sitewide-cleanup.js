/* UtilityDesk.in â€” Sitewide DOM cleanup */
(function(){
  "use strict";
  function clean(){
    const bad = /^(?:<\s*)?section\s+class\s*=\s*["'']calc-section["'']\s*>?$/i;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const remove=[];
    while(walker.nextNode()){
      const n=walker.currentNode;
      const t=(n.nodeValue||"").trim();
      if(bad.test(t) || /^(?:<\s*)?section\s+class\s*=\s*["''](?:calc-section|tool-section)["'']\s*>$/i.test(t)){
        remove.push(n);
      }
    }
    remove.forEach(n=>n.parentNode && n.parentNode.removeChild(n));
    document.documentElement.classList.add("ud-sitewide-ready");
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",clean,{once:true});
  else clean();
})();
