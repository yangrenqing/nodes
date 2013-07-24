som.config({
	query:{				//插件调用
		somesayss:{
			url:'../common/somesayss.js',
			exports:'somesayss'
		},
		jquery:{
			url:'../common/jquery.js',
			exports:'jQuery'
		},
		socket: {
			url: '/socket.io/socket.io.js',
			exports: 'io'
		}	
	},
	short:{}
})