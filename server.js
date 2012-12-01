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

			  console.log(command.param.now_page);
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
			    console.log("//////////////////////");
				console.log(page_move);
				socket.emit('now_page', page_move);
		  })
		  //終了ログ
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
		if(command.type == "new_page")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

			var query = connection.query(sql);
			query
			  //エラーログ
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })
			  //結果用
			  .on('result', function(rows) {

				  //現在のページ数を格納
				  var max_page = rows['page_num'];
				  var now_page = max_page + page_move;
				  page_move= 0;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = '+ now_page + ';';

				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move);

					})
					 //終了ログ
					.on('end', function() {
					   console.log('end');
					 });

				 })
				 //終了ログ
				 .on('end', function() {
					 console.log('end');
				  });


			//////////////////////////////////////////////////////////////////////
			//現在のページ数を格納
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

			query = connection.query(sql);
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
		if(command.type == "turn")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

			var query = connection.query(sql);
			query
			  //エラーログ
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })
			  //結果用
			  .on('result', function(rows) {

				  //現在のページ数を格納
				  max_page = rows['page_num'];
				  //現在表示しているページにカーソルをそろえる
				  var now_page = max_page + command.param.start.x;

				  //戻るボタンを押したため移動数マイナス１
				  command.param.start.x--;
				  if(now_page < 1){
					  page_move++;
				  }

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {
						 now_page = max_page + command.param.start.x;


						 var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = "'+ now_page + '";';
						 console.log("sql:");
						 console.log(sql3);
						 var query3 = connection.query(sql3);
						 query3
						 //エラーログ
						  .on('error', function(err) {
						    console.log('err is: ', err );
						  })
						  //結果用
						  .on('result', function(rows) {
								command.param.end.x = rows['div_url'];
								command.param.start.y = rows['canvas_url'];
								commands = [];

								storeCommand(command);
								socket.emit('now_page', command.param.start.x);
								socket.broadcast.emit('img', command);
								socket.emit('img', command);
						  })
						  //終了ログ
						  .on('end', function() {
							connection.end()
						    console.log('end');
						  });

					  })
					  //終了ログ
					  .on('end', function() {
					    console.log('end');
					  });
			  })

			  //終了ログ
			  .on('end', function() {
			    console.log('end');
			  });

		}

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15"  ORDER BY page_num DESC LIMIT 1;';

			var query = connection.query(sql);
			query
			  //エラーログ
			  .on('error', function(err) {
			    console.log('err is: ', err );
			  })
			  //結果用
			  .on('result', function(rows) {

				  //現在のページ数を格納
				  max_page = rows['page_num'];
				  //現在表示しているページにカーソルをそろえる
				  var now_page = max_page + command.param.start.x;

				  //戻るボタンを押したため移動数マイナス１
				  command.param.start.x++;
				  if(now_page > max_page){
					  page_move--;
				  }

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {
						 now_page = max_page + command.param.start.x;


						 var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = "'+ now_page + '";';
						 console.log("sql:");
						 console.log(sql3);
						 var query3 = connection.query(sql3);
						 query3
						 //エラーログ
						  .on('error', function(err) {
						    console.log('err is: ', err );
						  })
						  //結果用
						  .on('result', function(rows) {
								command.param.end.x = rows['div_url'];
								command.param.start.y = rows['canvas_url'];
								socket.emit('log_test',command);
								commands = [];

								storeCommand(command);
								socket.emit('now_page', command.param.start.x);
								socket.broadcast.emit('img', command);
								socket.emit('img', command);
						  })
						  //終了ログ
						  .on('end', function() {
							connection.end()
						    console.log('end');
						  });

					  })
					  //終了ログ
					  .on('end', function() {
					    console.log('end');
					  });
			  })

			  //終了ログ
			  .on('end', function() {
			    console.log('end');
			  });

		}
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
