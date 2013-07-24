/**
 * @author somesayss
 * 动态页面的配置
 */
var route = require('./route');

//路由配置 聊天页面GET请求
route.map({
    method:'get',
    url: /^\/socket$/i,
    controller: 'socket',
    action: 'socketGet',
    view: 'socket/index.html'
});

//路由配置 聊天页面POST请求
route.map({
    method:'post',
    url: /^\/socket$/i,
    controller: 'socket',
    action: 'socketPost',
    view: 'socket/index.html'
});

//路由配置 首页进入
route.map({
    method:'get',
    url: /^\/$/i,
    controller: 'socket',
    action: 'login',
    view: 'socket/login.html'
});



//当用户登录聊天页面的时候
route.map({
    method:'get',
    url: /^\/userCheckIn$/i,
    controller: 'socket',
    action: 'userCheckIn'
});

//当用户退出聊天页面的时候
route.map({
    method:'get',
    url: /^\/userCheckOut$/i,
    controller: 'socket',
    action: 'userCheckOut'
});

//路由配置 login页面用于确认名字的唯一 /makeSureOnlyName
route.map({
    method:'get',
    url: /^\/makeSureOnlyName$/i,
    controller: 'socket',
    action: 'makeSureOnlyName'
});


//静态文件缓存配置
exports.static = {
	fileType:/./ig,			//全部	
	maxAge: 60*60*24*365	//1年
}