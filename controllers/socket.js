/**
 * @author somesayss
 * 控制器 
 * blog.js
 */
var url = require('url'),
	querystring = require('querystring'),
	$ = require('somesayss'),
	userKey = require('../cache').userKey;


//当页面载入的时候去获取cookie的userKeyName,然后去校验这名字是否有重复
function socketGetForName(userKey, userKeyName){
	var flag = true;
	userKey.each(function(){
		if(userKeyName == this){
			flag = false;
			return false;
		}
	});
	return flag;
}

//路由配置 聊天页面GET请求
exports.socketGet = function(query, request, response){
	var userKeyName = $.cookie(request, response).get('userKeyName');
	if(userKeyName !== undefined && socketGetForName(userKey, userKeyName)){
		this.html({
	    	userKeyName: userKeyName,
	    	uerNumber: userKey.size()
	    });
	}else{
		this.send('<script>location.href="/"</script>','text/html');
	}
};

//路由配置 聊天页面POST请求 把名字给输出出来
exports.socketPost = function(query, request, response){
	$.cookie(request, response).set('userKeyName', query.userKeyName);
    this.html({
    	userKeyName: query.userKeyName,
    	uerNumber: userKey.size()
    });
};

//路由配置 首页进入
exports.login = function(query, request, response){
	var userKeyName = $.cookie(request, response).get('userKeyName');
	if(userKeyName !== undefined && socketGetForName(userKey, userKeyName)){
		this.send('<script>location.href="/socket"</script>','text/html');
	}else{
		this.html();
	}
};


//路由配置 login页面用于确认名字的唯一 /makeSureOnlyName
exports.makeSureOnlyName = function(query){
	if(socketGetForName(userKey, query.userKeyName)){
		this.send('true');
	}else{
		this.send('false');
	}
}