var Voicemod=function(){var e=!1,t=!1,n=!1,a=!1,c=!1,o=!1;let i=null;var r="free",s="???",l={},u=-1,b=!1,g={uri:"ws://localhost",port:[59129,2e4,39273,42152,43782,46667,35679,37170,38501,33952,30546],path:"/v1",autoRetry:!1,onConnect:null,onDisconnect:null,onError:null,onMessage:null,onDebug:null},d=function(){if(!b){b=!0,++u>g.port.length-1&&(u=0);var e=g.uri+":"+g.port[u]+g.path;try{(websocket=new WebSocket(e)).onopen=p,websocket.onclose=f,websocket.onmessage=h,websocket.onerror=v}catch(t){f()}}},p=function(e){null!=g.onConnect&&g.onConnect()},f=function(e){b=!1,null!=g.onDisconnect&&g.onDisconnect(),g.autoRetry&&setTimeout(function(){d()},250)},v=function(e){null!=g.onError&&g.onError()},y=function(e){return"string"==typeof e?JSON.parse(e):e},h=function(u){if(u.data&&((message=JSON.parse(u.data)).actionType||message.action)){var b=message.actionType||message.action;switch(b){case"registerClient":(message.actionObject||message.payload)&&(message.actionObject&&(r=message.actionObject.licenseType),updateUI());break;case"toggleBackground":e=message.actionObject.value,updateUI();break;case"toggleHearMyVoice":t=message.actionObject.value,updateUI();break;case"toggleVoiceChanger":o=message.actionObject.value,updateUI();break;case"toggleMuteMemeForMe":a=message.actionObject.value,updateUI();break;case"toggleMuteMic":n=message.actionObject.value,updateUI();break;case"getUserLicense":r=message.actionObject.licenseType,updateUI();break;case"getVoices":case"getBitmap":break;case"backgroundEffectsEnabledEvent":e=!0,updateUI();break;case"backgroundEffectsDisabledEvent":e=!1,updateUI();break;case"muteMicrophoneEnabledEvent":n=!0,updateUI();break;case"muteMicrophoneDisabledEvent":n=!1,updateUI();break;case"muteMemeForMeEnabledEvent":a=!0,updateUI();break;case"muteMemeForMeDisabledEvent":a=!1,updateUI();break;case"badLanguageEnabledEvent":c=!0,updateUI();break;case"badLanguageDisabledEvent":c=!1,updateUI();break;case"HearMyVoiceEnabledEvent":t=!0,updateUI();break;case"HearMyVoiceDisabledEvent":t=!1,updateUI();break;case"getActiveSoundboardProfile":i=message.payload.profileId,updateUI();break;case"voiceChangerEnabledEvent":o=!0,updateUI();break;case"voiceChangerDisabledEvent":o=!1,updateUI();break;case"getCurrentVoice":s=message.payload.voiceId,voiceParametersManager.onVoiceChange(message.payload),updateUI();break;case"voiceParameterUpdated":voiceParametersManager.onParameterChange(message.payload);break;case"licenseTypeChangedEvent":message.actionObject&&(message.actionObject=y(message.actionObject),r=message.actionObject.licenseType,updateUI());break;case"voiceLoadedEvent":message.actionObject&&(message.actionObject=y(message.actionObject),s=message.actionObject.voiceID,updateUI()),voiceParametersManager.onVoiceChange(message.payload);break;case"parametersChangedEvent":case"parameterChangedEvent":if(message.actionObject){if(message.actionObject=y(message.actionObject),"custom"==message.actionObject.voiceID)return;l=message.actionObject.parameters}}null!=g.onMessage&&(message.actionType?g.onMessage(message.actionType,message.actionObject,message.actionID):g.onMessage(message.action,message.payload))}},k=function(e){websocket.send(e)};return this.sendMessageToServer=function(e,t=null,n=100,a=""){var c,o={};switch(e){case"registerClient":o.clientKey=t;break;case"getVoiceBitmap":o.voiceID=t,e="getBitmap";break;case"getMemeBitmap":o.memeId=t,e="getBitmap";break;case"playMeme":o.FileName=t,o.IsKeyDown=!0;break;case"selectVoice":case"loadVoice":"string"==typeof t?(o.voiceID=t,o.voiceId=t):o=t;break;case"toggleMuteMic":o.toggleMute=t;break;case"toggleVoiceChanger":null!=t&&(o.toggleVoiceChanger=t);break;case"setBeepSound":o.badLanguage=t;break;default:null!=t&&(o=t)}"/v1"===g.path?c={id:n,payload:o,action:e}:"/vmsd"===g.path&&(c={actionId:n,actionType:e,pluginVersion:"v1",context:o}),k(JSON.stringify(c))},this.init=function(e={}){g=Object.assign({},g,e),connect()},this.connect=function(){d()},this.disconnect=function(){b&&websocket.close()},Object.defineProperty(this,"backgroundEnabled",{get:function(){return e}}),Object.defineProperty(this,"hearMyVoiceEnabled",{get:function(){return t}}),Object.defineProperty(this,"voiceChangerEnabled",{get:function(){return o}}),Object.defineProperty(this,"badLanguageEnabled",{get:function(){return c}}),Object.defineProperty(this,"muteMemeForMeEnabled",{get:function(){return a}}),Object.defineProperty(this,"licenseType",{get:function(){return r}}),Object.defineProperty(this,"muted",{get:function(){return n}}),Object.defineProperty(this,"port",{get:function(){return g.port},set:function(e){u=-1,g.port=e}}),Object.defineProperty(this,"currentVoice",{get:function(){return s}}),Object.defineProperty(this,"isConnected",{get:function(){return b}}),Object.defineProperty(this,"currentlyActiveSoundboardProfile",{get:function(){return i}}),this}();
const voicesParametersArticle=$("#voicesParametersArticle"),voicesParametersArticleSelect=voicesParametersArticle.find("#setCurrentVoiceParameter-parameterName"),voiceParametersManager={currentVoiceId:"",currentVoiceParameters:{}};voiceParametersManager.onVoiceChange=e=>{if(!e)return;voiceParametersManager.currentVoiceId=e.voiceId,voiceParametersManager.currentVoiceParameters=e.parameters,voicesParametersArticleSelect.html("");let a=!0;for(let r in e.parameters)a&&(setParameterValues(e.parameters[r]),a=!1),voicesParametersArticleSelect.append(`<option val="${r}">${r}</option>`)},voiceParametersManager.onParameterChange=e=>{let a=toCamelCase(e.parameter.name),r=voiceParametersManager.currentVoiceParameters[a];r&&(r.value=e.parameter.value,a===voicesParametersArticleSelect.val()&&setParameterValues(r))},voicesParametersArticleSelect.change(()=>{let e=voiceParametersManager.currentVoiceParameters[voicesParametersArticleSelect.val()];e&&setParameterValues(e)});const setParameterValues=e=>{e&&($("#setCurrentVoiceParameter-maxValue").val(e.maxValue),$("#setCurrentVoiceParameter-minValue").val(e.minValue),$("#setCurrentVoiceParameter-value").val(e.value),$("#setCurrentVoiceParameter-displayNormalized").attr("checked",e.displayNormalized))};jQuery("#setCurrentVoiceParameters").click(()=>{let e={parameterName:$("#setCurrentVoiceParameter-parameterName").val(),parameterValue:{maxValue:parseFloat($("#setCurrentVoiceParameter-maxValue").val()),minValue:parseFloat($("#setCurrentVoiceParameter-minValue").val()),displayNormalized:$("#setCurrentVoiceParameter-displayNormalized").is(":checked"),value:parseFloat($("#setCurrentVoiceParameter-value").val())}};console.log("sending",e),Voicemod.sendMessageToServer("setCurrentVoiceParameter",e)});const toCamelCase=e=>{if(e&&"string"==typeof e)return`${e[0].toLowerCase()}${e.substr(1)}`};