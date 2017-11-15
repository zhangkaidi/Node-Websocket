var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ejs = require('ejs'); 

var routes = require('./routes/index');

var PORT = 3000; //端口号
var num = 0; // 在线人数
var users={}; //存储用户信息


app.use('/', express.static(__dirname + '/public')); 

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use('/', routes);

//socket 链接
io.on('connection', function(socket){
	//登录用户
	socket.on('login',function(data){
		socket.name=data;
		//在线人数
	    if(users.hasOwnProperty(socket.name)){
	    	console.log('用户名重复！');
	    	return;
	    	}else{
	    		num++;
	    		users[socket.name] = socket.id;
	    		io.emit('num',num);
			    io.emit('loginback',users);
	    	}
	})
	//消息处理
	socket.on('message',function(data){
		data.name=socket.name;
		socket.emit('system',data);
	  	socket.broadcast.emit('msgback',data);
	});
	//私聊
	socket.on('private message', function (data) {  
		data.name=socket.name;
		var id = users[data.priUser];
		io.to(id).emit("pri message",data); 
  	}); 
	//断开链接
	socket.on('disconnect',function(data){
	    if(users.hasOwnProperty(socket.name)){
		    delete users[socket.name] ;
		    num--;
		    io.emit('num',num);
		    io.emit('loginback',users);
			console.log('a user disconnected');
	    }
    })
});

//监听端口
http.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

    