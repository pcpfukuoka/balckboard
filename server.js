var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

//	  io.set('transports', [
//	      'websocket'
//	    , 'flashsocket'
//	    , 'htmlfile'
//	    , 'xhr-polling'
//	    , 'jsonp-polling'
//	  ]);
io.set('transports', ['websocket']);

app.configure('development', function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});
app.configure('production', function() {
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', {
		maxAge : oneYear
	}));
	app.use(express.errorHandler());
});

app.listen(process.env.port || 3000);
const COMMANDS_MAX = 2000;
var commands = [];

function storeCommand(command) {
	if (commands.length === COMMANDS_MAX) {
		commands.shift();
	}
	commands.push(command);
}

var sockets = io.of('/chalkboard').on('connection', function(socket) {
	// 累積したコマンドをクライアントに向けて送る
	socket.emit('init', commands);
	socket.on('command', function(command) {
		command.sessionId = socket.id;
		// mouseMoveイベントは保存しない
		if (command.type !== 'mouseMove') {
			storeCommand(command);
		}
		// キャンバスをクリアする際、コマンド履歴も全てクリア
		if (command.type === 'clear') {
			commands = [];
		}
		socket.broadcast.emit('command', command);
	});
	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
