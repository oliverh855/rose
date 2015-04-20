var kango=window.kango={};kango.lang={evalInSandbox:function(a,c,b){(new Function(c+"\n//# sourceURL=sandboxed-"+b+".js"))()},evalScriptsInSandbox:function(a,c,b){for(var d="",e=0;e<c.length;e++){for(var f=0;f<c[e].requires.length;f++)d+=c[e].requires[f].text+"\n\n";d+=c[e].text+"\n\n"}return this.evalInSandbox(a,d,b)}};kango.console={log:function(a){console.log(a)},warn:function(a){console.warn(a)},error:function(a){console.error(a)}};kango.tab={isPrivate:function(){return!1}};
kango.xhr={send:function(a,c){var b=a.contentType;if("xml"==b||"json"==b)a.contentType="text";a.sanitizeData=!0;kango.invokeAsyncCallback("kango.xhr.send",a,function(d){if(""!=d.response&&null!=d.response)if("json"==b)try{d.response=JSON.parse(d.response)}catch(e){d.response=null}else if("xml"==b)try{var f=new DOMParser;d.response=f.parseFromString(d.response,"text/xml")}catch(g){d.response=null}a.contentType=b;c(d)})}};
var apiReady=function(){var a=!1,c=[];return{on:function(b){a?b():c.push(b)},fire:function(){a=!0;array.forEach(c,function(b){b()});c=[]}}}();
function initStorage(a){var c=a;kango.storage={setItem:function(b,d,a){"undefined"!=typeof d?"function"!=typeof d&&(c[b]=d,a||this.fireEvent("setItem",{data:{name:b,value:d}})):this.removeItem(b)},getItem:function(b){return"undefined"!=typeof c[b]?c[b]:null},removeItem:function(b,a){delete c[b];a||this.fireEvent("removeItem",{data:{name:b}})},getKeys:function(){var b=[],a;for(a in c)c.hasOwnProperty(a)&&b.push(a);return b},clear:function(a){c={};a||this.fireEvent("clear")}};object.mixin(kango.storage,
EventTarget.prototype);object.mixin(kango.storage,new EventTarget);StorageSyncModule(kango.storage,func.bind(kango.addEventListener,kango),func.bind(kango.dispatchMessage,kango))}function initI18n(a,c){kango.i18n={getMessages:function(){return c},getMessage:function(a){var d=c[a]?c[a]:a;return 1<arguments.length?string.format.apply(string,[d].concat(Array.prototype.slice.call(arguments,1))):d},getCurrentLocale:function(){return a}}}
function initApi(){initMessaging();var a=new MessageTargetModule(func.bind(kango.addEventListener,kango));kango.addMessageListener=func.bind(a.addMessageListener,a);kango.removeMessageListener=func.bind(a.removeMessageListener,a);a=new InvokeAsyncModule(func.bind(kango.addEventListener,kango),func.bind(kango.dispatchMessage,kango),null,func.bind(kango.console.log,kango.console));kango.invokeAsync=a.invokeAsync;kango.invokeAsyncCallback=a.invokeAsyncCallback;kango.invokeAsync("modules/kango/extension_info/getRawData",
function(a){kango.getExtensionInfo=function(){return a};kango.invokeAsync("modules/kango/storage/storage.getItems",function(a){initStorage(a);kango.invokeAsync("modules/kango/i18n/getCurrentLocale",function(a){kango.invokeAsync("modules/kango/i18n/getMessages",function(b){initI18n(a,b);apiReady.fire()})})})})};