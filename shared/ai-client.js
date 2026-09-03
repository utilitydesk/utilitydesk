(function(w){'use strict';
  var MAX_BODY_BYTES=120000, MAX_MESSAGES=40, MAX_MESSAGE_CHARS=24000, DEFAULT_TIMEOUT=45000;
  function byteLength(s){try{return new TextEncoder().encode(s).length}catch(e){return unescape(encodeURIComponent(s)).length}}
  function clampNumber(v,fallback,min,max){var n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback}
  function errorWithCode(message,code){var e=new Error(message);e.code=code;return e}
  w.UD_AI={generate:async function(p){
    p=p||{};var messages=Array.isArray(p.messages)?p.messages:null;
    if(!messages||!messages.length||messages.length>MAX_MESSAGES)throw errorWithCode('Please provide valid AI input.','INVALID_INPUT');
    for(var i=0;i<messages.length;i++){var m=messages[i];if(!m||typeof m!=='object'||!['system','user','assistant'].includes(m.role)||typeof m.content!=='string')throw errorWithCode('Please provide valid AI input.','INVALID_INPUT');if(m.content.length>MAX_MESSAGE_CHARS)throw errorWithCode('Your input is too long. Please shorten the text and try again.','INPUT_TOO_LARGE');}
    var payload={messages:messages,temperature:clampNumber(p.temperature,.7,0,1.5),max_tokens:Math.floor(clampNumber(p.maxTokens,1200,1,2000))};var body=JSON.stringify(payload);
    if(byteLength(body)>MAX_BODY_BYTES)throw errorWithCode('Your request is too large. Please shorten the text and try again.','INPUT_TOO_LARGE');
    var controller=typeof AbortController!=='undefined'?new AbortController():null;var timer=controller?setTimeout(function(){controller.abort()},DEFAULT_TIMEOUT):null;
    try{var r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:body,signal:controller?controller.signal:undefined});var d;try{d=await r.json()}catch(e){throw errorWithCode('The AI service returned an invalid response. Please try again.','BAD_RESPONSE')}
      if(!r.ok){var msg=d&&d.error&&d.error.message||d&&d.error||('AI request failed ('+r.status+').');throw errorWithCode(String(msg).slice(0,300),r.status===429?'RATE_LIMITED':r.status>=500?'UPSTREAM_ERROR':'REQUEST_ERROR');}
      var t=d&&d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content;if(!t||!String(t).trim())throw errorWithCode('AI returned an empty response. Please try again.','EMPTY_RESPONSE');
      d.choices[0].message.content=String(t).trim();return d;
    }catch(e){if(e&&e.name==='AbortError')throw errorWithCode('The AI request timed out. Please try again.','TIMEOUT');if(e&&e.code)throw e;throw errorWithCode('Unable to reach the AI service. Please check your connection and try again.','NETWORK_ERROR');}
    finally{if(timer)clearTimeout(timer)}
  }};
})(window);
