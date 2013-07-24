define(function(require,exports){
	
	var $ = require('somesayss');

	//实时输入 BY somesayss
	var realTimeInput = function(opat){
		return this instanceof realTimeInput ? this.init(opat) : new realTimeInput(opat);
	};
	realTimeInput.prototype = {
		init: function(opat){
			this.opat = {
				id: null,
				callback: function(){}
			};
			$.Object.extend(this.opat, opat||{});
			this.main();
		},
		main: function(){
			var self = this, opat = self.opat, jqueryNode;
			//主体内容开始
			jqueryNode = $(opat.id);
			//代码防御
			if(!jqueryNode.length)
				return;
			//事件
			jqueryNode.on('input', function(){
				opat.callback.call(this, self.getVlueNum($.trim(this.value)));
			})
		},
	 	getVlueNum: function(str, value){			//计算占用字节数的方法
	 		//[^\x00-\xff] 可以匹配中文以及全角符号
	 		str = str.replace(/[^\x00-\xff]/g, function(a){
	 			return 'aa';
	 		});
	 		return str.length;
	 	}
	}
	exports.realTimeInput = realTimeInput;

})
