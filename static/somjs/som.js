~ function(WIN,DOC){

/*Base Data.star*/
var HASH_require = {}, HASH_loaded = {}, ARR_callback = [],som = {};
/*Base Data.end*//*script node use.star*/
var HEAD = DOC.head || DOC.getElementsByTagName('head')[0], REX_readyState = /^loaded|complete|undefined$/;
function appendScript(url, errorback, qName){
	if(HASH_require[url]) return;
	HASH_require[url] = 1;
	var _head = HEAD, _doc = DOC, _script = _doc.createElement('script');
	_script.src = url;
	_script.type = 'text/javascript';
	_script.charset = 'utf-8';
 	_script.defer = true;
 	_head.appendChild(_script);
 	removeScript(_script, url, errorback, qName);
}
function removeScript(node, url, errorback, qName){		
	node.onload = node.onreadystatechange = node.onerror = function(){
		if(REX_readyState.test(node.readyState)){
			node.onerror = node.onload = node.onreadystatechange = null;
			if(node.clearAttributes)
				node.clearAttributes();
			HEAD.removeChild(node);
			node.src = node.type = node.charset = node.defer = null;
			useCallback(url, qName);
			useErrorback(url,errorback);
		}
	}
}
/*script node use.end*//*main!!!.star*/
function require(list,callback,errorback){
	if(!list.length) return callback();
	var i = 0, mod_name, _HASH_loaded = HASH_loaded, qName, somQuery = som.config.query;
	while(mod_name = list[i++]){
		qName = undefined;
		if(somQuery && somQuery.hasOwnProperty(mod_name)) qName = mod_name;
		mod_name = filledUrl(mod_name);
		if(!_HASH_loaded[mod_name]){
			appendScript(mod_name, errorback, qName);
		}
	}
	if(!callback) return;
	provide(list,callback);
}
function define(){
	var _ARGS = defineArguments(arguments);
	var _mode_name = _ARGS.mod_name;
	HASH_require[_mode_name] = 2;
	var exports = {}, value, 
		use = function(url){
			url = filledUrl(url);
			return HASH_loaded[url] 
		};
	require(_ARGS.require_list,function(){
		HASH_require[_mode_name] = 3;
		HASH_loaded[_mode_name] = _ARGS.callback(use,exports) || exports;
	},_ARGS.errorback)
}
function provide(list,callback){
	function _fun(){
		var i = 0, mod_name, value = 0, length = list.length, _HASH_require = HASH_require;
		while(mod_name = list[i++]){
			mod_name = filledUrl(mod_name);
			value += _HASH_require[mod_name];
		}
		if(value == length*3){
			ARR_callback.shift();
			callback();
			return true;
		}
		return false
	}
	ARR_callback.unshift(_fun);
}
/*main!!!.end*//*use callback.star*/
function useCallback(url, qName){
	if(qName){	//插件在这里录入!!!!!!!!
		var queryExports = som.config.query[qName].exports;
		HASH_require[url] = 3;
		HASH_loaded[url] = WIN[queryExports];
		try{
			//确保对象
			WIN[queryExports] = undefined;
			delete WIN[queryExports];
		}catch(e){
			WIN[queryExports] = undefined;
		}
	}
	var i = 0, callbacks = ARR_callback.slice(0), temp;
	while(temp = callbacks[i++]){
		if(!temp()){
			break
		}
	}
}
/*use callback.end*//*enter.star*/
function useErrorback(mod_name,errorback){
	if(HASH_require[mod_name] == 1 && errorback) errorback(mod_name);
}
/*enter.end*//*fixed[功能补丁].star*/
var REX_require = /require\(([\s\S]*?)\)/ig;
var REX_jssrc = /['']([\s\S]*)['']/;
var REX_pathe = /^(\.\.\/|\.\/)+/;
var REX_num = /\.\.\//g;
function defineArguments(arg){
	var i = 0, temp,
		value = {
					mod_name:'',
					require_list:[],
					callback:null,
					errorback:null
				};
	while(temp = arg[i++]){
		switch(mytypeOf(temp)){
			case 'String':
				value.mod_name = temp;
				break;
			case 'Array':
				value.require_list = temp;
				break;
			case 'Function':
				if(!value.callback){
					value.callback = temp;
				}else{
					value.errorback = temp;
				}
		}
	}
	if(!value.mod_name) value.mod_name = getTheUrl();
	if(!value.require_list.length) value.require_list = getRequireList(value.callback);
	return value;
}
function getRequireList(fun){
	var ARR_require = fun.toString().match(REX_require), ARR_value = [], i=0, temp;
	if(!ARR_require) return [];
	while(temp = ARR_require[i++]){
		ARR_value[ARR_value.length] = temp.match(REX_jssrc)[1];
	}
	return ARR_value;
}
function getTheUrl(){ //@http://www.cnblogs.com/rubylouvre/archive/2013/01/23/2872618.html
	if(DOC.currentScript) return DOC.currentScript.src;
    try{
        a();
    }catch(e){
        var stack = e.stack;
        if(!stack && window.opera) stack = (String(e).match(/of linked script \S+/g) || []).join(' ');
    }
    if(stack){
        stack = stack.split( /[@ ]/g).pop();
        stack = stack[0] == '(' ? stack.slice(1,-1) : stack;
        return stack.replace(/(:\d+)?:\d+$/i, '');
    }
	var nodes = HEAD.getElementsByTagName('script'), i=0, temp;
	while(temp = nodes[i++]){
		if(temp.readyState === 'interactive') {
            return temp.src;
        }
	}
}
function filledUrl(url){
	if(!REX_pathe.test(url)){
		if(som.config.query.hasOwnProperty(url)){
			return arguments.callee(som.config.query[url].url);
		}else if(som.config.short.hasOwnProperty(url)){
			return arguments.callee(som.config.short[url]);
		}else{
			return url;	
		}
	} 
	var i = 0;
	url = url.replace(REX_pathe,function(a,b){
		var num = a.match(REX_num);
		if(num) i = num.length;
		return '/';
	})
	var _basePatch = som.config.basePatch;
	while(i--){
		_basePatch = _basePatch.slice(0,_basePatch.lastIndexOf('/'))
	}
	return _basePatch+url;
}

/*fixed[功能补丁].star*//*tool.star*/
var BODY = DOC.body || DOC.getElementsByTagName('body')[0];
function log(arg,is){
	if(!WIN.console || is){
		var DIV = DOC.createElement('div');
		DIV.innerHTML = arg;
		BODY.appendChild(DIV);
	}else{
		WIN.console.log(arg);
	}
}
function mytypeOf(key){
	switch(Object.prototype.toString.call(key)){
	case '[object Array]' 		: return 'Array';
	case '[object String]' 		: return 'String';
	case '[object RegExp]' 		: return 'RegExp';
	case '[object Number]' 		: return 'Number';
	case '[object Function]'	: return 'Function';
	case '[object Boolean]' 	: return 'Boolean';
	default :
		switch(key){
			case null 			: return 'Null';
			case undefined 		: return 'Undefined';
			default 			: return 'Object';
		}
	}
};
/*tool.end*//*第一次载入配置[config]和入口.star*/
som.config = function(obj){
	for(var i in obj){
		this.config[i] = obj[i]
	}
	HASH_require[getTheUrl()] = 3;
}
;(function(){
	var scripts = DOC.getElementsByTagName('script'),
		NODE_som = scripts[scripts.length-1],
		URL_som = NODE_som.src,
		URL_main = NODE_som.getAttribute('data-main'),
		URL_config = NODE_som.getAttribute('data-config');
	som.config.basePatch = URL_som.slice(0,URL_som.lastIndexOf('/'));
	if(URL_config && URL_main){
		require([URL_config],function(){
			require([URL_main]);
		});
	}else if(URL_main){
		require([URL_main]);
	} 
	
})()
/*第一次载入配置[config]和入口.end*//*全局引用.star*/
som.require = require;
som.log = log;
WIN.som = som;
WIN.define = define;
/*全局引用.end*/

}(window,document)