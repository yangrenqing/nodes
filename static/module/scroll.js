define(function(require,exports){
	
	var $ = require('somesayss');

	/**
	 * @fileoverview scroll
	 * @param {object} obj 属性
	 */
	var scroll = function( obj ){
		return this instanceof scroll ? this.init( obj ) : new scroll( obj );
	}
	scroll.prototype = {
		init:function( obj ){
			var option = {
				type: 'top',
				box: null,
				content: null,
				style: {},
				distance: 100,
				limitTop: 3,
				limitBot: 3,
				onscroll: function(){},
				onscrollend: function(){}
			}
			$.Object.extend( option, obj || {} );
			this.option = option;
			return this;
		},
		fire: function(){
			var self = this, option = self.option, box, content, scroll, scrollNode, limitTop, limitBot, DOC, oldCom, compute;
			box = self.box = $( option.box );
			content = self.content = $( option.content );
			limitTop = option.limitTop;
			limitBot = option.limitBot;
			//代码防御
			if( !box.length || !content.length )
				return self;
			//插入scroll的DIV
			scrollNode = document.createElement( 'div' );
			scrollNode.style.cssText = 'width:5px;position:absolute;background:#333;right:0px;cursor:pointer;overflow:hidden;height:0;';
			//设置自定样式
			scroll = self.scroll = $( scrollNode );
			scroll.css( option.style );
			//重设top
			scroll.css( option.type, limitTop+'px' );
			content.css( option.type, 0 );
			box.append( scrollNode );
			//拿到函数计算高度函数
			compute = self.compute;
			//先存入预先的值
			oldCom = self.oldCom = compute.call( self, box, content, scroll, limitTop, limitBot, {} );
			//滚轮
			box.on( 'mousewheel', function( e ){
				e.stop();
				var tempObj = compute.call( self, box, content, scroll, limitTop, limitBot, oldCom ), optionTemp = option, top;
				if(!tempObj)
					return;
				//获取当前的top
				top = scroll.css(optionTemp.type);
				if( e.wheelDelta ){	//向下滚
					top = optionTemp.type === 'top' ? (top + optionTemp.distance) : top - optionTemp.distance;
				}else{	//向上滚
					top = optionTemp.type === 'top' ? (top - optionTemp.distance) : top + optionTemp.distance;
				}
				self['mousewheelFn'+optionTemp.type]( top, tempObj, optionTemp, scroll, content );
			} );
			//拖拉滚动条
			DOC = $(document);
			scroll.on('mousedown', function(e){
				e.stop();
				var tempObj = compute.call( self, box, content, scroll, limitTop, limitBot, oldCom ), onceClientY, onceTop, optionTemp = option;
				if(!tempObj)
					return;
				//获取鼠标按下时的属性
				onceClientY = e.clientY;
				onceTop = scroll.css(optionTemp.type);
				DOC.on('mousemove', function(e){
					var nowClientY = e.clientY, top;
					//获取当前的top
					top = optionTemp.type === 'top' ? (nowClientY - onceClientY + onceTop) : (onceClientY - nowClientY + onceTop);
					self['mousewheelFn'+optionTemp.type]( top, tempObj, optionTemp, scroll, content );
				});
				DOC.on('selectstart', function(){
					return false;
				});
				DOC.on('mouseup', function(){
					DOC.off('mouseup');
					DOC.off('selectstart');
					DOC.off('mousemove');
				})
			});
			return self;
		},
		dead: function(){
			var self = this, box = self.box, scroll = self.scroll;
			box && box.off('mousewheel');
			scroll && scroll.off('mousedown'), scroll.prop('style').cssText = null, scroll.remove();
			return self;
		},
		//计算高度
		compute: function( box, content, scroll, limitTop, limitBot, oldCom ){
			var self = this, boxHeight, contentHeight, scrollHeight, maxScrollTop, minScrollTop, maxScrollHeight, maxContentHeight;
			//如果不传值就用全局对象代替
			oldCom = oldCom || self.oldCom;
			limitBot = limitBot || self.option.limitBot;
			limitTop = limitTop || self.option.limitTop;
			scroll = scroll || self.scroll;
			content = content || self.content;
			box = box || self.box;
			//计算出scroll的高	box/content = scroll/box
			contentHeight = content.innerHeight();
			boxHeight = box.innerHeight();
			//如果获得的值和原先的值是一样的
			if(contentHeight === oldCom.onceContentHeight && boxHeight === oldCom.onceBoxHeight){
				return oldCom;
			}
			//如果不一样就执行下面的计算
			scrollHeight = boxHeight/contentHeight*boxHeight;
			//设置maxContentHeight
			maxContentHeight = contentHeight - boxHeight;
			//重设高
			boxHeight < contentHeight && scroll.css( 'height', scrollHeight+'px' );
			//设置scroll最大能到的top
			maxScrollTop = boxHeight - scrollHeight - limitBot;
			minScrollTop = limitTop;
			maxScrollHeight = maxScrollTop - minScrollTop;
			//作比较的值
			oldCom.onceContentHeight = contentHeight;
			oldCom.onceBoxHeight = boxHeight;
			//需要的值
			oldCom.maxScrollTop = maxScrollTop;
			oldCom.minScrollTop = minScrollTop;
			oldCom.maxScrollHeight = maxScrollHeight;
			oldCom.maxContentHeight = maxContentHeight;
			return oldCom;
		},
		getTop: function(top, maxScrollTop, minScrollTop){
			if( top > maxScrollTop )
				return maxScrollTop;
			else if( top < minScrollTop )
				return minScrollTop;
			return top;
		},
		autoScroll: function(top){
			var self = this, tempObj = self.compute();
			switch(top){
				case 'min':
					top = tempObj.minScrollTop;
					break;
				case 'max':
					top = tempObj.maxScrollTop;
					break;
			}
			return self['mousewheelFn'+self.option.type]( top, tempObj );
		},
		mousewheelFntop: function( top, tempObj, optionTemp, scroll, content ){
			var self = this, tempTop, minScrollTop, maxScrollTop;
			//如果不传值就用全局对象代替
			tempObj = tempObj || self.compute();
			scroll = scroll || self.scroll;
			content = content || self.content;
			optionTemp = optionTemp || self.option;
			minScrollTop = tempObj.minScrollTop;
			maxScrollTop = tempObj.maxScrollTop;
			//top阀值的设定
			top = self.getTop(top, maxScrollTop, minScrollTop);
			if(minScrollTop > maxScrollTop){
				scroll.hide();
				content.stop().animate({
					top: 0
				}, 300, 'easeOutExpo');
				return self;
			}else{
				scroll.show();
			}
			//设置 	top/maxScrollHeight = contentTop/maxContentHeight
			tempTop = (minScrollTop - top)/tempObj.maxScrollHeight*tempObj.maxContentHeight;
			tempTop = tempTop;
			//设置scroll的偏移量
			scroll.stop().animate({
				top: top
			}, 300, 'easeOutExpo', function(){
				optionTemp.onscrollend.call(scroll);
			});
			content.stop().animate({
				top: tempTop
			}, 300, 'easeOutExpo');
			/**/
			optionTemp.onscroll.call( scroll, top, minScrollTop, maxScrollTop, tempTop );
			return self;
		},
		mousewheelFnbottom: function( top, tempObj, optionTemp, scroll, content ){
			var self = this, tempTop, minScrollTop, maxScrollTop;
			//如果不传值就用全局对象代替
			tempObj = tempObj || self.compute();
			scroll = scroll || self.scroll;
			content = content || self.content;
			optionTemp = optionTemp || self.option;
			minScrollTop = tempObj.minScrollTop;
			maxScrollTop = tempObj.maxScrollTop;
			//top阀值的设定
			top = self.getTop(top, maxScrollTop, minScrollTop);
			if(minScrollTop > maxScrollTop){
				scroll.hide();
				content.stop().animate({
					bottom: 0
				}, 300, 'easeOutExpo');
				return self;
			}else{
				scroll.show();
			}
			//设置 	top/maxScrollHeight = contentTop/maxContentHeight
			tempTop = (minScrollTop - top)/tempObj.maxScrollHeight*tempObj.maxContentHeight;
			tempTop = tempTop;
			//设置scroll的偏移量
			scroll.stop().animate({
				bottom: top
			}, 300, 'easeOutExpo', function(){
				optionTemp.onscrollend.call(scroll);
			});
			content.stop().animate({
				bottom: tempTop
			}, 300, 'easeOutExpo');
			/**/
			optionTemp.onscroll.call( scroll, top, minScrollTop, maxScrollTop, tempTop );
			return self;
		}
	}

	
	exports.scroll = scroll;

})
