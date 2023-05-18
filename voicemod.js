var Voicemod = (function(){

    var pluginVersion = "1.0.0";
    var boolBackgroundEnabled = false;
    var boolHearMyVoiceEnabled = false;
    var boolMuteEnabled = false;
    var boolMuteMemeForMeEnabled = false;
    var boolBadLanguage = false;
    var boolVoiceChangerEnabled = false;
    let currentlyActiveSoundboardProfile = null;
    var stringLicenseType = "free";
    var selectedVoice = "???";
    var currentParameters = {};
    var currentPort = -1;
    var connected = false;

    var options = {
        uri : "ws://localhost",
        port : [59129, 20000, 39273, 42152, 43782, 46667, 35679, 37170, 38501, 33952, 30546],
        path : "/v1",
        autoRetry : false, 
        onConnect : null,
        onDisconnect : null,
        onError : null,
        onMessage : null, 
        onDebug : null 
    }

    var onLoad = function() {       
        if(connected){
            return;
        }
        connected = true;

        currentPort++;
        if(currentPort > options.port.length -1 ) currentPort = 0;

        var wsUri = options.uri + ":" + options.port[currentPort] + options.path;
        try {
            websocket = new WebSocket(wsUri);
            websocket.onopen = onOpen;
            websocket.onclose = onClose;
            websocket.onmessage = onMessage;
            websocket.onerror = onError;
        }
        catch(err) {
            onClose();
        }   
    }

    var onOpen = function(evt) {
        if(options.onConnect != null)
            options.onConnect();
    }

    var onClose = function(evt) {
        connected = false;
        if(options.onDisconnect != null)
            options.onDisconnect();
        if(options.autoRetry){
            setTimeout(function() {
                onLoad();
            }, 250);
        }            
    }

    var onError = function(evt) {
        if(options.onError != null)
            options.onError();   
    }

    var parseIfNeeded = function(actionObject)
    {
        if(typeof(actionObject) === "string")
        {
            return JSON.parse(actionObject);
        }
        return actionObject;
    }

    var onMessage = function(evt) {
        if (evt.data) {
            message = JSON.parse(evt.data);

            if (message.actionType || message.action){
                var action = message.actionType || message.action;                

                switch(action) {
					case 'registerClient':
                        if (message.actionObject || message.payload) {
                            if (message.actionObject)
                                stringLicenseType = message.actionObject.licenseType;

                            updateUI();
                        }
                        break
					case 'toggleBackground':
						boolBackgroundEnabled = message.actionObject.value;
						updateUI();
						break
					case 'toggleHearMyVoice':
						boolHearMyVoiceEnabled = message.actionObject.value;
						updateUI();
						break
					case 'toggleVoiceChanger':
						boolVoiceChangerEnabled = message.actionObject.value;
						updateUI();
						break
					case 'toggleMuteMemeForMe':
						boolMuteMemeForMeEnabled = message.actionObject.value;
						updateUI();
						break
					case 'toggleMuteMic':
						boolMuteEnabled = message.actionObject.value;
						updateUI();
						break
					case 'getUserLicense':
						stringLicenseType = message.actionObject.licenseType;
						updateUI();
						break
                    case 'getVoices':
                        break
                    case 'getBitmap':
                        break
                    case 'backgroundEffectsEnabledEvent':
                        boolBackgroundEnabled = true;
						updateUI();
                        break
                    case 'backgroundEffectsDisabledEvent':
                        boolBackgroundEnabled = false;
						updateUI();
                        break
                    case 'muteMicrophoneEnabledEvent':
                        boolMuteEnabled = true;
						updateUI();
                        break
                    case 'muteMicrophoneDisabledEvent':
                        boolMuteEnabled = false;
						updateUI();
                        break
                    case 'muteMemeForMeEnabledEvent':
                        boolMuteMemeForMeEnabled = true;
                        updateUI();
                        break
                    case 'muteMemeForMeDisabledEvent':
                        boolMuteMemeForMeEnabled = false;
                        updateUI();
                        break
                    case 'badLanguageEnabledEvent':
                        boolBadLanguage = true;
                        updateUI();
                        break
                    case 'badLanguageDisabledEvent':
                        boolBadLanguage = false;
                        updateUI();
                        break
                    case 'HearMyVoiceEnabledEvent':
                        boolHearMyVoiceEnabled = true;
                        updateUI();
                        break
                    case 'HearMyVoiceDisabledEvent':
                        boolHearMyVoiceEnabled = false;
                        updateUI();
                        break
                    case 'getActiveSoundboardProfile':
                        currentlyActiveSoundboardProfile = message.payload.profileId;
                        updateUI();
                        break;
                    case 'voiceChangerEnabledEvent':
                        boolVoiceChangerEnabled = true;
                        updateUI();
                        break
                    case 'voiceChangerDisabledEvent':
                        boolVoiceChangerEnabled = false;
                        updateUI();
                        break;
                    case 'getCurrentVoice':
                        selectedVoice = message.payload.voiceId;
                        voiceParametersManager.onVoiceChange(message.payload);
                        updateUI();
                        break;
                    case 'voiceParameterUpdated':
                        voiceParametersManager.onParameterChange(message.payload);
                        break;
                    case 'licenseTypeChangedEvent':
                        if (message.actionObject) {
                            message.actionObject = parseIfNeeded(message.actionObject);
                            stringLicenseType = message.actionObject.licenseType;
                            updateUI();
                        }
                        break
                    case 'voiceLoadedEvent':
                        if (message.actionObject) {
                            message.actionObject = parseIfNeeded(message.actionObject);
                            selectedVoice = message.actionObject.voiceID;
                            updateUI();
                        }
                        voiceParametersManager.onVoiceChange(message.payload);
                        break
                    case 'parametersChangedEvent':
                        if (message.actionObject) {
                            message.actionObject = parseIfNeeded(message.actionObject);
                            if(message.actionObject.voiceID == "custom")
                                return;
                            currentParameters = message.actionObject.parameters;
                        }
                        break                        
                    case 'parameterChangedEvent':
                        if (message.actionObject) {
                            message.actionObject = parseIfNeeded(message.actionObject);
                            if(message.actionObject.voiceID == "custom")
                                return;
                            currentParameters = message.actionObject.parameters;
                        }
                        break                                         
                    default:
                }
                if (options.onMessage != null)
                    if (message.actionType)
                        options.onMessage(message.actionType, message.actionObject, message.actionID); 
                    else
                        options.onMessage(message.action, message.payload);
            } else {
            }
        }
    }

    var sendMessage = function(message) {
        websocket.send(message);
    }    

    this.sendMessageToServer = function(message, value = null, actionID = 100, contextID = "") {
        var jsonArray;
        var actionObject = {};
        
        switch(message) {
            case 'registerClient':
                actionObject["clientKey"] = value;
                break;
            case 'getVoiceBitmap':
                actionObject["voiceID"] = value;
                message = 'getBitmap';
                break;
            case 'getMemeBitmap':
                actionObject["memeId"] = value;
                message = 'getBitmap';
                break;
            case 'playMeme':
                actionObject["FileName"] = value;
                actionObject["IsKeyDown"] = true;
                break; 
            case 'selectVoice':
            case 'loadVoice':
                if (typeof value === 'string') {
                    actionObject["voiceID"] = value;
                    actionObject["voiceId"] = value;
                } else {
                    actionObject = value;
                }
                break;
            case 'toggleMuteMic':
                actionObject["toggleMute"] = value;
                break;
            case 'toggleVoiceChanger':
                if(value != null)
                    actionObject["toggleVoiceChanger"] = value;
                break;
            case 'setBeepSound':
                actionObject["badLanguage"] = value;
                break;                
            case 'setVoiceParameter':
                if (value != null)
                    actionObject = value;
                break;
            default:
                if (value != null)
                    actionObject = value;
                break;
        }

        if (options.path === '/v1'){
            jsonArray = {
                "id" : actionID,
                "payload" : actionObject,
                "action" : message,
            };
        } else if(options.path === '/vmsd') {
            jsonArray = {
                "actionId" : actionID,
                "actionType" : message,
                'pluginVersion': 'v1',
                "context" : actionObject,
            };
        }

        var messageToSend = JSON.stringify(jsonArray);
        sendMessage(messageToSend);
    }

    this.init = function(optionsObj={}) {
        options = Object.assign( {}, options, optionsObj );
        connect();
    }

    this.connect = function() {
        onLoad();
    }

    this.disconnect = function() {
        if(connected)
            websocket.close();
    }

      Object.defineProperty(this,'backgroundEnabled',{
        get:function(){
            return boolBackgroundEnabled;
        }
    })
    Object.defineProperty(this,'hearMyVoiceEnabled',{
        get:function(){
            return boolHearMyVoiceEnabled;
        }
    })
    Object.defineProperty(this,'voiceChangerEnabled',{
        get:function(){
            return boolVoiceChangerEnabled;
        }
    })
    Object.defineProperty(this,'badLanguageEnabled',{
        get:function(){
            return boolBadLanguage;
        }
    })    
    Object.defineProperty(this,'muteMemeForMeEnabled',{
        get:function(){
            return boolMuteMemeForMeEnabled;
        }
    })    
    Object.defineProperty(this,'licenseType',{
        get:function(){
            return stringLicenseType;
        }
    })    
    Object.defineProperty(this,'muted',{
        get:function(){
            return boolMuteEnabled;
        }
    })
    Object.defineProperty(this,'port',{
        get:function(){
            return options.port;
        },
        set:function(newPort){
            currentPort = -1;
            options.port = newPort;
        }
    })
    Object.defineProperty(this,'currentVoice',{
        get:function(){
            return selectedVoice;
        }
    })

    Object.defineProperty(this,'isConnected',{
        get:function(){
            return connected;
        }
    })
    
    Object.defineProperty(this,'currentlyActiveSoundboardProfile',{
        get:function(){
            return currentlyActiveSoundboardProfile;
        }
    })

    return this;
})();
