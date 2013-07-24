define(function(require,exports){
	var $ = require('somesayss');
	var Syntax = $.Class.creat();
	Syntax.prototype = {
		init:function(){
	        this.fire();
		},
		REX:{
			'all':/.+/g,						//获取除了换行符意外的所有字符
			'white':/\s/g,						//获取所有的空白符
			'tagsin':/<.*?>[^>]+>/g,			//获取标签内的所有字符[简单只能获取单层标签]
			'nocomma':/[\S\s]+/g,				//获取除了 '`' 符号以外的字符
 			'longNote':/\/\*[\s\S]*?\*\//g,		//获取 /**/ 内所有符号
			'shortNote':/\/\*.+?\*\//g,			//获取 /**/ 内的所有符号不包括换行符
			'otherNote':/\/\/.+/g,				//获取 // 后面的所有字符不包括换行符
			'holder':/\(:>\)/g,					//获取 '!@!' 符号 [临时占位符]
			'marks':/['"].*?['"]/g,				//获取 '' "" 内的内容
			'num':/[^\w][+-]?\d+(?:\.\d+)?/g,	//获取数字
			'sign':/[<>]/g, 					//获取 < > 符号
			'afterDot':/\.(\w+)/g, 				//获取'.'号后面的字符
			'afterNew':/new (.+?)\(/g,			//获取new 后面的字符
			'baseType1':/\bnull\b|\bundefined\b|\btrue\b|\bfalse\b/g,
			'baseType2':/\bString\b|\bArray\b|\bFunction\b|\bObject\b|\bNumber\b/g,
			'symbol':/\|\||\=|\!|\-|\+/g,
			'KeyWord':/\bbreak\b|\bdelete\b|\breturn\b|\btypeof\b|\bcase\b|\bdo\b|\bif\b|\bswitch\b|\bvar\b|\bcatch\b|\belse\b|\bin\b|\bthis\b|\bvoid\b|\bcontinue\b|\binstanceof\b|\bthrow\b|\bwhile\b|\bfinally\b|\bnew\b|\bwith\b|\bfor\b|\btry\b|\bcatch\b|\bfunction\b/g
		},
		fire:function(){
			var _this = this;
			var REX = _this.REX;
			var scripts = $('script[type=syntaxHighLight]');
			scripts.each(function(i,o){
				var $this = $(this);
				var _tempHtml = $.Use($this.html()).strip().value;
				var i=0, _count='';
				_tempHtml = _tempHtml.replace(REX.sign,function(a){
					if(a == '<') return '<pre class="syntax_color_ff9d0e">&lt;</pre>'
					else return '<pre class="syntax_color_ff9d0e">&gt;</pre>'
				}).replace(REX.shortNote,function(a){
					return '<pre class="syntax_color_0088ff syntax_font_italic">'+a+'</pre>';
				});
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.longNote,function(a){
						return a.replace(REX.all,function(b){
							return b.replace(REX.white,function(c){
								return '&nbsp;'
							}) 
						}).replace(/.*[^\s]/g,function(b){
							return '<pre class="syntax_color_0088ff syntax_font_italic">'+b+'</pre>';
						});
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.otherNote,function(a){
						return '<pre class="syntax_color_0088ff syntax_font_italic">'+a+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.marks,function(a){
						return '<pre class="syntax_color_3ad900">'+a+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.num,function(a){
						return '<pre class="syntax_color_ff628c">'+a+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.afterDot,function(a,b){
						return '.<pre class="syntax_color_eb939a">'+b+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.afterNew,function(a,b){
						return 'new <pre class="syntax_color_ffdd00">'+b+'</pre>(';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.baseType1,function(a){
						return '<pre class="syntax_color_ff628c">'+a+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.baseType2,function(a){
						return '<pre class="syntax_color_63ff96">'+a+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.symbol,function(a){
						return '<pre class="syntax_color_ff9d00">'+a+'</pre>';
					})
				})
				_tempHtml = _this.tagsout(_tempHtml,function(text){
					return text.replace(REX.KeyWord,function(a){
						return '<pre class="syntax_color_ff9d00">'+a+'</pre>';
					})
				})
				_tempHtml = _tempHtml.replace(REX.all,function(text){
					text = _this.tagsout(text,function(s){
						return s.replace(REX.white,'&nbsp;')
					})
					_count += '<div><pre>'+(++i)+'</pre></div>';
					return '<div><pre>'+text+'</pre></div>';
				});				
				$this.replaceWith('<div class="syntaxHighLight"><table><tbody><tr><td class="count">'+_count+'</td><td>'+_tempHtml+'</td></tr></tbody></table></div>');
			})
		},
		tagsout:function(str,fun){
			var _this = this, REX = _this.REX, temp = [], i = 0
			str = str.replace(REX.tagsin, function(a){
				temp.push(a);
				return '(:>)';
			}).replace(REX.nocomma ,function(a){
				return fun(a);
			}).replace(REX.holder,function(a){
				return temp[i++];
			})
			return str;
		}
	}
	exports.use = Syntax;

})
