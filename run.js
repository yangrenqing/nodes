/**
 * git test
 * @author somesayss
 * 主启动
 */
var io = require('socket.io'),
 	server = require('./service').main(),
 	$ = require('somesayss'),
 	userKey = require('./cache').userKey;

io.listen(server).on('connection', function(socket){
 	//在哈希标准存入ID;
 	userKey.put(socket.id, null);

 	//客户端传给服务器名字
 	socket.on('tellServiceUserName', function (data) {
		userKey.put(socket.id, data.userName);
		//给客户端
	 	socket.emit('tellClientUserName', userKey);	
		socket.broadcast.emit('addClientUserName', {
			id: socket.id,
			userName: userKey.get(socket.id),
			userNum: userKey.size()
		});
	});

 	

	//发送消息
	socket.on('upMessage', function (data) {
		socket.broadcast.emit('dowmMessage', 
			{ 
				dowmMessage: data.upMessage,
				userName: data.userName
			});
	});

	//当有用户断开连接
	socket.on('disconnect', function () {
		userKey.remove(socket.id);
		socket.broadcast.emit('disconnect', {
			id: socket.id,
			mess: '用户退出: ' + socket.id,
			userNum: userKey.size(),
			arr: userKey.toString()
		});
	});

 		/*
 		//当用户链接服务器时候的推送
 		socket.broadcast.emit('connect', {'hello':'world'});
 		//当用户链接发送消息时的推送
		socket.on('message', function (msg) {

	        socket.broadcast.emit('message', 
	        	{
	        		msg: msg.mes,
	        		name: msg.name
	        	});
	    });
	    //当用户链接离开服务器时的推送
	    socket.on('closed', function (msg) {
	         socket.broadcast.emit('closed', msg);
	    });*/
});