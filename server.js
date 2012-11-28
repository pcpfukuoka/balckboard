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

var page_move = 0;






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
	socket.emit('init', commands);
	socket.on('save', function(command){
		console.log("//////////////////////////////////////");
		console.log(command.now_page);
		console.log(command.div);
		console.log(command.canvas);
	});
	//移動数をサーバー側に保持
	socket.on('page_move', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

		var query = connection.query(sql);
		query
		  //エラーログ
		  .on('error', function(err) {
		    console.log('err is: ', err );
		  })
		  //結果用
		  .on('result', function(rows) {
			  var max_page = rows['page_num'];

			  if(command.param.now_page == "next")
				{
					page_move =  page_move + 1;
				}
				else if(command.param.now_page == "turn")
				{
					page_move = page_move - 1;
				}
				else if(command.param.now_page == "refresh")
				{
					page_move = 0;
				}

			  now_page = max_page + page_move;

			  if(now_page > max_page){
				  page_move--;
			  }
			  else if(now_page < 1){
				  page_move++;
			  }

			  console.log("////////////////////");
				console.log(page_move);
				socket.emit('now_page', page_move);
		  })
		  //終了ログ
		  .on('end', function() {
		    console.log('end');
		    connection.end();
		  });
	});

	socket.on('img', function(command){

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
			    console.log('ログ用');
				storeCommand(command);
				socket.broadcast.emit('img', command);
			  socket.emit('command', command);
		  })

		  //終わったよう～
		  .on('end', function() {
		    console.log('end');
			connection.end();

		  });

	});

	socket.on('command', function(command) {
		command.sessionId = socket.id;

		// clearならば
		if (command.type === 'clear') {
			commands = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type !== 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands = [];
		};



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

		};

		if(command.type == 'next')
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});

			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

			var query = connection.query(sql);
			query
			  //エラーログ
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })
			  //結果用
			  .on('result', function(rows) {
				  var a = rows['page_num'];
				  a++;

				  //テーブルにデータのひな形の追加
				  var sql2 = 'INSERT INTO board VALUES (0,now(),15,15,'+a+',0,0);';

				  var query2 = connection.query(sql2);
					  query2
					  //エラー用
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					   connection.end();
			  })
			  //終了ログ
			  .on('end', function() {
			    console.log('end');
			  });
			socket.broadcast.emit('next',command);
			socket.emit('next',command);


		};
		if(command.type == 'count')
		{

		};

		if(command.type == "new_page")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});

			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

			var query = connection.query(sql);
			query
			  //エラーログ
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })
			  //結果用
			  .on('result', function(rows) {
				  var a = rows['page_num'];
				  a++;

				  //テーブルにデータのひな形の追加
				  var sql2 = 'INSERT INTO board VALUES (0,now(),15,15,'+a+',0,0);';

				  var query2 = connection.query(sql2);
					  query2
					  //エラー用
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					   connection.end();
			  })
			  //終了ログ
			  .on('end', function() {
			    console.log('end');
			  });
			socket.broadcast.emit('next',command);
			socket.emit('next',command);

		}



	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
