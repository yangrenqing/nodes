define(function(require, exports){
	var $ = require('somesayss');

	var loginName = $('#login-name'), loginSurer = $('#login-surer'), loginMes = $('#login-mes'), flag = true;
	//代码防御
	if(loginName.length && loginSurer.length && loginMes.length){
		//载入的时候定位焦点
		loginName[0].focus();
		function ajaxToMakeSure($, loginName){
			var userKeyName;
			userKeyName = $.trim(loginName.prop('value'));
			if(userKeyName === ''){
				loginName.prop('value' , '')
				return;
			}
			//ajax的标记
			if(!flag){
				return;
			}
			flag = false;
			//ajax
			$.ajax({
				url:'/makeSureOnlyName',
				data:{'userKeyName': userKeyName},
				cache: false,
				success: function(text){
					if(text === 'true'){
						loginName.prop('form').submit();
					}else{
						loginMes.removeClass('fn-hide');
					}
				},
				complete: function(){
					flag = true
				}
			});
		}
		loginSurer
		.on('click', function(){
			ajaxToMakeSure($, loginName)
		})
		.on('mousedown', function(){
			loginSurer.addClass('app-send-active');
		})
		.on('mouseup', function(){
			loginSurer.removeClass('app-send-active');
		});
		loginName.on('keydown', function(e){
			if(e.keyCode === 13){
				e.preventDefault();
				ajaxToMakeSure($, loginName);
			}
		});

	}




})
