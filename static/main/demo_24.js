define(function(require, exports){
	var $ = require('somesayss'),
		templateJs = require('../module/template.js').templateJs,
		iosocket = require('socket').connect(),
		scroll = require('../module/scroll.js').scroll,
		realTimeInput = require('../module/realtimeinput.js').realTimeInput;

	/** 实时显示输入的字符长度 */
	var appSendmesnum = $('#app-sendmesnum'), canSendMes = true;
	realTimeInput({
		id: '#app-sendmes',
		callback: function(num){
			var showNum = 140-Math.ceil(num/2);
			appSendmesnum.html(showNum);
			if(showNum < 0){
				appSendmesnum.addClass('app-sendmesnum-error');
				appSend.addClass('app-send-error');
				canSendMes = false;
			}else{
				appSendmesnum.removeClass('app-sendmesnum-error');
				appSend.removeClass('app-send-error');
				canSendMes = true;
			}
		}
	})
	/** app-back撤销按钮 */
	var appBack = $('#app-back');
	appBack
	.on('mousedown', function(){
		appBack.addClass('app-back-active');
	})
	.on('mouseup', function(){
		appBack.removeClass('app-back-active');
	});

	/** 滚动条 + 高度 */
	var scrollBox = $('#scroll-box'), 
		scrollContent = $('#scroll-content'),
		timeGetWinHeight, needAutoScroll = true, 
		guidTime;

	function getWinHeigh($, scrollBox){
		var winHeight = $.win.innerHeight();
		scrollBox.css('height', winHeight-137+'px');
	}
	//载入的时候计算高度
	getWinHeigh($, scrollBox);
	//调整窗口大小的时候，计算高度
	$(window).on('resize', function(){
		clearTimeout(timeGetWinHeight);
		timeGetWinHeight = setTimeout(function(){
			getWinHeigh($, scrollBox);
		}, 200);
		
	})
	var scrollObj = scroll({
		type: 'top',
		box: '#scroll-box',
		content: '#scroll-content',
		style: {
			'width': '5px',
			'background': '#333',
			'opacity': '0',
			'right': '3px',
			'border-radius': '3px'
		},
		onscroll: function(top, minScrollTop, maxScrollTop, tempTop, optionTemp){
			var self = this;
			if(!needAutoScroll){
				self.css({
					'opacity': .5,
					'z-index': 2
				});
				clearTimeout(guidTime);
				guidTime = setTimeout(function(){
					self.css('z-index', -1).stop().animate({
						'opacity': 0
					}, 300)
				}, 3000)
			}
			if(top === maxScrollTop){
				needAutoScroll = true;
			}else{
				needAutoScroll = false;
			}
		}
	}).fire();
	
	/** 用户信息的滚动条 */
	scroll({
		box: '#sider-userbox',
		content: '#sider-userlist',
		style: {
			'width': '5px',
			'background': '#333',
			'opacity': '0',
			'left': '0',
			'border-radius': '3px'
		},
		onscroll: function(top, minScrollTop, maxScrollTop, tempTop, optionTemp){
			var self = this;
			if(!needAutoScroll){
				self.css({
					'opacity': .5,
					'z-index': 2
				});
				clearTimeout(guidTime);
				guidTime = setTimeout(function(){
					$.log(1)
					self.css('z-index', -1).stop().animate({
						'opacity': 0
					}, 300)
				}, 3000)
			}
			if(top === maxScrollTop){
				needAutoScroll = true;
			}else{
				needAutoScroll = false;
			}
		}
	}).fire();

	/** app-send信息发送按钮 */
	var appSend = $('#app-send');
	appSend
	.on('mousedown', function(){
		appSend.addClass('app-send-active');
	})
	.on('mouseup', function(){
		appSend.removeClass('app-send-active');
	});

	/** app-content发送的内容 */
	var appSendmes = $("#app-sendmes"),
		appContent = $('#app-content'),
		appContentMine = $('#app-content-mine'),
		appContentDefault = $('#app-content-default'),
		titlerUsernum = $('#titler-usernum'),
		userKeyName = $('#userKeyName'), 
		siderUserlist = $('#sider-userlist');
	
	var htmlMine = appContentMine.html(), htmlDefault = appContentDefault.html(), userName;
		userName = userKeyName.prop('value');
		function doSendMes(appSendmes, appContent, html, iosocket, mes){
			if(!canSendMes)
				return;
			var outHtml, lastLi, lastTable, lastTableHeight, appContentLi;
			if(!mes){
				mes = {
					dowmMessage: $.lang(appSendmes.prop('value')).shtml().valueOf(),
					userName: userName
				}
				iosocket.emit('upMessage', 
					{ 
						upMessage: mes.dowmMessage,
						userName: mes.userName
					});
				//清除text
				appSendmes.prop('value','');
				//重置输入的字符数
				appSendmesnum.html(140);
			}
			//焦点回来
			appSendmes[0].focus();
			//如果sendVal为空就不send
			if(!mes.dowmMessage || $.lang(mes.dowmMessage).trim().valueOf() === ''){
				//清除text
				appSendmes.prop('value','');
				return;
			}
			//解析莫模板
			outHtml = templateJs(html, {
				content: mes.dowmMessage,
				imgurl: 'static/img/userimg.jpg',
				userKeyName: mes.userName
			}, '<%', '%>').outHtml();
			appContent.append(outHtml);
			//找新插入的li
			lastLi = appContent.last();
			lastTable = lastLi.children('table');
			lastTableHeight = lastTable.height();
			lastTable.css('top', lastTableHeight+'px');
			//动画
			lastTable.animate({
				opacity: 1,
				top: 0
			})
			//scroll
			if(needAutoScroll){
				appContentLi = appContent.find('li');
				//如果appContentLi的个数大于4个时候把多余4个给删除
				if(appContentLi.length > 50){
					for(var i = 0, j = appContentLi.length - 50; i < j ; i++){
						appContentLi.eq(i).remove();
					}
				}
				scrollObj.autoScroll('max');
			}
		}

		appSendmes.on('keydown', function(e){
			//控制字数

			if(e.keyCode === 13){
				doSendMes(appSendmes, appContent, htmlMine, iosocket);
			}
		})
		appSend.on('click', function(){
			doSendMes(appSendmes, appContent, htmlMine, iosocket);
		});
		iosocket.on('dowmMessage', function (data) {
			doSendMes(appSendmes, appContent, htmlDefault, iosocket, data);
		});

		
		//用户联入的时候
		iosocket.on('connect', function () {
			iosocket.emit('tellServiceUserName', 
				{ 
					userName: userName
				});
		});
		//用户登出的时候
		iosocket.on('disconnect', function (data) {
			if(data){
				titlerUsernum.html(data.userNum);
				$('#'+data.id).remove();
			}
		});
		//用户登入的时候对自己推送的消息里面有所有人的信息
		iosocket.on('tellClientUserName', function (data) {
			if(data){
				var arr = data.arr, cache = data.cache;
				titlerUsernum.html(arr.length);
				for(var i = 0, j = arr.length; i < j; i++){
					siderUserlist.append('<li id="'+arr[i]+'"><a href="javascript:" class="fn-tran">'+cache[arr[i]]+'</a></li>');
				}
			}
		});
		//用户登入的时候对别人推送的消息里面有新进入的人的信息
		iosocket.on('addClientUserName', function (data) {
			if(data){
				titlerUsernum.html(data.userNum);
				siderUserlist.append('<li id="'+data.id+'"><a href="javascript:" class="fn-tran">'+data.userName+'</a></li>');
			}
		});




})
