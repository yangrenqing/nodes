/**
 *@Star : 2012.2.3
 *@version : 1.2.0
 */
~ function(WIN, DOC){
/*******************************************************************************************************************
 * @fileoverview somesayss core核心 v1.1.0
 */
var $ = function(arg){
	if(arg && arg.somesayss)	//为了防止 $($($())) 这种情况发生
		return arg;
	var C = somObject;
	switch($.Typeof(arg)){
		case "Object"	: return (arg.nodeType || arg === WIN) ? new C([arg]) : new C(arg);		//为了区分nodeList和DOM对象 对winsow特殊处理
		case "String"	: return arg === '' ? [] : new C(Selector(arg));
		case "Array" 	: return new C(arg);
		case "Function" : return $.doc.ready(arg);
		default 		: return [];
	}
};
var HTML = $.html = DOC.documentElement;
var HEAD = $.head = DOC.head || DOC.getElementsByTagName('head')[0];
var BODY = $.body = DOC.body;
/*----base----*/
$.Browser = (function(WIN){
	return {
		IE6		: !!WIN.ActiveXObject && !WIN.XMLHttpRequest,
		IE7		: !+"\v1" && !DOC.querySelector,
		IE8		: !+"\v1",
		IE		: !!WIN.attachEvent && !WIN.opera,
		opear	: !!WIN.opera
	}
})(WIN);
$.Class = {
	creat:function(){
		return function(){
			this.init.apply(this, arguments);
		}
	},
	extend:function(current, target, futher){
        for(var i in current.prototype){
            target.prototype[i] = current.prototype[i]
        }
        if(!futher) return;
        for(var j in futher){
            target.prototype[j] = futher[j]
        }
        var _currentInit =  $.Use(current.prototype.init);
        var _futherInit = $.Use(futher.init);
        var _InitArgname = _currentInit.argumentsName().concat(_futherInit.argumentsName()).join(",");
        var _InitBody = _currentInit.body() + _futherInit.body();
        eval('target.prototype.init=function('+_InitArgname+'){'+_InitBody+'}');
    }
};
$.Object = {
	extend: function(target, source){		//对象的继承
		for(var i in source)
			target[i] = source[i];
		return target;
	},
	clone: function(source){		//对象的复制
		return this.extend({}, source)
	},
	hasname: function(obj, name){		//判断是否有这个方法
		try{
			var is = obj.hasOwnProperty(name);
			if(is)
				return is;
			return name in obj;
		}catch(e){
			return name in obj;
		}
	},
	isprototypename: function(obj, name){		//判断是否为原型连方法
		return !obj.hasOwnProperty(name) && name in obj;
	},
	isEmpty: function(obj){		//判断对象是否空
		var i = "";
		for(i in obj)
			break;
		return !i;
	},
	isDom: function(obj){
		return !!obj.nodeType;
	},
	log: function(obj, is){		//打印对象属性
		for(var i in obj){
			$.log('[ '+i+' : '+obj[i]+' ]', is)
		}
	}
};
$.Array = function(obj){
	if(obj.nodeType)
		return [obj];
	return $.Try(
		function(){
			return [].slice.call(obj,0);
		},
		function(){
			var arr = [], i = 0, j = obj.length;
			for(; i < j; ++i)
				arr[i] = obj[i];
			return arr;
		},
		function(){
			return [].concat(obj);
		}
	)
};
$.Index = function(obj, objs){ //不用while循环的原因是数组中也许存在 0,false, 这种值!!!逆遍历的原因是可以少一个变量
	obj = obj.somesayss ? obj[0] : obj;
	for(var i=objs.length-1; 0<=i; --i){
		if(obj === objs[i]) 
			return i;
	}
	return -1;
};
$.Each = function(obj, fn, is){ //不用while循环的原因是数组中也许存在 0,false, 这种值!!!为什么不逆着遍历 ? 由于Array的unique除重,如果逆着来返回的Array顺序会有偏差
	var i = 0, j = obj.length, z, temp;
	if(!is){
		for(; i < j; ++i)
			if(fn.call(obj[i], i, obj) === false)
				break;
	}else{
		for(z in obj)
			if(fn.call(obj[z], z, obj) === false)
				break;
	}
};
$.log = function(arg, is){
	if(!WIN.console || is){
		var DIV = DOC.createElement('div');
		DIV.style.cssText = 'background:#CCC;color:#F00;border-top:1px solid #FFF;';
		DIV.innerHTML = 'MES: '+arg;
		BODY.appendChild(DIV);
	}else{
		WIN.console.log(arg);
	}
};
$.mes = function(arg){
	WIN.console && WIN.console.log(arg);
};
$.Typeof = function(key){
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
$.Try = function(){
	for(var i=0,j=arguments.length;i<j;++i){
		try{
			return arguments[i]();
		}catch(e){}
	}
}
var globalEval = function(str){
	var WINDOW = WIN;
	str = '' + str
	return WINDOW.execScript ? WINDOW.execScript(str) : WINDOW.eval(str);
}
$.globalEval = globalEval;

/** 快捷方式 */
$.trim = function(str){
	return langMethod._string_.trim(str);
}
/******************************************************************************************************************* /core核心 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss缓存系统 v1.2.0	2013.4.10
 * 增加node的data-xxx的读取
 * @param {dom} node 对象节点
 * @param {string} name
 * @param {string} value
 * 未来需要的功能：给系统调用,做出api,方便调用;
 */
var data = function(node, name, value){
	return this instanceof data ? this.init(node, name, value) : new data(node, name, value);
}
data.prototype = {
	init: function(node, name, value){
		return this.set(node, name, value);
	},
	set: function(node, name, value){
		node = node === window ? data.win : node;	//处理window对象
		var key = data.key, id = node[key], catche = data.catche;
		//如果ID不存在就初始化ID
		id || (id = node[key] = ++data.uuid);
		//如果只有一个node就直接返回ID
		if(arguments.length === 1)
			return id;
		//分配空间
		catche[id] || (catche[id] = {});
		//设置值
		catche[id][name] = value;
		return this;
	},
	get: function(node, name){
		node = node === window ? data.win : node;
		var id = node[data.key], val;
		if(arguments.length === 1)
			return id;
		if(id)
			val = data.catche[id][name];
		return val !== undefined ? val : this.getNodeData(node, name);
	},
	getNodeData: function(node, name){
		var val;
		if(node.dataset){
			name = this.formatName(name);
			val = node.dataset[name];
		}else{
			name = this.formatName(name, 1);
			val = $.Selector.getAttr(node, 'data-'+name);
		}
		return val;
	},
	remove: function(node, name){
		node = node === window ? data.win : node;
		var id = node[data.key];
		if(!name)
			this.clear(node, id);
		else{
			delete data.catche[id][name];
			if($.Object.isEmpty(data.catche[id]))
				this.clear(node, id);
		}
		return this;
	},
	_set: function(){},
	_get: function(){},
	_remove: function(){},
	clear: function(node, id){
		var dataTemp = data, key = dataTemp.key, id = id || node[key], dataEvent, dataAnimate;
		node = node === window ? dataTemp.win : node;
		//代码防御:如果id不存在就返回
		if(!id)
			return this;
		//清除用户数据
		delete dataTemp.catche[id];
		//清除节点事件和数据
		dataEvent = dataTemp.catche.system.event;
		if(dataEvent[id]){
			//清除节点事件
			event.unbind(node);
			//清除系统[事件]数据
			delete dataEvent[id];
		}
		//对于动画的特殊处理, 如果动画还在运行的话就不清楚节点的KEY
		dataAnimate = dataTemp.catche.system.animate;
		if(dataAnimate[id])
			return this;
		//清除节点中的Key
		$.Try(function(){
			delete node[key];
		},function(){
			node.removeAttribute(key);
		},function(){
			node[key] = undefined;		//document 是没有 removeAttribute方法的
		});
		return this;
	},
	formatName: function(name, is){
		var rex = data.rex;
		if(!is){		// 转换成 'xxxYyy' 这种格式
			return name.replace(rex.value00, function(a,b){
				return b.toUpperCase();
			})
		}else{		// 转换成 'xxx-yyy' 这种格式
			return name.replace(rex.value01, function(a){
				return '-' + a.toLowerCase();
			})
		}
	}
};
$.Object.extend(data,{
	rex: {
		value00: /-(\w)/g,
		value01: /[A-Z]/g
	},
	win: {},										//如果节点是window的时候就使用这个
	catche: {										//缓存全局数据的地方
		system: {
			event: {},
			animate: {}
		}
	},										
	uuid: 0,										//ID
	key: 'somesayss'+new Date().getTime()			//唯一的key
})
'set get getNodeData remove clear formatName'.replace(/\w+/g,function(n){	//绑定静态方法
	data[n] = data.prototype[n];
});
$.data = data;	//全局引用
/******************************************************************************************************************* /缓存系统 v1.1.0 */
/**
 * @fileoverview json处理类
 * @param {string|json} arg 字符串或者json
 * @备注: 对象解析到字符串 [函数]和[undefined] 是不能被解析的 数组内的undifined和function会解析成null
 * @备注: 字符串解析到JOSN [函数]和[undefined]和[']号 是不能被解析的
 */
var json = function(arg){
	return this instanceof json ? this.init(arg) : new json(arg);
}
json.prototype = {
	init: function(arg){
		this.arg = arg;
		return this;
	},
	parse: function(arg){
		arg = arg === undefined ? this.arg : arg;
		try{
			return JSON.parse(arg);
		}catch(e){
			return this.parseFixed(arg);
		}
	},
	parseFixed: function(arg){
		arg = arg === undefined ? this.arg : arg;
		if(this.rex.test(arg))
			throw 'ajax parse error';
		return eval('('+arg+')');
	},
	stringify: function(arg){
		arg = arg === undefined ? this.arg : arg;
		try{
			return JSON.stringify(arg);
		}catch(e){
			return this.stringifyFixed(arg);
		}
	},
	stringifyFixed: function(arg){
		arg = arg === undefined ? this.arg : arg;
		var i, type, text;
		text = '{';
		for(i in arg){
			type = $.Typeof(arg[i]);
			if(type === 'Undefined' || type === 'Function')
				continue;
			text += '"';
			text += i;
			text += '":';
			switch(type){
				case 'String':
					text += '"';
					text += arg[i];
					text += '",';
					break;
				case 'Array':
					text += this.arrayToString(arg[i]);
					text += ',';
					break;
				case 'Object':
					text += this.stringifyFixed(arg[i]);
					text += ',';
					break;
				default:
					text += arg[i];
					text += ',';
			}
		}
		return text.slice(0, -1)+'}';
	},
	arrayToString: function(arr){
		var arrFn, i = 0, text, type;
		text = '['
		arrFn = arguments.callee; 
		for(; i < arr.length; ++i){
			type = $.Typeof(arr[i]);
			switch(type){
				case 'String': 
					text += '"';
					text += arr[i];
					text += '",';
					break;
				case 'Undefined': 
				case 'Function':
					text += 'null,';
					break;
				case 'Array':
					text += this.arrayToString(arr[i]);
					text += ',';
					break;
				case 'Object':
					text += this.stringifyFixed(arr[i]);
					text += ',';
					break;
				default:
					text += arr[i];
					text += ',';
			}
		}
		return text.slice(0, -1)+']';
	},
	rex: /function|undefined|'/
}
'parse stringify parseFixed stringifyFixed arrayToString rex'.replace(/\w+/g,function(n){
	json[n] = json.prototype[n]
})
$.json = json;
/*******************************************************************************************************************
 * @fileoverview somesayss语言类 v1.1.0	2013.5.18
 * @param {arg} string|number|array|function
 * 对原本基本类型的增强;
 */
var lang = function(arg){
	return this instanceof lang ? this.init(arg) : new lang(arg);
}
lang.prototype = {
	init:function(arg){
		//设置全局this;
		this._string_.self = this._number_.self = this._array_.self = this._function_.self = this._default_.self = this;
		return this.main(arg);
	},
	main: function(arg){
		//设置全局参数;
		this.arg = arg;
		//分配;
		switch($.Typeof(arg)){
			case 'String': return this._string_;
			case 'Number': return this._number_;
			case 'Array' : return this._array_;
			case 'Function': return this._function_;
			default: return this._default_;
		}
	},
	_string_: {
		valueOf: function(){
			return this.self.arg;
		}
	},
	_number_: {
		valueOf: function(){
			return this.self.arg;
		}
	},
	_array_: {
		valueOf: function(){
			return this.self.arg;
		}
	},
	_function_: {
		valueOf: function(){
			return this.self.arg;
		}
	},
	_default_: {
		valueOf: function(){
			return this.self.arg;
		}
	}
}
//方法
var langRex = {
	value00: /<script[^>]*>([\S\s]*?)<\/script>/img,			//获取script标签的内容;
	value01: /function (.*?)\(/, 								//获取函数名;
	value02: /\((.*?)\)/,										//获取函数参数名;
	value03: /\{([\S\s]*)\}/, 									//获取函数体
	value04: /[<>]/g
}
var langMethod = {
	_string_: {
		trim: function(str){
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		trimScripts: function(str){
			return str.replace(langRex.value00, '')
		},
		getScripts: function(str){
			var rex = langRex.value00;
			str = str.match(rex);
			str && $.Each(str,function(i,o){
				o[i] = this.replace(rex,function(a,b){
				return b;
				})
			});
			return str;
		},
		evalScript: function(str){
			globalEval(""+str);
	 		return str;
		},
		shtml: function(str){
			return str.replace(langRex.value04, function(a){
				if(a === '<'){
					return '&lt;';
				}else if(a === '>'){
					return '&gt;';
				}
			})
		}
	},
	_number_: {
		color: function(num){
			var val = num.toString(16);
			if(num < 16)
				val =  "0" + val;
			return val;
		}
	},
	_array_: {
		evalScript: function(arr){
			$.Each(arr, function(){
				globalEval(""+this);
			});
	 		return arr;
		},
		clear: function(arr){				//改变原数组;返回新数组;
			arr.length = 0;
			return arr;
		},
		index: function(arr, tar){			//不改变原数组;返回值;
			return $.Index(tar,arr);
		},
		except: function(arr, arg){			//改变原数组;返回新数组;
			if($.Typeof(arg) === "Number"){
				arr.splice(arg,1);
				return arr;
			}else{
				var i = $.Index(arg,arr);
				if(i === -1) 
					return arr;
				arr.splice(i,1);
				return arr;
			}
		},
		each: function(arr, fn){			//不改变原数组;返回原数组;
			for(var i=0, j=arr.length; i<j; ++i)
				fn.call(arr[i],i,arr);
			return arr;
		},
		inArray: function(arr, tar){		//不改变原数组;返回布尔值;
			for(var i=arr.length-1, j=0; j<=i; --i)
				if(arr[i] === tar)
					return true;
			return false;
		},
		filter: function(arr, fn){			//不改变原数组;返回新数组;
			var newarr = [];
			$.Each(arr, function(i, o){
				if (fn.call(o[i], i, o))
					newarr.push(o[i]); 
			});
			return newarr;
		},
		unique:function(arr){				//不改变原数组;返回新数组;
			var value = [];
			var hash = {};
			$.Each(arr,function(i,o){
				var type = $.Typeof(o[i])+o[i];
				if(!hash[type]){
					hash[type] = 1;
					value[value.length] = o[i];
				}
			});
			return value;
		},
		clone: function(arr){				//不改变原数组;返回新数组;
			return arr.slice(0);
		},
		concat: function(arr, arg){			//不改变原数组;返回新数组;
			return arr.concat(arg);
		},
		join: function(arr, arg){			//不改变原数组;返回字符串;
			return arr.join(arg);
		},
		pop: function(arr){					//改变原数组;返回新数组;
			arr.pop();
			return arr;
		},
		push: function(arr, arg){			//改变原数组;返回新数组;
			arr[arr.length] = arg;
			return arr;
		},
		shift: function(arr){				//改变原数组;返回新数组;
			arr.shift();
			return arr;
		},
		unshift: function(arr, arg){		//改变原数组;返回新数组;
			arr.unshift(arg);
			return arr;
		},
		slice:function(){					//不改变原数组;返回新数组;
			var arg = $.Array(arguments), arr = arg.shift();
			return [].slice.apply(arr, arg);
		},
		splice:function(){					//改变原数组;返回新数组;
			var arg = $.Array(arguments), arr = arg.shift();
			[].splice.apply(arr, arg);
			return arr;
		},
		reverse:function(arr){				//改变原数组;返回新数组;
			return arr.reverse();
		},
		sort:function(arr, arg){			//改变原数组;返回新数组;
			return arr.sort(arg);
		}
	},
	_function_: {
		name: function(fn){
			return fn.toString().match(langRex.value01)[1];
		},
		argumentsName: function(fn){
			return fn.toString().match(langRex.value02)[1].split(",");
		},
		body: function(fn){
			return fn.toString().match(langRex.value03)[1];
		},
		bind: function(){
			var setArray = $.Array, args = setArray(arguments), fn = args.shift(), obj = args.shift();
			return function(){
				return fn.apply(obj,args.concat(setArray(arguments)));
			};
		}
	}
}
//继承
$.Each(langMethod, function(i){
	$.Each(langMethod[i], function(j, k){
		lang.prototype[i][j] = function(){
			var self = this.self, val;
			val = k[j].apply( null, [self.arg].concat( [].slice.call(arguments) ) );
			return $.Typeof(val) === 'Function' ? val : lang(val);
		}
	}, true);
}, true);
$.lang = lang;
/******************************************************************************************************************* /lang */
/*----window----*/
$.win = {
	outerHeight:function(){
		return WIN.innerHeight || HTML.offsetHeight;
	},
	outerWidth:function(){
		return WIN.innerWidth || HTML.offsetWidth;
	},
	innerHeight:function(){
		return HTML.clientHeight;
	},
	innerWidth:function(){
		return HTML.clientWidth;
	},
	bodyHeight:function(){
		return BODY.offsetHeight;
	},
	bodyWidth:function(){
		return HTML.clientWidth;
	},
	scrollHeight:function(){
		return HTML.scrollHeight;
	},
	scrollWidth:function(){
		return HTML.scrollWidth;
	},
	scrollTop:function(num){
		if(num !== undefined){
			HTML.scrollTop = num;
			BODY.scrollTop = num;
			return;
		}
		return HTML.scrollTop || BODY.scrollTop;
	},
	scrollLeft:function(num){
		if(num !== undefined){
			HTML.scrollLeft = num;
			BODY.scrollLeft = num;
			return;
		}
		return HTML.scrollLeft || BODY.scrollLeft;
	},
	onload:function(fun){
		if($.Typeof(fun) !== "Function") return;
	    if(!!WIN.onload){
        	var oldfun = WIN.onload;
        	WIN.onload = function(){
        		WIN.onload = null;
            	oldfun();
            	fun();
            }
        }else{
       		WIN.onload = function(){
       			WIN.onload = null;
       			fun();
       		};
        }
	}
}
/*----Dom----*/
$.doc = {
	_readyarr:[],
	ready:function(fun){
		if($.Typeof(fun) !== "Function") return;
		var _this = this,_arr = _this._readyarr;
		if(_arr.push(fun) > 1) return;
		if(!$.Browser.IE8){
			$(DOC).bind("DOMContentLoaded",function(){
				$(DOC).unbind("DOMContentLoaded");
				for(var i=0,j=_arr.length;i<j;++i) _arr[i]();
				$.Use(_arr).clear();
			});
		}else{
			var img = new Image,_isread = false;
			$(DOC).bind("readystatechange",function(){
				if(DOC.readyState === "complete"){
					$(DOC).unbind("readystatechange");
					if(_isread) return;
					for(var i=0,j=_arr.length;i<j;++i) _arr[i]();
					_isread = true;
					$.Use(_arr).clear();
				}
			})
			~function(){
				try{
					img.doScroll();
					if(_isread) return;
					for(var i=0,j=_arr.length;i<j;++i) _arr[i]();
					_isread = true;
					$.Use(_arr).clear();
				}catch(e){
					setTimeout(arguments.callee,0);
				}
			}()
		}
	},
	contains:function(fa,ch){		//判断两个元素的子父关系
		if(fa === ch) 
			return true;
		if(fa.contains) 
			return fa.nodeType === 9 ? true : fa.contains(ch);
		if(fa.compareDocumentPosition) 
			return !!(fa.compareDocumentPosition(ch) & 16);
		while(ch = ch.parentNode) 
			if(ch === fa) 
				return true;
		return false;
	}
}
/*******************************************************************************************************************
 * @fileoverview somesayss选择器 v1.1.0 
 * @depend *core* 依赖核心
 * @param {string} str '#main li>a','div[title=hello]' 属性选择的时候可以用5种匹配
 * @param {dom} node 元素节点
 * @param {boolean} is 可以用1,0代替
 * @return {array} 返回一个数组
 */
var Selector = function(str, node, is){
		return this instanceof Selector ? this.init(str, node, is) : new Selector(str, node, is);
	}
Selector.prototype = {
	init:function(str, node, is){
		return DOC.querySelectorAll ? this.query(str, node, is) : this.fixed(str, node, is);
	},
	rex:{
		value01:/[^\s>]+/,							//获取字符串第一个空格之前的字符;
		value02:/([#.])?(.+)/,						//判断字符串是#,.,字符组成的;
		value03:/\[(.*[^~*^$])([~*^$]?)=(.+)\]/,	//匹配属性用的;	匹配[xxx=xxx]
		value04:/([\s>])([^\s>]+)/g, 				//匹配' xxx|>xxx'这种，判断是find还是children
		value05:/[^[]+/								//获取节点名;
	},
	query:function(str, node, is){
		if (!node || node.nodeType === 9){
			node = node || DOC;
			return $.Array(node.querySelectorAll(str));
		}else {
			var tempStr  = '';
			var tempNode = node;
			while(tempNode.nodeName !== 'BODY'){
				tempStr  = tempNode.nodeName +' '+tempStr;
				tempNode = tempNode.parentNode;
			}
			return $.Array(node.querySelectorAll(tempStr +(!is ? ' ' : '>')+ str));
		}
	},
	fixed:function(str, node, is){
		if (!node)
			node = DOC;
		var REX = Selector.rex;
		str  = (!is ? ' ' : '>')+str;
		node = [node];
		str.replace(REX.value04,function(a,b,c,d){
			switch(b){
				case ' ': is = false;break; 
				case '>': is = true ;break;
			}
			var STR = c.match(REX.value02), i = 0, temp, arr = [], arrNode;
			while(temp = node[i++]){
				switch(STR[1]){
					case '#': 
						arrNode = Selector.selectById(STR[2], [temp]);
						break;
					case '.':
						arrNode = Selector.selectByClassName(STR[2], Selector.getNodes('*', temp, is));
						break;
					default :  
						arrNode = Selector.selectByAttr(STR[2], Selector.getNodes(STR[2].match(REX.value05)[0], temp, is));
				}
				arr = arr.concat(arrNode);
			}
			node = arr;
		})
		return node;
	},
	selectById:function(str, nodes){					//通过ID查询
		var value = (nodes[0].nodeType === 9 ? nodes[0] : nodes[0].ownerDocument).getElementById(str);
		return value ? value : [];
	},
	selectByClassName:function(str, nodes){		//通过class查询
		var temp, arr = [], i = 0, rexClassName = new RegExp("\\b"+str+"\\b");
		while(temp = nodes[i++]){
			if(rexClassName.test(temp.className))
				arr[arr.length] = temp
		}
		return arr;
	},
	selectByAttr:function(str, nodes){			//通过属性查找
		var REX = Selector.rex, STR = str.match(REX.value03);
		if (!STR)
			return $.Array(nodes);
		var ATTR_name  = STR[1], 		//得到节点属性
			ATTR_term  = STR[2], 		//得到匹配方法
			ATTR_value = STR[3], 		//得到节点属性值
			i 		   = 0, 
			ARR 	   = [], 
			TEMP, 
			REX;

		switch(ATTR_term){
			case '' : REX = new RegExp('^'+ATTR_value+'$'); break;		//匹配开头到结尾
			case '~': REX = new RegExp('\\b'+ATTR_value+'\\b'); break;	//匹配单词
			case '*': REX = new RegExp(ATTR_value); break;				//只要有单词出现
			case '^': REX = new RegExp('^'+ATTR_value); break;			//匹配开头
			case '$': REX = new RegExp(ATTR_value+'$'); break;			//匹配结尾
		}
		while(TEMP = nodes[i++]){
			var ATTR = Selector.getAttr(TEMP, ATTR_name);
			if(REX.test(ATTR)) 
				ARR[ARR.length] = TEMP;
		}
		return ARR;
	},
	getNodes:function(str, node, is){
		if (!is)
			return node.getElementsByTagName(str);
		else{
			var nodes = node.childNodes, i = 0, temp, rex, arr = [];
			if (str === '*')
				rex = /.+/;
			else
				rex = new RegExp('^'+str+'$','i');
			while(temp = nodes[i++]){
				if (temp.nodeType === 1 && rex.test(temp.nodeName))
					arr[arr.length] = temp;
			}
			return arr;
		}
	},
	getAttr:function(node, name){		//为了得到class的兼容方法
		var value = node.getAttribute(name);
		if (value)
			return value;
		value = node.getAttributeNode(name);
		return value ? value.nodeValue : null;
	}
};
'query fixed rex selectById selectByClassName selectByAttr getAttr getNodes'.replace(/\w+/g,function(n){		//绑定静态方法
	Selector[n] = Selector.prototype[n];
});
$.Selector = Selector;	//全局引用
/******************************************************************************************************************* /somesayss选择器 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss事件系统 v1.1.0	2013.4.10
 * @param {dom} node 对象节点
 * @param {string} en
 * @param {function} fn
 */
var event = function(node, en, fn){
	return this instanceof event ? this.init(node, en, fn) : new event(node, en, fn);
}
event.prototype = {
	init: function(node, en, fn){
		this.bind(node, en, fn);
	},
	_add: function(node, en, fn){
		node.addEventListener ? node.addEventListener(en, fn, false) : node.attachEvent("on" + en, fn);
	},
	_remove: function(node, en, fn){
		node.removeEventListener ? node.removeEventListener(en, fn, false) : node.detachEvent("on" + en, fn);
	},
	isToUseHandleEvent: function(node, en){
		var hasname = $.Object.hasname;
		//判断条件是当节点有这个事件的时候就去普通绑定；如果没有的话再去找代理事件，如果找到就去代理绑定;
		return !hasname(node, 'on'+en) && hasname(this.handleEvent, en);
	},
	isCopyCutPaste: function(en){
		return (en === 'copy' || en === 'cut' || en === 'paste') && $.Browser.IE8;
	},
	isChange: function(en){
		return en === 'change' && $.Browser.IE8;
	},
	bind: function(node, en, fn){
		var self = this, Data = data, eventData = Data.catche.system.event, id = Data.set(node);
		//分配ID空间
		eventData[id] || (eventData[id] = {});
		//分配事件空间
		eventData[id][en] || (eventData[id][en] = {});
		//初始化arrFn
		eventData[id][en]['arrFn'] || (eventData[id][en]['arrFn'] = []);
		//开始堆fn,并且当计数大于1的时候直接返回
		if(eventData[id][en]['arrFn'].push(fn) > 1)
			return this;
		//初始化代理函数
		var handle = function(e){
			var E = eventObject(e, node, en), returnValue = [];
			$.Each(eventData[id][en]['arrFn'], function(){
				returnValue[returnValue.length] = this.call(node, E);
			});
			//让return false 正确执行e.preventDefault();
			if($.Index(false, returnValue) !== -1)
				E.preventDefault();
		}
		//如果节点无这个事件就去代理事件那边或者是IE678中的copy,cut,paste事件
		if(self.isToUseHandleEvent(node, en) || self.isCopyCutPaste(en) || self.isChange(en)){
			eventFixed(node, en, handle);
			return this;
		}
		eventData[id][en]['handle'] = handle;
		//注册代理函数
		self._add(node, en, handle);
		return this;
	},
	unbind: function(node, en, fn){
		var self = this, Data = data, id = Data.get(node), eventData;
		//代码防御:如果ID不存,或者eventData不存在就返回
		if(!id || !(eventData = Data.catche.system.event[id]))
			return this;
		//代码防御:如果en存在的话判断eventData[en]是否存在
		if(en && !eventData[en])
			return this;
		//事件反注册以及数据的清理
		var enevtRemove = function(node, eventData, en){
			//反绑定IE678中的copy,cut,paste事件
			if(self.isCopyCutPaste(en) && node.nodeType === 9){
				self.unbindDelegates('html', node, en);
			}
			//反绑定IE678中的change事件
			if(self.isChange(en) && !/INPUT|SELECT|TEXTAREA/.test(node.nodeName)){
				self.unbindDelegates('input select textarea', node, en);
			}
			//如果不存在则删除代理事件,事件反注册
			if(self.isToUseHandleEvent(node, en)){
				self._remove(node, self.handleEvent[en], eventData[en]['handle']);
				//如果en为focusin或者focusout并且node不是input,select,textarea;
				if((en === 'focusin' || en === 'focusin') && !/INPUT|SELECT|TEXTAREA/.test(node.nodeName)){
					self.unbindDelegates('input select textarea', node, en);
				}
				//IE678下的input
				if(en === 'input' && !/INPUT|TEXTAREA/.test(node.nodeName)){
					self.unbindDelegates('input textarea', node, en);
				}
			}else{
				self._remove(node, en, eventData[en]['handle']);
			}

			//把en对应的对象销毁
			delete eventData[en];
		}
		//当存在node, en的情况
		if(arguments.length === 2){
			enevtRemove(node, eventData, en);
		}
		//当只存在node的情况
		else if(arguments.length === 1){
			for(var i in eventData){
				enevtRemove(node, eventData, i);
			}
		}
		//当存在node, en, fn的情况
		else if(arguments.length === 3){
			var arr = eventData[en]['arrFn'];
			//在arr中排出fn;
			self._except(arr, fn);
			//如果arr中已经无数据的，清除数据！
			if(arr.length === 0)
				enevtRemove(node, eventData, en);
		}
		//如果此eventData 为空了，删除此节点的数据
		if($.Object.isEmpty(eventData))
			delete Data.catche.system.event[id];
		return this;
	},
	unbindDelegates: function(str, node, en){	//对于focusin,focusout特别处理函数
		var self = this;
		var needNodes = [];
		str.replace(/\w+/g, function(a){
			needNodes = needNodes.concat(Selector(a, node));
		});
		if(needNodes.length){
			$.Each(needNodes, function(){
				var id = data.get(this), eventData = data.catche.system.event[id];
				//如果eventData中的arrFn有值就不去unbind
				if(eventData[en]['arrFn'])
					return;
				//反绑定事件,删除内存；
				self._remove(this, self.handleEvent[en], eventData[en]['handle']);
				delete eventData[en];
				//如果此eventData 为空了，删除此节点的数据
				if($.Object.isEmpty(eventData))
					delete data.catche.system.event[id];
			})
		}
		return this;
		
	},
	_except: function(arr,arg){
		var i = $.Index(arg,arr);
		if(i === -1)
			return arr;
		arr.splice(i,1);
		return arr;
	},
	handleEvent: {
		'focusin': 'focus',
		'focusout': 'blur',
		'mouseenter': 'mouseover',
		'mouseleave': 'mouseout',
		'mousewheel': 'DOMMouseScroll',
		'input': 'propertychange'
	}
}
'_add _remove _addUp _removeUp bind unbind _except handleEvent isToUseHandleEvent isCopyCutPaste unbindDelegates isChange'.replace(/\w+/g,function(n){
	event[n] = event.prototype[n]
})  
/**
 * @fileoverview somesayss事件对象 v1.1.0	2013.4.19
 * 对事件系统的支持
 * @param {object} e 事件对象
 */
var eventObject = function(e, node, en){
	return this instanceof eventObject ? this.init(e, node, en) : new eventObject(e, node, en);
}
eventObject.prototype = {
	init: function(e, node, en){
		this.e = e || window.event;
		this.node = node;
		this.type = en;
		//监听源
		this.currentTarget = e.currentTarget || node;
		//监听目标
		this.target = e.target || e.srcElement;
		//屏幕的鼠标位置
		this.clientX = e.clientX;
		this.clientY = e.clientY;
		//页面的鼠标位置
		this.pointerX = e.pageX || (e.clientX +(HTML.scrollLeft || BODY.scrollLeft));
	  	this.pointerY = e.pageY || (e.clientY +(HTML.scrollTop || BODY.scrollTop));
	  	this.relatedTarget = e.relatedTarget || (e.fromElement === this.target ? e.toElement : e.fromElement);
	  	this.wheelDelta = (e.wheelDelta || -e.detail) < 0 ? true : false;
	  	//鼠标按键
	  	this.button = (function(e){
	  		if(!$.Browser.IE8)
	  			return e.button;
	  		switch(e.button){
	  			case 1:
	  				return 0;
	  			case 4:
	  				return 1;
	  			case 2:
	  				return 2;
	  			default:
	  				return e.button;
	  		}
	  	})(e);
	  	//键盘
	  	this.keyCode = e.keyCode;
	  	this.ctrlKey = e.ctrlKey;
	  	this.shiftKey = e.shiftKey;
	  	this.altKey = e.altKey;
	  	this.meta = e.meta;
	},
	stopPropagation: function(){
		var E = this.e, eventData = data.catche.system.event, id = data.set(this.node);;
		E.stopPropagation ? E.stopPropagation() : E.cancelBubble = true;
		//代码防御
		if(!id)
			return this;
		eventData[id][this.type]['stopPropagation'] = 1;
	},
	preventDefault: function(){
		var E = this.e;
		E.preventDefault ? E.preventDefault() : E.returnValue = false;
	},
	stop: function(){
		this.stopPropagation();
		this.preventDefault();
	}
}
/**
 * @fileoverview somesayss事件的补丁 v1.1.0	2013.4.19
 * 做事件的兼容处理
 * @param {object} e 事件对象
 */
var eventFixed = function(node, en, handle){
	return this instanceof eventFixed ? this.init(node, en, handle) : new eventFixed(node, en, handle);
}
eventFixed.prototype = {
	init: function(node, en, handle){
		this.bind(node, en, handle);
	},
	bind: function(node, en, handle){
		var self = this, handleEvent = event.handleEvent[en] || en, eventData = data.catche.system.event, id = data.get(node), newHandle;
		switch(en){
			case 'focusin':
			case 'focusout': 
			case 'change':
				newHandle = function(e){
					self.propagation(node, en, e, eventData);
				};
				//如果node不是input,select,textarea,则在此节点的内部的所有表单域监听
				if(!/INPUT|SELECT|TEXTAREA/.test(node.nodeName)){
					self.eventDelegates('input select textarea', node, en, eventData);
				}
				break;
			case 'mouseenter':
			case 'mouseleave': 
				newHandle = function(e){
					self.MouseEnterLeave(node, en, e, eventData);
				};
				break;
			case 'mousewheel':
				newHandle = handle;
				break;
			case 'copy':
			case 'cut':
			case 'paste':
				newHandle = handle;
				if(node.nodeType === 9){
					self.eventDelegates('html', node, en, eventData);
				}
				break;
			case 'input':
				newHandle = function(e){
					if(e.propertyName === 'value')
						handle(e);
				};
				if(!/INPUT|TEXTAREA/.test(node.nodeName)){
					self.eventDelegates('input textarea', node, en, eventData);
				}
				break;
		}
		//代码防御:保证事件只绑定一次!
		if(!eventData[id][en]['handle']){
			//绑定代理事件
			eventData[id][en]['handle'] = newHandle;
			event._add(node, handleEvent, newHandle);
		}
		return this;
	},
	propagation: function(node, en, e, eventData){
		var self = this, id, stop;
		do{
			id = data.get(node);
			//如果ID不存在就直接去下一次循环
			if(!id || !eventData[id])
				continue;
			//如果stop存在直接跳出
			if(stop)
				break;
			//在这里创建事件对象；node改变啦
			var E = eventObject(e, node, en);
			var arrFn = eventData[id][en]['arrFn'];

			if(!arrFn)
				continue;
			$.Each(arrFn, function(){
				this.call(node, E);
			});
			stop = eventData[id][en]['stopPropagation'];
		}while(node = node.parentNode);
		return this;
	},
	MouseEnterLeave: function(node, en, e, eventData){
		var id = data.get(node), E = eventObject(e, node, en), rel = E.relatedTarget;
		E.stopPropagation();
		if($.doc.contains(node,rel))
			return this;
		$.Each(eventData[id][en]['arrFn'],function(){
			this.call(node,E);
		})
		return this;
	},
	eventDelegates: function(str, node, en, eventData){
		var needNodes = [], self = this, handleEvent = event.handleEvent[en] || en;
		str.replace(/\w+/g, function(a){
			needNodes = needNodes.concat(Selector(a, node));
		});
		if(needNodes.length){
			$.Each(needNodes, function(){
				var tempNode = this, tempId = data.set(tempNode);
				eventData[tempId] || (eventData[tempId] = {});
				eventData[tempId][en] || (eventData[tempId][en] = {});
				//代码防御:保证事件只绑定一次!
				var oldHandle = eventData[tempId][en]['handle'];
				oldHandle && event._remove(tempNode, handleEvent, oldHandle);
				var newHandle = function(e){
					self.propagation(tempNode, en, e, eventData);
				};
				//绑定代理事件
				eventData[tempId][en]['handle'] = newHandle;
				event._add(tempNode, handleEvent, newHandle);
				
			})
		}
		return this;
	}
}
$.event = event;	//全局引用
/******************************************************************************************************************* /事件系统 v1.0.0 /
/*******************************************************************************************************************
 * @fileoverview somesayss DOM方法 v1.1.0 
 * @param {array} eles 这里的eles传入的都是一个数组;
 */
$.Method = {
	/**
	 * dom操作之遍历
     */
    find:function(eles, str){				//Modify 2013,4,9
    	var newarr = [], selectorTemp = Selector;
    	$.Each(eles,function(){
    		var _temp = selectorTemp(str,this);
    		newarr = newarr.concat(_temp);
    	})
    	return newarr;
    },
    children:function(eles,str){			//Modify 2013,4,9
    	var newarr = [], selectorTemp = Selector;
    	$.Each(eles,function(){
    		var _temp = selectorTemp(str,this,1);
    		newarr = newarr.concat(_temp);
    	})
    	return newarr;
    },
    unique: function(eles){					//Modify 2013,4,9 去掉重复的元素 
    	var val = [], hash = {}, dataTemp = data;
    	$.Each(eles,function(){
    		var id = dataTemp.set(this);
    		if(!hash[id]){
    			hash[id] = 1;
    			val[val.length] = this;
    		}
    	});
    	return val;
    },
    select: function(eles, str){			//Modify 2013,4,9 对一个元素的数组进行筛选 @依赖 *Selector*
    	var SEL = Selector, STR = str.match(SEL.rex.value02);
    	switch(STR[1]){
    		case '#': return SEL.selectById(STR[2], eles);
			case '.': return SEL.selectByClassName(STR[2], eles);
			default : return SEL.selectByAttr(STR[2], eles);
    	}
    },
    _findnode: function(eles, first, type){	//Modify 2013,4,9
    	var arr = [], node;
    	$.Each(eles, function(){
    		node = this[first];
    		do{
    			if(node.nodeType === 1){
    				arr[arr.length] = node;
    				break;
    			}
    		}
    		while(node = node[type]);
    	});
    	return arr;
    },
    _findnodes:function(eles,type){			//Modify 2013,4,9
    	var arr = [], node;
    	$.Each(eles, function(){
    		node = thisNode =  this;
    		type.replace(/\w+/g, function(a){
    			while(node = node[a]){
		    		if(node.nodeType === 1)
		    			arr[arr.length] = node;
		    	}
		    	node = thisNode;
    		})
    	});
    	arr = $.Method.unique(arr);
    	return arr;
    },
    prev: function(eles){					//Modify 2013,4,9
    	return $.Method._findnode(eles, 'previousSibling', 'previousSibling');
    },
    next: function(eles){					//Modify 2013,4,9
    	return $.Method._findnode(eles, 'nextSibling', 'nextSibling');
    },
    first: function(eles){					//Modify 2013,4,9
    	return $.Method._findnode(eles, 'firstChild', 'nextSibling');
    },
    last: function(eles){					//Modify 2013,4,9
    	return $.Method._findnode(eles, 'lastChild', 'previousSibling');
    },
    parent: function(eles){					//Modify 2013,4,9
    	return $.Method._findnode(eles, 'parentNode');
    },
    prevAll: function(eles, str){			//Modify 2013,4,9
    	var arr = $.Method._findnodes(eles, "previousSibling");
    	return str ? $.Method.select(arr, str) : arr;
    },
    nextAll: function(eles, str){			//Modify 2013,4,9
    	var arr = $.Method._findnodes(eles, "nextSibling");
    	return str ? $.Method.select(arr, str) : arr;
    },
    siblings: function(eles, str){			//Modify 2013,4,9
    	var arr = $.Method._findnodes(eles, "previousSibling nextSibling");
    	return str ? $.Method.select(arr, str) : arr;
    },
	eq: function(eles,num){					//Modify 2013,4,9
		return [eles[num ? num : 0]];
	},
	each: function(eles, fn){				//Modify 2013,4,9
		for(var i=0, j=eles.length; i<j; ++i)
			fn.call(eles[i], i, eles);
		return eles;
	},
	index: function(eles,node){				//Modify 2013,4,9
		return $.Index(node,eles);
	},
	filter: function(eles,fun){				//Modify 2013,4,9
		var arr = [];
		$.Each(eles, function(i, o){
			if(fun.call(this, i, o)) 
				arr[arr.length] = this;
		})
		return arr;
	},
	slice: function(){						//Modify 2013,4,9
		var arr = $.Array(arguments), eles = arr.shift();
		return [].slice.apply(eles,arr);
	},
    /** /dom操作之遍历 */
    /**
	 * dom操作之文档操作
     */
    clearNode: function(node, is){			//Modify 2013,4,9 
    	var dataTemp = data;
    	if(is)
    		dataTemp.clear(node);
    	$.Each(Selector('*', node), function(){
    		dataTemp.clear(this);
    	})
    },
    remove: function(eles){					//Modify 2013,4,9 
    	var clearNode = $.Method.clearNode, DIV = $.Method.DIV;
    	$.Each(eles,function(){
    		clearNode(this, 1);
    		DIV.appendChild(this);
    		DIV.innerHTML = '';
    	});
    	/*$.Each(eles,function(){
    		clearNode(this, 1);
    		this.parentNode.removeChild(this);
    	});*/
    	return eles;
    },
    empty: function(ele){					//Modify 2013,4,9 
    	return $(ele).html('');
    },
    DIV: DOC.createElement("div"),
    tempnode: function(arg){				//Modify 2013,5,10 内部方法	
    	var node = DOC.createDocumentFragment(), arrScript, DIV = this.DIV;
    	if($.Typeof(arg) === "String"){
    		//对有script标签处理
    		arrScript = lang(arg).getScripts().valueOf();
	    	DIV.innerHTML = arg;
	    	while(DIV.firstChild){
	    		node.appendChild(DIV.firstChild);
	    	}
	    	node = $.Array(node);
    	}else if($.Typeof(arg) === "Object"){
    		node = $.Array(arg);
    	}
    	return {
    		node: node,
    		arrScript: arrScript
    	};
    },
    docActions: function(eles, arg, type, target, curr){	//Modify 2013,5,10 内部方法
    	var Method = $.Method, tempOb = Method.tempnode(arg), tempScript = tempOb.arrScript, temp = tempOb.node, frag = DOC.createDocumentFragment();
    	$.Each(eles, function(i){
    		if(i === 0){
    			//如果是节点碎片的话 appendChild 了之后，节点碎片内就空了;
	    		$.Each((temp[0].nodeType === 1 ? temp : Method.clone(temp)), function(){
	    			frag.appendChild(this);
	    		});
	    		(target ? this : this.parentNode)[type](frag, (curr ? this[curr] : this));
	    		return;
    		}
    		$.Each(Method.clone(temp), function(){
    			frag.appendChild(this);
    		});
    		(target ? this : this.parentNode)[type](frag, (curr ? this[curr] : this));
    	});
    	//执行脚本
    	tempScript && $.Each(tempScript, function(){
    		globalEval(this);
    	})
    },
    append: function(eles, arg){			//Modify 2013,5,10 
    	$.Method.docActions(eles, arg, 'appendChild', 1, 0);
    	return eles;
    },
    prepend:function(eles, arg){			//Modify 2013,5,10 
    	$.Method.docActions(eles, arg, 'insertBefore', 1, 'firstChild');
    	return eles;
    },
    after:function(eles, arg){				//Modify 2013,5,10 
    	$.Method.docActions(eles, arg, 'insertBefore', 0, 'nextSibling');
    	return eles;
    },
    before:function(eles, arg){				//Modify 2013,5,10 
    	$.Method.docActions(eles, arg, 'insertBefore', 0, 0);
    	return eles;
    },
    replaceWith:function(eles, arg){		//Modify 2013,5,10
    	var clearNode = $.Method.clearNode;
    	$.Each(eles,function(){
    		clearNode(this, 1);  
    	});
    	$.Method.docActions(eles, arg, 'replaceChild', 0, 0);
    	return eles;
    },
    clone:function(eles, is){				//Modify 2013,5,10 
    	//cleardata -> ele
    	var arr = [], cloneFn, cloneId;
    	cloneFn = function(node, is){
    		var clone = node.cloneNode(!is), curr = Selector('*', node), targ;
    		cloneId(node, clone);
    		if(curr.length){
    			targ = Selector.fixed('*', clone);
    			$.Each(targ, function(i){
    				cloneId(curr[i], targ[i]);
    			})
    		}
    		return clone;
    	}
    	cloneId = function(node, clone){
    		//存数据
    		var id = data.get(node), cloneData, currEventData, cloneEventData, key = data.key;
    		if(id){
    			cloneData = data.catche[id];
    			currEventData = data.catche.system.event[id];
    			cloneEventData = $.Object.clone(currEventData);
    		}
    		//清除数据 IE下的BUG 会克隆 事件和自定义特性;
    		if(currEventData){
    			for(var j in currEventData){
	    			event._remove(clone, j, currEventData[j].handle);
	    		}
    		}
    		$.Try(function(){
				delete clone[key];
			},function(){
				clone.removeAttribute(key);
			},function(){
				clone[key] = undefined;		//document 是没有 removeAttribute方法的
			});
    		//数据的再写入
    		if(id){
    			var newID = data.set(clone), targEventData;
    			cloneData && (data.catche[newID] = cloneData);
    			if(cloneEventData){
    				targEventData = data.catche.system.event[newID] = cloneEventData;
    				for(var i in targEventData){
    					event._add(clone, i, targEventData[i].handle); 
    				}
    			}
    		}
    		return clone;
    	}
    	if(eles[0].nodeType === 1){
    		$.Each(eles, function(){
	    		arr[arr.length] = cloneFn(this, is);
	    	})
    	}else{
    		$.Each(eles, function(){
	    		arr[arr.length] = this.cloneNode(!is);
	    	})
    	}
    	return arr;
    },
    text:function(eles, str){				//Modify 2013,5,9
    	var innerText = ("textContent" in eles[0]) ? "textContent" : "innerText", clearNode = $.Method.clearNode;
    	if($.Typeof(str) !== 'String') 
    		return eles[0][innerText];
    	$.Each(eles, function(){
        	clearNode(this);
        	this[innerText] = ""+str;
        });
        return eles;
    },
    html: function(eles, str){				//Modify 2013,5,9	
    	var clearNode = $.Method.clearNode, arrScript;
    	if(str === undefined)
    		return eles[0].innerHTML;
    	str = ''+str;
        $.Each(eles, function(){
        	clearNode(this);
        	this.innerHTML = str;
        });
        //如果有啥script标签的处理
    	arrScript = lang(str).getScripts();
    	arrScript.valueOf() && arrScript.evalScript();
        return eles;
    },
    /** /dom操作之文档操作 */
    /**
	 * Dom的快捷操作  -data -event
     */
    data: function(eles, name, value){		//Modify 2013,5,8		!!!
    	var dataTemp = data;
    	switch(arguments.length){
    		case 1: return dataTemp['set'](eles[0]);
    		case 2: return dataTemp['get'](eles[0], name);
    		default:
    			$.Each(eles, function(){
	    			dataTemp.set(this, name, value);
	    		});
	    		return eles;
    	}
    },
    removeData: function(eles, nane){		//Modify 2013,5,8
    	var dataTemp = data;
    	$.Each(eles, function(){
    		dataTemp.remove(this, nane);
    	})
    	return eles;
    },
    clear: function(eles){					//Modify 2013,5,8
    	var dataTemp = data;
    	$.Each(eles, function(){
    		dataTemp.clear(this);
    	})
    	return eles;
    },
	on: function(eles, en, fn){				//Modify 2013,5,8
		var eventTemp = event;
		$.Each(eles,function(){
			eventTemp(this, en, fn);
		});
		return eles;
	},
	off: function(eles, en, fn){				//Modify 2013,5,8
		var eventTemp = event;
		if(arguments.length === 2){
			$.Each(eles, function(){
				eventTemp.unbind(this, en);
			});
		}else if(arguments.length === 1){
			$.Each(eles, function(){
				eventTemp.unbind(this);
			});
		}else{
			$.Each(eles, function(){
				eventTemp.unbind(this, en, fn);
			});
		}
		return eles;
	},
	bind: function(eles, en, fn){			//Modify 2013,5,8
		return $.Method.on(eles, en, fn);
	},
	unbind: function(eles, en, fn){			//Modify 2013,5,8
		return $.Method.off(eles, en, fn);
	},
	/** /Dom的快捷操作 */
	/**
	 * Dom的快捷效果操作 -css -animate -attr
     */
	animate:function(eles, opat, time, easing, callback, onbegin){		//Modify 2013,5,16
		var animateTemp = animate;
		if($.Typeof(easing) === 'Function'){	//为了在写法上的便利,可以省略easing
			onbegin = callback;
			callback = easing;
			easing = undefined;
		}
		$.Each(eles, function(){
			animateTemp(this, opat, time, easing, callback, onbegin);
		});
		return eles;
	},
	isAnimate: function(eles){			//Modify 2013,5,16
		var id, animateData, dataTemp =data;
		id = dataTemp.get(eles[0]);
		if(!id)
			return false;
		animateData = dataTemp.catche.system.animate[id];
		if(!animateData)
			return false;
		return true;
		
	},
	stop: function(eles, is){			//Modify 2013,5,16
		var dataTemp = data, dataAnimate = dataTemp.catche.system.animate;
		$.Each(eles, function(){
			var id = dataTemp.get(this);
			if(dataAnimate[id])
				is ? dataAnimate[id].end() : dataAnimate[id].stop();
		});
		return eles;
	},
	css: function(eles, name, value){	//Modify 2013,5,16
		var styleTemp = style;
		return 	(value === undefined && $.Typeof(name) !== 'Object') 
				? styleTemp.get(eles[0], name) 
				: ($.Each(eles, function(){
					styleTemp.set(this, name, value);
				}), eles);

    },
    hasClass: function(eles, name){		//Modify 2013,5,21
    	return className.has(eles[0], name);
    },
    addClass: function(eles, name){
    	var classNameTemp = className;
    	$.Each(eles, function(){
    		classNameTemp.add(this, name)
    	});
    	return eles;
    },
    removeClass: function(eles, name){		//Modify 2013,5,21
    	var classNameTemp = className;
    	$.Each(eles, function(){
    		classNameTemp.remove(this, name)
    	});
    	return eles;
    },
    toggleClass: function(eles, name){		//Modify 2013,5,21
    	var classNameTemp = className;
    	$.Each(eles, function(){
    		classNameTemp.toggle(this, name)
    	});
    	return eles;
    },
    attr: function(eles, name, value){		//Modify 2013,5,21
    	var virtueTemp = virtue;
    	if(value === undefined && $.Typeof(name) !== 'Object'){
    		return virtueTemp.attrGet(eles[0], name);
    	}else{
    		$.Each(eles, function(){
    			virtueTemp(this, name, value);
    		});
    		return eles;
    	}
    },
    removeAttr: function(eles, name){		//Modify 2013,5,21
    	var virtueTemp = virtue;
    	$.Each(eles, function(){
    		virtueTemp.attrRemove(this, name);
    	});
    	return eles;
    },
    prop: function(eles, name, value){		//Modify 2013,5,21
    	var virtueTemp = virtue;
    	if(value !== undefined){
    		$.Each(eles, function(){
    			virtueTemp.propSet(this, name, value)
    		})
    		return eles
    	}else{
    		return virtueTemp.propGet(eles[0], name);
    	}
    },
    removeProp: function(eles, name){		//Modify 2013,5,21
    	var virtueTemp = virtue;
    	$.Each(eles, function(){
    		virtueTemp.propRemove(this, name);
    	})
    	return eles;
    },
    show: function(eles, value){			//Modify 2013,5,21 	ps 最好方法是用className控制show和hide;
        $.Each(eles, function(){
        	if(this.style.display === 'none' && value === undefined){
        		this.style.display = "";
        	}else{
        		this.style.display = value ? value : 'block';
        	}
		});
    	return eles;
    },
    hide: function(eles){					//Modify 2013,5,22
    	$.Each(eles,function(){
    		this.style.display = "none";
    	});
    	return eles;
    },
    visible:function(eles) {				//Modify 2013,5,22	
    	return !!eles[0].offsetWidth || $(eles[0]).css("display") !== "none";
  	},
    toggle:function(eles, value){			//Modify 2013,5,22
    	var m = $.Method;
    	$.Each(eles,function(){
    		m[m.visible([this]) ? "hide" : "show"]([this], value);
    	})
    	return eles;
    },
    position:function(eles){				//Modify 2013,5,22		
    	return {
    		top:eles[0].offsetTop,
    		left:eles[0].offsetLeft
    	};
    },
    offset:function(eles){					//Modify 2013,5,22
    	var val, node = eles[0], nomal, top, left;
    	val = {
    		top:0,
    		left:0
    	};
    	nomal = function(node, val){
    		do{
	    		val.top += node.offsetTop;
				val.left += node.offsetLeft;
	    	}while(node = node.offsetParent);
	    	return val
    	}
    	if(node.getBoundingClientRect){
    		top =  node.getBoundingClientRect().top;
    		left = node.getBoundingClientRect().left;
    		val.top = $.Browser.IE7 ? top-2 : top;
    		val.left = $.Browser.IE7 ? left-2 : left;
    	}else{
    		val = nomal(node, val);
    	}
    	return val;
    },
    width:function(eles){				//Modify 2013,5,22				
    	return style.get(eles[0], 'width');
    },
    innerWidth:function(eles){			//Modify 2013,5,22
    	eles[0].style.zoom = 1;
    	return eles[0].clientWidth;
    },
    outerWidth:function(eles){			//Modify 2013,5,22
    	eles[0].style.zoom = 1;
    	return eles[0].offsetWidth;
    },
    height:function(eles){				//Modify 2013,5,22
    	return style.get(eles[0], 'height');
    },
    innerHeight:function(eles){			//Modify 2013,5,22
    	eles[0].style.zoom = 1;
    	return eles[0].clientHeight;
    },
    outerHeight:function(eles){			//Modify 2013,5,22
    	eles[0].style.zoom = 1;
    	return eles[0].offsetHeight;
    }
}
/******************************************************************************************************************* /somesayss DOM方法 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss som对象工厂 v1.1.0 PS:无法使用函数方法
 * @param {array} eles 这里的eles传入的都是一个数组;
 */
var somObject = function(elems){
		return this instanceof somObject ? this.init(elems) : new somObject(elems);
	}
somObject.prototype = {
	init: function(elems){
		if(!this.isArray(elems))
			elems = $.Array(elems);
		this.setArray(elems);
		this.somesayss = 'somesayss';
		return this;
	},
	setArray: function(elems){
		this.length = 0;						//为了让IE67,拥有length属性
		[].push.apply(this,elems);
	},
	isArray: function(obj){						//判断是否为Array的简略方法，$.Typeof的专属版
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	valueOf: function(){
		return [].slice.call(this);
	},
	splice	:[].splice,							//为了在firfox下看的更像数组
	shift 	:[].shift,
	unshift	:[].unshift,
	pop 	:[].pop,
	push	:[].push,
	sort	:[].sort,
	concat 	:[].concat,
	slice 	:[].slice
};
$.Each($.Method,function(i,o){
	somObject.prototype[i] = function(){
		var val = o[i].apply(null,[[].slice.call(this)].concat([].slice.call(arguments)));
		//如果单单只去 this.init 他 this 就会更改； 为了保证this不会改变所以只能去再去实例化一个;
		return this.isArray(val) ? somObject(val) : val;
	}
},true);
/******************************************************************************************************************* /somesayss som对象工厂 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss类名 v1.1.0	2013.5.21
 * @param {dom} node 对象节点
 * @param {string|Object} name	名称
 * @param {string} value
 */
var className = function(node, name){
	return this instanceof className ? this.init(node, name) : new className(node, name);
}
className.prototype = {
	init: function(node, name){
		return this.add(node, name);
	},
	has: function(node, name){
		return node.classList ? node.classList.contains(name) : new RegExp("\\b"+name+"\\b").test(node.className);
	},
	add: function(node, name){
		if(node.classList){
			this.has(node, name) || node.classList.add(name);
		}else{
			this.has(node, name) || (node.className += (node.className ==='' ? '' : ' ') +name);
		}
		return this;
	},
	remove: function(node, name){
		if(node.classList){
			name ? this.has(node, name) && node.classList.remove(name) : node.className = "";
		}else{
			name ? this.has(node, name) && ( node.className = node.className.replace(name, "").replace(/\s+/g," ").replace(/^\s+/, '').replace(/\s+$/, '') ) 
			 : node.className = "";
		}
    	return this;
	},
	toggle: function(node, name){
		this.has(node, name) ? this.remove(node, name) : this.add(node, name);
		return this;
	}
}
'has add remove toggle'.replace(/\w+/g,function(n){
	className[n] = className.prototype[n]
})
$.className = className;
/******************************************************************************************************************* /somesayss 样式类 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss属性类 v1.1.0	2013.5.21
 * @param {dom} node 对象节点
 * @param {string|Object} name	名称
 * @param {string} value
 * @PS 如果要存取数据用data, 取特性用prop, attr完全可以被替代;
 */
var virtue = function(node, name, value){
	return this instanceof virtue ? this.init(node, name, value) : new virtue(node, name, value);
}
virtue.prototype = {
	init:function(node, name, value){
		return this.attrSet(node, name, value);
	},
	attrSet: function(node, name, value){
		var i, classFn;
		classFn = function(name){	//IE67，下取class需要用className的补丁
			return (name === 'class' && $.Browser.IE7) ? 'className' : name;
		}
		switch($.Typeof(name)){
			case 'String': 
						node.setAttribute(classFn(name), value); 
						break;
			case 'Object': 
						for(i in name){
							node.setAttribute(classFn(i), name[i]);
						};
						break;
			default: return this;
		}
		
	},
	attrGet: function(node, name){
		return node.getAttribute(name) || node.getAttribute(this.fixed[name]);
	},
	attrRemove: function(node, name){
		node.getAttribute(name) ? node.removeAttribute(name) : node.removeAttribute(this.fixed[name]);
		return this;
	},
	propSet: function(node, name, value){
		var nameTemp;
		if(nameTemp = this.fixed[name])
			name = nameTemp;
		node[name] = value;
		return this;
	},
	propGet: function(node, name){
		return node[name] || node[this.fixed[name]];
	},
	propRemove: function(node, name){
		var self = this;
		$.Try(function(){
			delete node[name];
		}, function(){
			self.attrRemove(node, name);
		}, function(){
			node[name] = undefined;
		})
		return self;
	},
	fixed: {
		'class': 'className'
	}
}
'show attrSet attrGet attrRemove propSet propGet propRemove fixed'.replace(/\w+/g,function(n){
	virtue[n] = virtue.prototype[n]
})
$.virtue = virtue;
/******************************************************************************************************************* /somesayss 属性类 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss样式类 v1.1.0	2013.5.13
 * @param {dom} node 对象节点
 * @param {string|Object} name	名称
 * @param {string} value
 * @ps 如何正确获取'%'百分比??? 对于em的处理???
 */
var style = function(node, name, value){
	return this instanceof style ? this.init(node, name, value) : new style(node, name, value);
}
style.prototype = {
	init: function(node, name, value){
		this.set(node, name, value);
	},
	get: function(node, name){

		
		var self = this, tool = self.tool, special = self.special, val;
		name = tool.toFormatName(name);
		val = node.style[name];
		if(val)
			return tool.toFormatNum(val);
		switch(name){
			case 'float':
				return tool.toShowStyle(node, ($.Browser.IE8 ? 'styleFloat' : 'cssFloat'));
			case 'opacity':
				return special.opacity(node);
			case 'top':
			case 'left':
				return special.topLeft(node, name);
			case 'width':
			case 'height':
				return special.widthHeight(node, name);
			default:
				return tool.toShowStyle(node, name);
		}
	},
	set: function(node, name, value){
		var self = this, tool = self.tool, cssText, oldText;
		oldText = node.style.cssText;
		cssText = tool.toGetCssText(name, value);
		node.style.cssText = oldText+';'+cssText;
		return this;
	},
	tool: {
		toGetCssText: function(name, value){	//正确得到样式文本;
			var flag, text = '';
			//区别于 name 为对象和字符串的时候;
			if($.Typeof(name) === 'Object'){
				for(var i in name){
					text += i +':'+ name[i] +';';
				}
				flag = $.Object.hasname(name, 'opacity') ? +name.opacity : undefined;
			}else{
				text += name+':'+value+';';
				flag = name === 'opacity' ? +value : undefined;
			}
			//如果有opacity则特殊处理;
			text = flag === undefined ? text : text + 'filter:alpha(opacity='+(flag*100)+');';
			return text;
		},
		toShowStyle: function(node, name){		//主要的处理函数;
			var showstyle, WIN = window, tool = this;
			showstyle = WIN.getComputedStyle ? WIN.getComputedStyle(node, null) : node.currentStyle;
			return tool.toFormatNum(showstyle[name]);
		},
		toFormatNum: function(val){				//作用是把 12px 这些转成 12 数字; 不是这类的就不转了;
			var self = style, rex = self.rex, tool = this;
			if(rex.value01.test(val)){
				return parseFloat(val);			//为啥parseFloat用这个 因为 opacity 获取的时候是 0.5 这种;
			}else if(rex.value03.test(val)){
				return tool.toFormatColrH(val);
			}else if(rex.value04.test(val)){
				return tool.toFormatColrL(val);
			}else{
				return val;
			}
		},
		toFormatName: function(name){			//把 font-size 变成 fontSize 这种;
			var self = style, rex = self.rex;
			return name.replace(rex.value02, function(a, b){
				return b.toUpperCase();
			});
		},
		toFormatColr16: function(num){			//转换16进制的
			var val = num.toString(16);
			if(num < 16) val =  '0' + val;
			return val;
		},
		toFormatColrH: function(str){			//适用于高级浏览rgb(0,0,0)这种的;
			var self = style, rex = self.rex, tool = this, val = '', temp;
			temp = str.match(rex.value05);
			for(var i = 0, j = temp.length; i < j; ++i){
				val += tool.toFormatColr16(+temp[i]);
			}
			return '#'+val;
		},
		toFormatColrL: function(val){			//适用于低级浏览#FFFFFF这种的;
			var self = style, rex = self.rex;
			if(val.length < 7){
				return val.replace(rex.value06, function(a){
					return a+a;
				})
			}else{
				return val;	
			}
		}
	},
	rex: {
		value01: /^[\d-+]/,			//获取12px 这些以数字开头的字符串;
		value02: /-(\w)/g, 			//获取 font-size 这种
		value03: /^rgb/,			//获取高级浏览器的颜色
		value04: /^#/,				//获取低级浏览器的颜色
		value05: /\d+/g, 			//获取数字
		value06: /\w/g 				//获取一个个字符
	},
	special: {
		opacity: function(node){
			var self = style, val;
			val = self.tool.toShowStyle(node, 'opacity');
			val = val === undefined ? 1 : val;
			return val;
		},
		topLeft: function(node, name){
			var self = style, val, tool = self.tool;

			return name === 'top' ? node.offsetTop : node.offsetLeft;
		},
		widthHeight: function(node, name){
			var self = style, val, tool = self.tool;
			val = tool.toShowStyle(node, name);
			if(val === 'auto'){
				node.style.zoom = 1;
				val = name === 'width' ? (node.clientWidth - tool.toShowStyle(node, 'paddingLeft') - tool.toShowStyle(node, 'paddingRight')) 
									   : (node.clientHeight - tool.toShowStyle(node, 'paddingTop') - tool.toShowStyle(node, 'paddingBottom'));
			}
			return val;
		}
	}
}
'get set tool rex special'.replace(/\w+/g,function(n){
	style[n] = style.prototype[n];
})
$.style = style;
/******************************************************************************************************************* /somesayss somesayss样式类 v1.1.0 */
/*******************************************************************************************************************
 * @fileoverview somesayss动画类 v1.1.0	2013.5.15  PS:无法使用函数方法
 * @param {dom} node 对象节点
 * @param {object} opat	css属性
 * @param {number} time
 * @param {string} easing
 * @param {function} callback
 * @param {function} onbegin
 * @ps 如果用'%'百分比做动画的时候初始值要么为0;或者用内联样式写；不然初始值获取会不太一样;??? JQ解决了	
 */
var animate = function(node, opat, time, easing, callback, onbegin){
	return this instanceof animate ? this.init(node, opat, time, easing, callback, onbegin) : new animate(node, opat, time, easing, callback, onbegin);
}
animate.prototype = {
	init: function(node, opat, time, easing, callback, onbegin){
		this.callback = callback;
		this.node = node;
		return this.main(node, opat, time, easing, callback, onbegin);

	},
	main: function(node, opat, time, easing, callback, onbegin){
		var self = this, tool = self.tool, starTime = new Date().getTime(), ease, requestAnimationFrame, dis, rex = self.rex, styleTemp = style, dataTemp = data, id, dataAnimate;
		onbegin && onbegin.call(node);
		self.styleTemp = styleTemp;
		//把这个实例存到缓存中
		id = self.id = dataTemp.set(node);
		dataAnimate = self.dataAnimate = dataTemp.catche.system.animate;
		dataAnimate[id] = self;
		//初始化 time callback easing;
		time = time !== undefined ? time : 500;
		ease = tool.ease[easing !== undefined ? easing : 'easeInOutExpo'];
		//获取需要的信息;
		requestAnimationFrame = tool.requestAnimationFrame;
		dis = self.dis = (function(node, opat, rex){
			var change = {}, begin = {}, end = {}, i, j, k, z, unit;
			for(i in opat){
				j = parseFloat(opat[i]);
				k = styleTemp.get(node, i);
				z = j - k;
				//如果差值为0直接跳出
				if(z === 0)
					continue;
				//获取数字
				change[i] = [];
				change[i].push(z * 100);
				//获取单位
				unit = opat[i].toString().match(rex.value00);
				unit = unit ? unit[0] : (i === 'opacity' ? '' : 'px');
				change[i].push(unit);
				//获取初始状态值
				begin[i] = k * 100;
				//获取结束状态值
				end[i] = j + unit;
			}
			return {
				change: change,
				begin: begin,
				end: end
				}
		})(node, opat, rex);
		//如果dis.change是个空对象直接触发回调并且不执行动画
		if($.Object.isEmpty(dis.change)){
			callback && callback.call(node);
			return self;
		}
		//动画开始;
		self.animateHandle = requestAnimationFrame(function(){
			var nowTime = new Date().getTime(), changeTime = nowTime - starTime, changePos = ease(changeTime / time), nextDis, disTemp = dis;
			//动画结束条件:时间到了;
			if(changeTime >= time){
				styleTemp(node, disTemp.end);
				callback && callback.call(node);
				delete dataAnimate[id];
				return;
			}
			//获取下一步的路径;
			nextDis = (function(changeDis, changePos, beginDis){
				var i, temp = {};
				for(i in changeDis){
					temp[i] = ((beginDis[i] + Math.ceil(changePos*changeDis[i][0])) / 100) + changeDis[i][1];
				}
				return temp;
			})(disTemp.change, changePos, disTemp.begin);
			styleTemp(node, nextDis);
			self.animateHandle = requestAnimationFrame(arguments.callee);
		})
		return self;
	},
	stop: function(){
		var self = this, cancelAnimationFrame = self.tool.cancelAnimationFrame, callback = self.callback;
		cancelAnimationFrame(self.animateHandle);
		callback && callback.call(self.node);
		delete self.dataAnimate[self.id];
		return this;
	},
	end: function(){
		var self = this, cancelAnimationFrame = self.tool.cancelAnimationFrame, callback = self.callback, node = self.node;
		cancelAnimationFrame(self.animateHandle);
		self.styleTemp(node, self.dis.end);
		callback && callback.call(node);
		delete self.dataAnimate[self.id];
		return this;
	},
	tool: {
		ease: {
			easeInBack:function(pos){var s=1.70158;return(pos)*pos*((s+1)*pos-s);},easeOutBack:function(pos){var s=1.70158;return(pos=pos-1)*pos*((s+1)*pos+s)+1;},easeInOutBack:function(pos){var s=1.70158;if((pos/=0.5)<1)return 0.5*(pos*pos*(((s*=(1.525))+1)*pos-s));return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos+s)+2);},bounce:function(pos){if(pos<(1/2.75)){return(7.5625*pos*pos);}else if(pos<(2/2.75)){return(7.5625*(pos-=(1.5/2.75))*pos+.75);}else if(pos<(2.5/2.75)){return(7.5625*(pos-=(2.25/2.75))*pos+.9375);}else{return(7.5625*(pos-=(2.625/2.75))*pos+.984375);}},bouncePast:function(pos){if(pos<(1/2.75)){return(7.5625*pos*pos);}else if(pos<(2/2.75)){return 2-(7.5625*(pos-=(1.5/2.75))*pos+.75);}else if(pos<(2.5/2.75)){return 2-(7.5625*(pos-=(2.25/2.75))*pos+.9375);}else{return 2-(7.5625*(pos-=(2.625/2.75))*pos+.984375);}},linear:function(pos){return pos},spring:function(pos){return 1-(Math.cos(pos*4.5*Math.PI)*Math.exp(-pos*6));},easeInExpo:function(pos){return(pos==0)?0:Math.pow(2,10*(pos-1));},easeOutExpo:function(pos){return(pos==1)?1:-Math.pow(2,-10*pos)+1;},easeInOutExpo:function(pos){if(pos==0)return 0;if(pos==1)return 1;if((pos/=0.5)<1)return 0.5*Math.pow(2,10*(pos-1));return 0.5*(-Math.pow(2,-10*--pos)+2);},wobble:function(pos){return(-Math.cos(pos*Math.PI*(9*pos))/2)+0.5;}
		},
		requestAnimationFrame: (function(WIN){
			return WIN.requestAnimationFrame||WIN.mozRequestAnimationFrame||WIN.webkitRequestAnimationFrame||WIN.msRequestAnimationFrame||WIN.oRequestAnimationFrame||function(callback){return setTimeout(callback,1000/60);}
		})(WIN),
		cancelAnimationFrame: (function(WIN){
			return WIN.cancelAnimationFrame||WIN.mozCancelAnimationFrame||WIN.webkitCancelAnimationFrame||WIN.msCancelAnimationFrame||WIN.oCancelAnimationFrame||function(callback){return clearTimeout(callback);}
		})(WIN)
	},
	rex: {
		value00: /[A-z%]+/ //获取12px中的px这个, 也就是获取单位的作用;
	}
}
$.animate = animate;
/******************************************************************************************************************* /somesayss somesayss动画类 v1.1.0 */
/*---img---*/
$.Imageload = $.Class.creat();
$.Imageload.prototype = {
	init:function(){
		this.opat = {
			url:null,
			node:null,
			callback:function(){}
			};
		$.Object.extend(this.opat,arguments[0]||{});
		var _url = this.opat.url;
		var _node = this.opat.node;
		if(!_url) return;
		switch($.Typeof(_url)){
			case "Array" : return  _url.length !== 0 ? this.fire() : undefined;
			case "String" :
				if(!_node){
					return this.base(_url,this.opat.callback);
				}
				else{
					if(!_node.img) _node.img = new Image();
					return this.only();	
				}
		}
	},
	fire:function(){
		var _this = this,_opat = _this.opat,guid=0;
		$.Each(_opat.url,function(i,o){
			_this.base(o[i],function(url){
				guid++;
				if(guid < _opat.url.length) return;
				_opat.callback(_opat.url);
			})
		})
	},
	only:function(){
		var _this = this,_opat = _this.opat;
		var _url = _opat.url;
		var _node = _opat.node; 
		var _img = _node.img;
		_img.onload = null;
		_img.src = _url;
		if(_img.complete == false){
        	_img.onload = function(){
        		_img.onload = null;
				_opat.callback(_url);
				_node.img = null;
			};
        }else{
	        	_opat.callback(_url);
	        	_node.img = null;
        }

	},
	base:function(url,callback){
		var _opat = this.opat,_img = new Image();
        _img.src = url;
        if(_img.complete == false){
        	_img.onload = function(){
        		_img.onload = null;
				callback(url);
			};
        }else{
        		callback(url);
        }
	}
}
/**
 * @fileoverview ajax类 v1.1.0
 * @param {object} obj 对象节点
 */
var ajax = function(obj){
	return this instanceof ajax ? this.init(obj) : new ajax(obj);
}
//设置全局变量
ajax.timeKey = new Date().getTime();
ajax.guid = 0;
ajax.prototype = {
	init: function(obj){
		var option = {
			url: null,
			cache: true,
			async: true,	
			headers: null,
			data: null,
			type: 'get',
			dataType: 'text',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',	//火狐在这里会自动添加'charset=UTF-8',那我们就统一下吧
			timeout: 0,	//IE8+
			ontimeout: function(){}, //IE8+
			beforeSend: function(){},
			success: function(){},
			error: function(){},
			complete: function(){}
		}
		$.Object.extend(option, obj||{});
		if(!option.url){
			$.mes('ajax error: 需要至少的参数, url.');
			return this;
		}
		this.option = option;
		return option.dataType === 'jsonp' ? jsonp(option.url, option.data, option.async, option.success) : this.main();

	},
	main: function(){
		var self = this, option = self.option, xmlhttp = self.getXmlHttp(), data, tool = self.tool;
		self.xmlhttp = xmlhttp;
		//全部换成大写
		option.type = option.type.toLocaleUpperCase();
		//执行发送前的函数
		option.beforeSend();
		//格式化数据
		data = tool.formatData(option.data);
		//当type为GET时候把URL给转义下
		tool.formatGetUrl(option, data);
		//情求地址
		xmlhttp.open(option.type, option.url, option.async);
		//超时设置只有IE8+有效果，如果是同步的话会直接报错	IE9在open前会报错
		if('timeout' in xmlhttp && option.async){
			xmlhttp.timeout = option.timeout;
			xmlhttp.ontimeout = function(){
				option.ontimeout();
			}
		}
		//请求头
		tool.sendHead(xmlhttp, option);
		//同步异步分流
		option.async ? self.asyncHttp(xmlhttp, option, data) : self.syncHttp(xmlhttp, option, data);
		return self;
	},
	getXmlHttp: function(){	//获取xmlhttp对象
		return $.Try(
			function(){
				return new XMLHttpRequest();
			},
			function(){
				return new ActiveXObject('Microsoft.XMLHTTP');
			})
	},
	abort: function(){	//终止ALAX
		this.xmlhttp.abort();
		return this;
	},
	asyncHttp: function(xmlhttp, option, data){	//异步请求响应
		//xmlhttp.abort()
		var self = this, tool = self.tool;
		//sendPost数据
		option.type === 'GET' ? xmlhttp.send(null) : xmlhttp.send(data);
		//主函数
		function foo(xmlhttp, option){
			if( xmlhttp.status == 200 || xmlhttp.status == 304 ){
				option.success(tool.responseData(xmlhttp.responseText, option.dataType));
			}else{
				$.mes('ajax error: 请求错误, 状态码, '+xmlhttp.status);
				option.error();
			}
			option.complete();
		}
		if(xmlhttp.readyState == 4){	//用肉眼观察的IE6下这里直接就是4啦~
			foo(xmlhttp, option);
		}else{
			xmlhttp.onreadystatechange = function(){
				if( xmlhttp.readyState == 4 )
					foo(xmlhttp, option);
			}
		}
		
		return this;
	},
	syncHttp: function(xmlhttp, option, data){	//同步请求响应
		var self = this, tool = self.tool;
		try{
			//sendPost数据
			option.type === 'GET' ? xmlhttp.send(null) : xmlhttp.send(data);
			if( xmlhttp.status == 200 || xmlhttp.status == 304 ){
				option.success(tool.responseData(xmlhttp.responseText, option.dataType));
			}else{
				$.mes('ajax error: 请求错误, 状态码, '+xmlhttp.status);
				option.error();
			}
		}catch(e){
			$.mes('ajax error: 请求错误, 状态码, '+xmlhttp.status);
			option.error();
		}
		option.complete();
		return this;
	},
	tool: {
		responseData: function(data, dataType){
			switch(dataType){
				case 'json':
					return this.doJson(data);
				case 'script':
					return this.doScript(data);
				default:
					return data;
			}
		},
		sendHead: function(xmlhttp, option){
			var headers = option.headers;
			//发送约定头部信息
			xmlhttp.setRequestHeader('Content-type', option.contentType);
			//发送自定义头部信息
			if(headers){
				for(var i in headers){
					xmlhttp.setRequestHeader(i, headers[i]);
				}
			}
		},
		formatData: function(data){
			var value = '', i, j = 0;
			if(!data)
				return data;
			for(i in data){
				if($.Typeof(data[i]) === 'Array'){
					for(;j < data[i].length; ++j){
						value += i;
						value += '=';
						value += data[i][j];
						value += '&';
					}
				}else{
					value += i;
					value += '=';
					value += data[i];
					value += '&';
				}
			}
			return value.slice(0, -1);
		},
		formatGetUrl: function(option, data){
			var guid;
			//如果请求方法不为GET就返回
			if(option.type !== 'GET')
				return;
			//如果data存在
			if(data){
				option.url += '?';
				data = escape(data);
				option.url += data;
			}
			//如果cache为false的时候对url特殊处理;
			if(!option.cache){
				guid = ajax.timeKey + ++ajax.guid;
				option.url = option.url+ (data ? escape('&_=') : '?'+escape('_=')) + guid;
			}
		},
		doJson: function(data){
			try{
				return $.json(data).parse();
			}catch(e){
				$.mes('ajax error: json syntax error');
				return data;
			}
		},
		doScript: function(data){
			try{
				$.globalEval(data);
				return data;
			}catch(e){
				$.mes('ajax error: script syntax error');
				return data;
			}
		}
	}
}
$.ajax = ajax;
/**
 * @fileoverview jsonp类 v1.1.0
 * @param {object} obj 对象节点
 */
var jsonp = function(url, data, async, callback){
	return this instanceof jsonp ? this.init(url, data, async, callback) : new jsonp(url, data, async, callback);
}
jsonp.prototype = {
	init: function(url, data, async, callback){
		return this.main(url, data, async, callback);
	},
	main: function(url, data, async, callback){
		$.mes('jsonp 加载ing')
		var ajaxTool = ajax.prototype.tool, callbackFn, guid;
		guid = ajax.timeKey + ++ajax.guid;
		callbackFn = 'somesayss' + guid;
		url += '?callback='+ callbackFn +'&'+ ajaxTool.formatData(data) +'&_='+ guid;
		window[callbackFn] = callback;
		nodeLoad(url, async, true, function(){
			try{
				delete window[callbackFn];
			}catch(e){
				window[callbackFn] = undefined;
			}
		});
	}
}
$.jsonp = jsonp;
/**
 * @fileoverview nodeLoad v1.1.0 支持.js .css
 * @param {array|string} urlList 对象节点
 * @param {boolean} async 布尔值 默认为false, 也就是同步方法
 * @param {boolean} only 布尔值 默认为false, 也就是默认为资源只加载一次
 * @param {function} callback 函数当列表全部都加载完毕后执行的回调
 * @ps script标签在删除后也能保存在内存中，link标签删除后无法显示该有的样式，IE6除外，IE7能看到闪动
 */
var nodeLoad = function(urlList, async, only, callback){
	return this instanceof nodeLoad ? this.init(urlList, async, only, callback) : new nodeLoad(urlList, async, only, callback);
}
//为了确保不出现加载多次的情况;
nodeLoad.requestURL = {};
//同步采用的队列机制, 如果是异步就不放进来了直接调用, 如果是同步就进入队列
nodeLoad.queue = [];
nodeLoad.prototype = {
	init: function(urlList, async, only, callback){
		return this.main(urlList, async, only, callback);
	},	
	main: function(urlList, async, only, callback){
		var self = this;
		//异步同步分流
		async ? self.asyncScript(urlList, only, callback) : self.syncScript(urlList, only, callback);
		return self;
	},
	rex: {
		value01: /^loaded|complete|undefined$/,
		value02: /\.css$/
	},
	loadScript: function(url, complete){		//主加载函数, 默认为 script标签
		var self = this, HEAD = $.head, domNode, rex = self.rex, rexState = rex.value01, isCss = false, rexIsCss = rex.value02, only = self.only;
		if(!only && (nodeLoad.requestURL[url] === 1))
			return complete && complete();
		//正则匹配URL，是否为.css结尾的
		rexIsCss.test(url) && (isCss = true);
	 	if(isCss){
	 		domNode = document.createElement('link');
			domNode.href = url;
			domNode.type = 'text/css';
		 	domNode.rel = 'stylesheet';
		 	HEAD.appendChild(domNode);
		}else{
		 	domNode = document.createElement('script');
			domNode.src = url;
			domNode.type = 'text/javascript';
		 	domNode.defer = true;
		 	HEAD.insertBefore(domNode, HEAD.firstChild);
		}
		domNode.charset = 'utf-8';
	 	domNode.onload = domNode.onreadystatechange = domNode.onerror = function(){
			if(rexState.test(domNode.readyState)){
				domNode.onerror = domNode.onload = domNode.onreadystatechange = null;
				if(!isCss){
					domNode.clearAttributes && domNode.clearAttributes();
					domNode.src = domNode.type = domNode.charset = domNode.defer = null;
					HEAD.removeChild(domNode);
				}
				// IE<9 是无法判断出脚本是否加载成功的	如果不考虑的话 可以用 e.type 这个可以产生success,error
				complete && complete(url);
			}
		}
	},
	asyncScript: function(urlList, only, callback){	//异步创建script
		$.mes('nodeLoad: 异步加载ing '+urlList);
		urlList = [].concat(urlList);
		var self = this, i = 0, total = urlList.length, guid = 0;
		for(; i < total; ++i){
			//如果only为false, 则去确保资源只加载一次
			!only && !nodeLoad.requestURL[urlList[i]] && (nodeLoad.requestURL[urlList[i]] = 0);
			self.loadScript(urlList[i], function(url){
				//如果only为false, 则去确保资源只加载一次
				!only && (nodeLoad.requestURL[url] = 1);
				++guid;
				if(guid >= total)
					callback && callback();	
			});
			
		}
		return self;
	},
	syncScript: function(urlList, only, callback){	//同步创建script
		$.mes('nodeLoad: 同步加载ing '+urlList);
		urlList = [].concat(urlList);
		var self = this, queue;
		queue = nodeLoad.queue = nodeLoad.queue.concat(urlList, callback);
		//如果队列中没有参数则去执行循环函数
		if(queue.length !== urlList.length + 1)
			return self;
		//循环函数
		function loop(queue){
			//如果only为false, 则去确保资源只加载一次
			!only && !nodeLoad.requestURL[queue[0]] && (nodeLoad.requestURL[queue[0]] = 0);
			//如果队列内为空就跳出loop
			if(!queue.length)
				return;
			self.loadScript(queue[0], function(url){
				//如果only为false, 则去确保资源只加载一次
				!only && (nodeLoad.requestURL[queue[0]] = 1);
				//如果第二个值类型不为String就执行+删掉
				if($.Typeof(queue[1]) !== 'String'){
					queue[1] && queue[1]();
					nodeLoad.queue.shift();
				}
				nodeLoad.queue.shift();
				loop(nodeLoad.queue);
			});
		}
		loop(queue);
		return self;
	}
}
$.nodeLoad = nodeLoad;
/*全局引用*/
 WIN["somesayss"]  = $;
 
}(window, document);