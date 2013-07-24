/**
 * @author somesayss
 * 路由层
 */

 var parseURL = require('url').parse,
 	 routes = {get: [], post: []};

/**
 * 注册route规则
 * 示例：
 * route.map({
 *     method:'get',
 *     action: 'showBlogPost',
 *     url: /\/blog\/post\/(\d+)\/?$/i,
 *     controller: 'blog',
 * 	   view: 'index.html'
 * })
 */
exports.map = function(obj){
	var method;
	if(obj && obj.url && obj.controller){
		method = obj.method ? obj.method.toLowerCase() : 'get';
		routes[method].push({
			url: obj.url,
			action: obj.action || 'index',
			controller: obj.controller,
			view: obj.view
		})
	}
}

exports.getActionInfo = function(url, method){
	var val, pathname, route, i = 0;
	val = {action: null, controller: null};
	method = method ? method.toLowerCase() : 'get';
	pathname = parseURL(url).pathname;
	route = routes[method];
	for(;i < route.length; ++i){
		if(route[i].url.test(pathname)){
			val.action = route[i].action;
			val.controller = route[i].controller;
			val.view = route[i].view;
			break;
		}
	}
	return val;
}