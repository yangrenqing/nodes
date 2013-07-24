/**
 * @author somesayss
 * 服务层
 */
var $ = require('somesayss'),
	http = require('http'),
	querystring = require('querystring'),
	path = require('path'),
	fs = require('fs'),
	url = require('url'),
	route = require('./route'),
	config = require('./config'),
	contentTypes = require('./contentTypes').main;

/**
 * @fileoverview 服务主调用函数
 * @param {string} port 端口,默认8080
 * @param {string} ip IP,默认127.0.0.1
 */
exports.main = function(port, ip){
	port = port || '8888';
	ip = ip || '127.0.0.1';
	$.log('服务启用 ' +ip+ ':' +port);
	return http.createServer(function(request, response){
		$.log('-----------------------请求开始------------------------')
		var postData = '';
		request
		.on('data', function(data){	//这东西感觉只有post才能进去
			postData += data;
		})
		.on('end', function(){
			//如果是post请求就去解析
			$.log(postData)
			request.method === 'POST' && (request.post = querystring.parse(postRequest(request, postData)));
			handlerRequest(request, response);
		});
	}).listen(port);
}

/**
 * @fileoverview 请求处理函数
 * @param {object} request
 * @param {object} response
 */
function handlerRequest(request, response){
	var actionInfo, controller, query, method, requestURL;
	method = request.method;
	requestURL = request.url;
	actionInfo = route.getActionInfo(requestURL, method);
	if(actionInfo.action){
		$.log('输出动态，请求地址是: '+requestURL+ ' 请求方式是: '+method);
		//controller 就一个
		controller = require('./controllers/'+actionInfo.controller);
		//取出get, post对象的参数如果是GET,对URL进行反转义
		query = method === 'GET' ? querystring.parse(url.parse(unescape(requestURL)).query) : request.post;
		//action 可以多个
		controller[actionInfo.action].call(dynamicFileServer(request, response, './views/'+actionInfo.view), query, request, response);
	}else{
		$.log('输出静态，请求地址是: .'+requestURL);
		staticFileServer(request, response);
	}
}	

/**
 * @fileoverview POST请求处理函数
 * @param {object} request
 * @param {string} postData
 * @return {string} postData
 */
function postRequest(request, postData){
	var temp = request.headers['content-type'];
	if(temp.indexOf('text/plain') !== -1){
		postData = postData.replace(/\r\n/g, function(){
			return '&';
		});
		//为了确保数据是否是以'&'结尾
		return postData.charAt(postData.length) === '&' ? postData.slice(0, -1) : postData;
	}else if(temp.indexOf('application/x-www-form-urlencoded') !== -1){
		return postData;
	}else if(temp.indexOf('multipart/form-data') !== -1){
		//do something
	}else{
		//do something
	}
}

/**
 * @fileoverview 动态请求处理类 
 * @param {object} request
 * @param {object} response
 * @param {string} filePath
 */
var dynamicFileServer = function(request, response, filePath){
	return this instanceof dynamicFileServer ? this.init(request, response, filePath) : new dynamicFileServer(request, response, filePath);
}
dynamicFileServer.prototype = {
	init: function(request, response, filePath){
		this.request = request;
		this.response = response;
		this.filePath = filePath;
		this.status.self = this;
		return this;
	},
	html: function(obj){
		var self = this, filePath = self.filePath, response = self.response;
		path.exists(filePath, function(exists){
			if(!exists){
				self.status._404(response, filePath);
				return;
			}
			//读取文件
			fs.readFile(filePath, 'utf8', function(err, file){
				if(err)
					throw err;
				//模板解析
				file = $.templateJs(file, obj||{}).outHtml()
				$.log('模板解析成功: '+filePath);
				response.writeHead(200, {
					'Content-Type': 'text/html',
					'charset': 'utf-8'
				});
	            response.end(file);
			});
		});
		return self;
	},
	send: function(arg, header){
		var self = this, response = self.response;
		response.writeHead(200, {
			'Content-Type': header || 'text/plain',
			'charset': 'utf-8'
		});
        response.end(''+arg);
        return self;
	},
	status: {	//状态是静态动态公用的!!工具函数最好用入参的形式
		_404: function(response, filePath){
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});
    		response.end('Not Found: '+filePath);
		},
		_304: function(response, filePath){
			response.writeHead(304);
    		response.end();
		}
	}
}

/**
 * @fileoverview 静态文件处理类
 * @param {object} request
 * @param {object} response
 * @param {string} filePath|
 */
var staticFileServer = function(request, response, filePath){
	return this instanceof staticFileServer ? this.init(request, response, filePath) : new staticFileServer(request, response, filePath);
}
staticFileServer.prototype = {
	init: function(request, response, filePath){
		this.request = request;
		this.response = response;
		this.filePath = this.getFilePath(request, response, filePath);
		this.main();
		this.status.self = this;
		return this;
	},
	main: function(){
		var self = this, filePath = self.filePath, response = self.response, request = self.request;
		//判断 filePath 是否有这文件.
		path.exists(filePath, function(exists){
			var fileName;
			if(!exists){
				self.status._404(response, filePath);
				return;
			}
			//获取文件后缀名
			fileName = path.extname(filePath).slice(1);
			fileName = fileName ? fileName : 'html';
			fs.stat(filePath, function(err, stat){
				var lastModified, ifModifiedSince;
				lastModified = stat.mtime.toUTCString();
				ifModifiedSince = 'if-modified-since';
				//判断是 200, 还是304
				if(request.headers[ifModifiedSince] && lastModified === request.headers[ifModifiedSince]){
					self.status._304(response);
				}else{
					//读取文件
					fs.readFile(filePath, 'binary', function(err, file){
						if(err)
							throw err;
						//文件的缓存设置
						self.setCache(fileName);
						response.writeHead(200, {
							'Content-Type': contentTypes[fileName] || 'text/html',
							'charset': 'utf-8',
							'Last-Modified': lastModified
						});
			            response.end(file, 'binary');
					});
				}
			});
		})
		return self;
	},
	setCache: function(fileName){
		var self = this, onfigStatic, response = self.response, expires;
		//获取配置;
		configStatic = config.static || {
			fileType:/./ig,			//全部	
			maxAge: 60*60*24*365	//1年
		};
		if(configStatic.fileType.test(fileName)){
			expires = new Date();
			expires.setTime(expires.getTime() + configStatic.maxAge * 1000);
			response.setHeader("Expires", expires.toUTCString());
			response.setHeader("Cache-Control", "max-age=" + configStatic.maxAge);
		}
		return self;
	},
	getFilePath: function(request, response, filePath){
		if(filePath)
			return filePath;
		var pathName = url.parse(request.url).pathname;
		switch(pathName){
			case '/':
			case '/index.html': 
				filePath = './views/index.html';
				break;
			default: 
				filePath = '.'+pathName;
		}
		return filePath;
	},
	status: dynamicFileServer.prototype.status
}

/**
 * 一些备注;
 *　首先是响应那块
 *　	Expires 		到期时间			Expires: Thu, 01 Dec 1994 16:00:00 GMT;
 * 		Cache-Control	缓存控制			Cache-Control: max-age=500 (单位是秒);
 *		用法是一样的,优先级Cache-Control高;
 * 		Last-Modified	最后次修改			Last-Modified: Sun, 16 Jun 2013 13:18:11 GMT
 *  请求那块
 * 		if-modified-since	是否已经修改过 	If-Modified-Since: Sun, 16 Jun 2013 13:18:11 GMT
 *
 *	用肉眼观察, 貌似只要	Last-Modified 和 if-modified-since  拿去判断一下就OK了么....	
 */