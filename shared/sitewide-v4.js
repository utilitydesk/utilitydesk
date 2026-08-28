/* UtilityDesk.in — Sitewide UI normalization v4 */
(function(){
  "use strict";
  function init(){
    document.documentElement.classList.add("ud-sitewide-v4");

    /* Older calculator builds contained a second fixed nav (#udNav).
       CSS hides it, but remove it from the accessibility tree as well. */
    document.querySelectorAll("#udNav").forEach(function(el){
      el.setAttribute("aria-hidden","true");
      el.setAttribute("tabindex","-1");
    });

    /* Mark the active page family for future component-level styling. */
    var p=location.pathname;
    var family =
      p.indexOf("/calculators/")===0 ? "calculator" :
      p.indexOf("/pdf-tools/")===0 ? "pdf" :
      p.indexOf("/document-generators/")===0 ? "document" :
      p.indexOf("/hr/")===0 ? "hr" :
      p.indexOf("/blog/")===0 ? "blog" : "core";
    document.documentElement.dataset.udFamily=family;
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();