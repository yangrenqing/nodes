define(function(require, exports){
	/**
	 * @fileoverview 模板类
	 * @param {str} string 原html
	 * @param {object} object 数据包
	 * 基于JS的模板系统
	 * ex:
	 * templateJs('html...', {}).outHtml();
	 */
	var templateJs = function(str, obj, leftJs, rightJs){
		return this instanceof templateJs ? this.init(str, obj, leftJs, rightJs) : new templateJs(str, obj, leftJs, rightJs);
	}
	templateJs.prototype = {
		init:function(str, obj, leftJs, rightJs){
			this.html = str;
			this.data = obj;
			this.leftJs = leftJs || '<?';
			this.rightJs = rightJs || '?>';
			return this;
		},
		outHtml: function(){
			var self = this, tool = self.tool, html = self.html, data = self.data, buff = ['var view = [];\n'], tempFn, rex = self.rex;
			html = tool.trim(html, rex);
			buff = self.escapeJs(html, buff);
			tempFn = Function('data', 'with(data){\n'+buff.join('')+'};\nreturn view.join(\'\');');
			return tempFn(self.data);
		},
		escapeJs: function(html, buff){
			var self = this, leftJs = self.leftJs, rightJs = self.rightJs, flag, tool = self.tool, rex = self.rex, transCode = self.transCode;
			while((flag = html.indexOf(leftJs)) !== -1){
				//普通的字符
				buff.push('view.push("'+tool.escapeHtml(html.slice(0, flag), rex, transCode)+'");\n');
				html = html.slice(flag+2);
				//JS逻辑
				flag = html.indexOf(rightJs);
				if(flag === -1)
					throw 'cant find right';
				switch(html.charAt(0)){
					case '!':
						buff.push('view.push('+html.slice(1, flag)+');\n');
						break;
					case '#':
						break;
					default:
						buff.push(html.slice(0, flag)+';\n');
				}
				html = html.slice(flag+2);
			}
			//模板标签最后的部分
			buff.push('view.push("'+tool.escapeHtml(html.slice(0), rex, transCode)+'");\n');
			return buff;
		},
		rex: {
			value00: /^\s+/,
			value01: /\s+$/,
			value02: /["\\\x00-\x1f\x7f-\x9f]/g
		},
		transCode: {	//完全可以不用这些,在这里的作用我想是为了提高性能,因为在使用vies.push("")的时候用的双引号;
			'\b': '\\b',  
	        '\t': '\\t',  
	        '\n': '\\n',  
	        '\f': '\\f',  
	        '\r': '\\r',  
	        '"' : '\\"', 
	        '\\': '\\\\'
		},
		tool: {
			trim: function(str, rex){
				return str.replace(rex.value00, '').replace(rex.value00, '');
			},
			escapeHtml: function(str, rex, transCode){
				return str.replace(rex.value02, function(a){
					var code = transCode[a];
					return code ? code : '\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);
				})
			}
		}
	}
	exports.templateJs = templateJs;


})