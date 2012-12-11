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

	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "1" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15";';

		var query = connection.query(sql);
		query
		 //エラーログ
		  .on('error', function(err) {
		    console.log('err is: ', err );
		  })
		  //結果用
		  .on('result', function(rows) {
			console.log("aaa");
		  })
		  //終了ログ
		  .on('end', function() {
		    console.log('end');
		    connection.end();
		  });
		socket.broadcast.emit('page_jump',command);
		socket.emit('page_jump',command);


	});

	//移動数をサーバー側に保持
	socket.on('enter', function(command){
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

			  var aaa= max_page-page_move -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = ' + now_page + ';';

			  var query2 = connection.query(sql2);
			  	query2
			  	//エラーログ
			  	.on('error', function(err) {
			  		console.log('err is: ', err );
			  	})
			  	//結果用
			  	.on('result', function(rows) {
			  		var send = new Object();
			  		send['div_url'] = rows['div_url'];
			  		send['page_move'] = page_move;
					socket.emit('enter', send);

			  	})
			  	//終了ログ
			  	.on('end', function() {
			  		console.log('end');
			  	});
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
			socket.emit("tag_test",command.param.start.x);
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
				  var now_page = max_page -(max_page- command.param.start.x - 1);
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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),15,15,'+a+',0,0,0);';

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
				  var aaa= max_page-page_move -1;
				  var now_page = max_page -aaa;

				  //戻るボタンを押したため移動数-１
				  page_move--;
				  if(now_page < 1){
					  page_move++;
					  now_page = 1;
				  }
				  socket.emit('log_test',now_page);

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = '+ now_page + ';';
					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {
						  var aaa= max_page-page_move -1;
						  now_page = max_page -aaa;



						 var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = "'+ now_page + '";';

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
								socket.emit('now_page', page_move);
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
				  var now_page = max_page -(max_page - page_move -1);
				  socket.emit('log_test',now_page);
				  //進むボタンを押したため移動数＋１
				  page_move++;
				  if(now_page > max_page){
					  page_move--;
					  now_page--;
				  }
				  socket.emit('log_test',now_page);

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "15" AND subject_seq = "15" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move -1;
						 now_page = max_page -aaa;

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
								socket.emit('now_page', page_move);
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
