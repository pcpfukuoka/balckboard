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

var mysql = require('mysql');





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
	// 邏ｯ遨阪＠縺溘さ繝槭Φ繝峨ｒ繧ｯ繝ｩ繧､繧｢繝ｳ繝医↓蜷代¢縺ｦ騾√ｋ
	socket.emit('init', commands);
	socket.on('command', function(command) {
		command.sessionId = socket.id;
		// mouseMoveならば�
		if (command.type !== 'mouseMove') {
			storeCommand(command);
		}
		// clearならば
		if (command.type === 'clear') {
			commands = [];
		}

		if(command.type == 'img')
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});


			//SQL文を書く
			//var sql = 'SELECT * FROM board
			var sql = 'SELECT * FROM board WHERE board_seq = "499";';

			var query = connection.query(sql);

			//あとはイベント発生したらそれぞれよろしくねっ
			query
			  //エラー用
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })

			  //結果用
			  .on('result', function(rows) {
				  command.param.start.y = rows['board_img'];
				  console.log("画像のＵＲＬは");
				  console.log(command.param.start.y);
				  console.log("です");
			  })

			  //終わったよう～
			  .on('end', function() {
			    console.log('end');
				connection.end();
			  });
			socket.emit('command', command);
			socket.broadcast.emit('command', command);
		}






		if(command.type == 'reset')
		{

			commands = [];
		}
		if(command.type == 'save')
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});


			//SQL文を書く
			var sql = 'INSERT INTO board VALUES (0,?);';

			var query = connection.query(sql,[command.param.color]);

			//あとはイベント発生したらそれぞれよろしくねっ
			query
			  //エラー用
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })

			  //結果用
			  .on('result', function(rows) {
			    console.log('The res is: ', rows['user_name'] );
			  })

			  //終わったよう～
			  .on('end', function() {
			    console.log('end');
				connection.end();
			  });

		}


	});
	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
