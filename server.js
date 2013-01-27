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
//１教室分の変数
var commands1 = [];
var page_move1 = 0;
//１教室分の変数
var commands2 = [];
var page_move2 = 0;
//１教室分の変数
var commands3 = [];
var page_move3 = 0;
//１教室分の変数
var commands4 = [];
var page_move4 = 0;
//１教室分の変数
var commands5 = [];
var page_move5 = 0;
//１教室分の変数
var commands6 = [];
var page_move6 = 0;
//１教室分の変数
var commands7 = [];
var page_move7 = 0;
//１教室分の変数
var commands8 = [];
var page_move8 = 0;
//１教室分の変数
var commands9 = [];
var page_move9 = 0;
//１教室分の変数
var commands10 = [];
var page_move10 = 0;
//１教室分の変数
var commands11 = [];
var page_move11 = 0;
//１教室分の変数
var commands12 = [];
var page_move12 = 0;
//１教室分の変数
var commands13 = [];
var page_move13 = 0;
//１教室分の変数
var commands14 = [];
var page_move14 = 0;
//１教室分の変数
var commands15 = [];
var page_move15 = 0;
//１教室分の変数
var commands16 = [];
var page_move16 = 0;
//１教室分の変数
var commands17 = [];
var page_move17 = 0;
//１教室分の変数
var commands18 = [];
var page_move18 = 0;


var sockets = io.of('/1').on('connection', function(socket) {

	socket.emit('init', commands1);
	function storeCommand(command) {
		if (commands1.length == COMMANDS_MAX) {
			commands1.shift();
		}
		commands1.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move1 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move1'] = page_move1;
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
		if (command.type == 'clear') {
			commands1 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands1 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move1 -1;
				  var now_page = max_page -aaa;

				  page_move1= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move1);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move1 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move1--;
					if(now_page == 1){
						page_move1++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move1 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands1 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move1);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move1 -1);

				  //進むボタンを押したため移動数＋１
				  page_move1++;
				  if(now_page == max_page){
					  page_move1--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move1 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands1 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move1);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが２番目の処理
var sockets = io.of('/2').on('connection', function(socket) {

	socket.emit('init', commands2);
	function storeCommand(command) {
		if (commands2.length == COMMANDS_MAX) {
			commands2.shift();
		}
		commands2.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});

		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move2 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move2'] = page_move2;
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
		if (command.type == 'clear') {
			commands2 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands2 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move2 -1;
				  var now_page = max_page -aaa;

				  page_move2= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move2);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move2 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move2--;
					if(now_page == 1){
						page_move2++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move2 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands2 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move2);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move2 -1);

				  //進むボタンを押したため移動数＋１
				  page_move2++;
				  if(now_page == max_page){
					  page_move2--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move2 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands2 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move2);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});

//group_seqが３番目の処理
var sockets = io.of('/3').on('connection', function(socket) {

	socket.emit('init', commands3);
	function storeCommand(command) {
		if (commands3.length == COMMANDS_MAX) {
			commands3.shift();
		}
		commands3.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});

		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move3 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move3'] = page_move3;
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
		if (command.type == 'clear') {
			commands3 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands3 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move3 -1;
				  var now_page = max_page -aaa;

				  page_move3= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move3);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move3 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move3--;
					if(now_page == 1){
						page_move3++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move3 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands3 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move3);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move3 -1);

				  //進むボタンを押したため移動数＋１
				  page_move3++;
				  if(now_page == max_page){
					  page_move3--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move3 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands3 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move3);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが４番目の処理
var sockets = io.of('/4').on('connection', function(socket) {

	socket.emit('init', commands4);
	function storeCommand(command) {
		if (commands4.length == COMMANDS_MAX) {
			commands4.shift();
		}
		commands4.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move4 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move4'] = page_move4;
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
		if (command.type == 'clear') {
			commands4 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands4 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move4 -1;
				  var now_page = max_page -aaa;

				  page_move4= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move4);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move4 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move4--;
					if(now_page == 1){
						page_move4++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move4 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands4 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move4);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move4 -1);

				  //進むボタンを押したため移動数＋１
				  page_move4++;
				  if(now_page == max_page){
					  page_move4--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move4 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands4 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move4);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが５番目の処理
var sockets = io.of('/5').on('connection', function(socket) {

	socket.emit('init', commands5);
	function storeCommand(command) {
		if (commands5.length == COMMANDS_MAX) {
			commands5.shift();
		}
		commands5.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move5 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move5'] = page_move5;
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
		if (command.type == 'clear') {
			commands5 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands5 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move5 -1;
				  var now_page = max_page -aaa;

				  page_move5= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move5);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move5 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move5--;
					if(now_page == 1){
						page_move5++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move5 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands5 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move5);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move5 -1);

				  //進むボタンを押したため移動数＋１
				  page_move5++;
				  if(now_page == max_page){
					  page_move5--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move5 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands5 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move5);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが６番目の処理
var sockets = io.of('/6').on('connection', function(socket) {

	socket.emit('init', commands6);
	function storeCommand(command) {
		if (commands6.length == COMMANDS_MAX) {
			commands6.shift();
		}
		commands6.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move6 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move6'] = page_move6;
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
		if (command.type == 'clear') {
			commands6 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands6 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move6 -1;
				  var now_page = max_page -aaa;

				  page_move6= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move6);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move6 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move6--;
					if(now_page == 1){
						page_move6++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move6 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands6 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move6);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move6 -1);

				  //進むボタンを押したため移動数＋１
				  page_move6++;
				  if(now_page == max_page){
					  page_move6--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move6 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands6 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move6);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが７番目の処理
var sockets = io.of('/7').on('connection', function(socket) {

	socket.emit('init', commands7);
	function storeCommand(command) {
		if (commands7.length == COMMANDS_MAX) {
			commands7.shift();
		}
		commands7.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move7 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move7'] = page_move7;
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
		if (command.type == 'clear') {
			commands7 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands7 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move7 -1;
				  var now_page = max_page -aaa;

				  page_move7= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move7);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move7 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move7--;
					if(now_page == 1){
						page_move7++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move7 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands7 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move7);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move7 -1);

				  //進むボタンを押したため移動数＋１
				  page_move7++;
				  if(now_page == max_page){
					  page_move7--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move7 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands7 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move7);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが８番目の処理
var sockets = io.of('/8').on('connection', function(socket) {

	socket.emit('init', commands8);
	function storeCommand(command) {
		if (commands8.length == COMMANDS_MAX) {
			commands8.shift();
		}
		commands8.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move8 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move8'] = page_move8;
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
		if (command.type == 'clear') {
			commands8 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands8 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move8 -1;
				  var now_page = max_page -aaa;

				  page_move8= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move8);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move8 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move8--;
					if(now_page == 1){
						page_move8++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move8 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands8 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move8);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move8 -1);

				  //進むボタンを押したため移動数＋１
				  page_move8++;
				  if(now_page == max_page){
					  page_move8--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move8 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands8 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move8);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが９番目の処理
var sockets = io.of('/9').on('connection', function(socket) {

	socket.emit('init', commands9);
	function storeCommand(command) {
		if (commands9.length == COMMANDS_MAX) {
			commands9.shift();
		}
		commands9.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});
		//現在のページを保存する
		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2",canvas_url="'+command.param.end.x+'", div_url="'+command.param.start.y+'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.y.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move9 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move9'] = page_move9;
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
		if (command.type == 'clear') {
			commands9 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands9 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move9 -1;
				  var now_page = max_page -aaa;

				  page_move9= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move9);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move9 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move9--;
					if(now_page == 1){
						page_move9++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move9 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands9 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move9);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move9 -1);

				  //進むボタンを押したため移動数＋１
				  page_move9++;
				  if(now_page == max_page){
					  page_move9--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move9 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands9 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move9);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１０番目の処理
var sockets = io.of('/10').on('connection', function(socket) {

	socket.emit('init', commands10);
	function storeCommand(command) {
		if (commands10.length == COMMANDS_MAX) {
			commands10.shift();
		}
		commands10.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move10 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move10'] = page_move10;
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
		if (command.type == 'clear') {
			commands10 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands10 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move10 -1;
				  var now_page = max_page -aaa;

				  page_move10= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move10);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move10 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move10--;
					if(now_page == 1){
						page_move10++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move10 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands10 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move10);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move10 -1);

				  //進むボタンを押したため移動数＋１
				  page_move10++;
				  if(now_page == max_page){
					  page_move10--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move10 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands10 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move10);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});

//group_seqが１１番目の処理
var sockets = io.of('/11').on('connection', function(socket) {

	socket.emit('init', commands11);
	function storeCommand(command) {
		if (commands11.length == COMMANDS_MAX) {
			commands11.shift();
		}
		commands11.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move11 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move11'] = page_move11;
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
		if (command.type == 'clear') {
			commands11 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands11 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move11 -1;
				  var now_page = max_page -aaa;

				  page_move11= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move11);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move11 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move11--;
					if(now_page == 1){
						page_move11++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move11 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands11 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move11);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move11 -1);

				  //進むボタンを押したため移動数＋１
				  page_move11++;
				  if(now_page == max_page){
					  page_move11--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move11 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands11 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move11);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１２の処理
var sockets = io.of('/12').on('connection', function(socket) {

	socket.emit('init', commands12);
	function storeCommand(command) {
		if (commands12.length == COMMANDS_MAX) {
			commands12.shift();
		}
		commands12.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move12 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move12'] = page_move12;
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
		if (command.type == 'clear') {
			commands12 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands12 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move12 -1;
				  var now_page = max_page -aaa;

				  page_move12= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move12);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move12 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move12--;
					if(now_page == 1){
						page_move12++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move12 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands12 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move12);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move12 -1);

				  //進むボタンを押したため移動数＋１
				  page_move12++;
				  if(now_page == max_page){
					  page_move12--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move12 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands12 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move12);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１３番目の処理
var sockets = io.of('/13').on('connection', function(socket) {

	socket.emit('init', commands13);
	function storeCommand(command) {
		if (commands13.length == COMMANDS_MAX) {
			commands13.shift();
		}
		commands13.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move13 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move13'] = page_move13;
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
		if (command.type == 'clear') {
			commands13 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands13 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move13 -1;
				  var now_page = max_page -aaa;

				  page_move13= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move13);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move13 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move13--;
					if(now_page == 1){
						page_move13++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move13 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands13 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move13);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move13 -1);

				  //進むボタンを押したため移動数＋１
				  page_move13++;
				  if(now_page == max_page){
					  page_move13--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move13 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands13 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move13);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１４番目の処理
var sockets = io.of('/14').on('connection', function(socket) {

	socket.emit('init', commands14);
	function storeCommand(command) {
		if (commands14.length == COMMANDS_MAX) {
			commands14.shift();
		}
		commands14.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move14 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move14'] = page_move14;
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
		if (command.type == 'clear') {
			commands14 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands14 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move14 -1;
				  var now_page = max_page -aaa;

				  page_move14= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move14);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move14 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move14--;
					if(now_page == 1){
						page_move14++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move14 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands14 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move14);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move14 -1);

				  //進むボタンを押したため移動数＋１
				  page_move14++;
				  if(now_page == max_page){
					  page_move14--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move14 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands14 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move14);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１５番目の処理
var sockets = io.of('/15').on('connection', function(socket) {

	socket.emit('init', commands15);
	function storeCommand(command) {
		if (commands15.length == COMMANDS_MAX) {
			commands15.shift();
		}
		commands15.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move15 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move15'] = page_move15;
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
		if (command.type == 'clear') {
			commands15 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands15 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move15 -1;
				  var now_page = max_page -aaa;

				  page_move15= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move15);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move15 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move15--;
					if(now_page == 1){
						page_move15++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move15 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands15 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move15);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move15 -1);

				  //進むボタンを押したため移動数＋１
				  page_move15++;
				  if(now_page == max_page){
					  page_move15--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move15 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands15 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move15);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１６番目の処理
var sockets = io.of('/16').on('connection', function(socket) {

	socket.emit('init', commands16);
	function storeCommand(command) {
		if (commands16.length == COMMANDS_MAX) {
			commands16.shift();
		}
		commands16.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move16 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move16'] = page_move16;
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
		if (command.type == 'clear') {
			commands16 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands16 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move16 -1;
				  var now_page = max_page -aaa;

				  page_move16= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move16);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move16 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move16--;
					if(now_page == 1){
						page_move16++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move16 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands16 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move16);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move16 -1);

				  //進むボタンを押したため移動数＋１
				  page_move16++;
				  if(now_page == max_page){
					  page_move16--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move16 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands16 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move16);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１７番目の処理
var sockets = io.of('/17').on('connection', function(socket) {

	socket.emit('init', commands17);
	function storeCommand(command) {
		if (commands17.length == COMMANDS_MAX) {
			commands17.shift();
		}
		commands17.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move17 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move17'] = page_move17;
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
		if (command.type == 'clear') {
			commands17 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands17 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move17 -1;
				  var now_page = max_page -aaa;

				  page_move17= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move17);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move17 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move17--;
					if(now_page == 1){
						page_move17++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move17 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands17 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move17);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move17 -1);

				  //進むボタンを押したため移動数＋１
				  page_move17++;
				  if(now_page == max_page){
					  page_move17--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move17 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands17 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move17);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
//group_seqが１８番目の処理
var sockets = io.of('/18').on('connection', function(socket) {

	socket.emit('init', commands18);
	function storeCommand(command) {
		if (commands18.length == COMMANDS_MAX) {
			commands18.shift();
		}
		commands18.push(command);
	}


	//授業終了の時
	socket.on('end_class', function(command){
		var connection = mysql.createConnection({
			  host     : 'localhost', //接続先ホスト
			  user     : 'pcp',      //ユーザー名
			  password : 'pcp2012',  //パスワード
			  database : 'pcp2012'    //DB名
			});


		//end_flagを１にして使用させないようにする
		var sql = 'UPDATE board SET end_flg = "2" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.group_seq+'" AND subject_seq = "'+command.subject+'" AND end_flg="1";';

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
	//描画許可を出す際の処理
	socket.on('white_par', function(command){
		//描く事が許可されたuser_seq
		var par_user = command.param;
		socket.emit('white_par',par_user);
		//本番はブロードキャスト
		//socket.broadcast.emit('white_par',par_user);

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
		var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.seq_array.group_seq+'" AND end_flg= "1" AND subject_seq ="'+command.param.seq_array.subject+'" ORDER BY page_num DESC LIMIT 1;';

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

			  var aaa= max_page-page_move18 -1;
			  var now_page = max_page -aaa;


			  var sql2 = 'SELECT div_url FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg= "1" AND class_seq = "'+command.param.seq_array.group_seq+'" AND subject_seq ="'+command.param.seq_array.subject+'"AND page_num = ' + now_page + ';';
			  console.log(sql2);
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
			  		send['page_move18'] = page_move18;
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
		if (command.type == 'clear') {
			commands18 = [];

		}

		socket.broadcast.emit('command', command);

		// mousemove以外をログとして保存
		if (command.type != 'mouseMove') {
			storeCommand(command);
		}

		if(command.type == 'reset')
		{

			commands18 = [];
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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

				  var aaa= max_page-page_move18 -1;
				  var now_page = max_page -aaa;

				  page_move18= max_page;

				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg ="1" AND page_num = '+ now_page + ';';
				  socket.emit('log_test',sql2);
				  	var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					 .on('result', function(rows) {

							socket.emit('now_page', page_move18);

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
			sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
				  var sql2 = 'INSERT INTO board VALUES (0,now(),'+command.param.end.y.group_seq+','+command.param.end.y.subject+','+a+',0,0,1);';

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
			socket.emit('id_controle',command);
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
			var sql = 'SELECT page_num FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND end_flg="1" ORDER BY page_num DESC LIMIT 1;';

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
					//現在表示しているページにカーソルをそろえる
					var aaa= max_page-page_move18 -1;
					var now_page = max_page -aaa;
					//戻るボタンを押したため移動数-１
					page_move18--;
					if(now_page == 1){
						page_move18++;
					}

				 var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND  date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';
				 var query2 = connection.query(sql2);
					query2
						//エラーログ
						.on('error', function(err) {
							console.log('err is: ', err );
						})
						//結果用
						.on('result', function(rows) {

							var aaa= max_page-page_move18 -1;
							now_page = max_page -aaa;

							var sql3 = 'SELECT * FROM board WHERE date = DATE_FORMAT(now(),"%Y-%m-%d") AND end_flg="1" AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';
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
							commands18 = [];


							command.type= "img";
							command.param.start.x = "save";
							storeCommand(command);
							socket.emit('now_page', page_move18);

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
		socket.emit('id_controle',command);

		if(command.type == "next")
		{
			var connection = mysql.createConnection({
				  host     : 'localhost', //接続先ホスト
				  user     : 'pcp',      //ユーザー名
				  password : 'pcp2012',  //パスワード
				  database : 'pcp2012'    //DB名
				});
			//現在のページ数をとってくるＳＱＬ
			var sql = 'SELECT page_num FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'"  ORDER BY page_num DESC LIMIT 1;';

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
				  var now_page = max_page -(max_page - page_move18 -1);

				  //進むボタンを押したため移動数＋１
				  page_move18++;
				  if(now_page == max_page){
					  page_move18--;
				  }


				  var sql2 = 'UPDATE board SET div_url = "'+ command.param.start.y + '", canvas_url = "'+ command.param.end.x +'" WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = '+ now_page + ';';

					var query2 = connection.query(sql2);
					query2
					  //エラーログ
					  .on('error', function(err) {
					    console.log('err is: ', err );
					  })
					  //結果用
					  .on('result', function(rows) {


						 var aaa= max_page-page_move18 -1;
						 now_page = max_page -aaa;

						 var sql3 = 'SELECT * FROM board WHERE end_flg="1" AND date = DATE_FORMAT(now(),"%Y-%m-%d") AND class_seq = "'+command.param.end.y.group_seq+'" AND subject_seq = "'+command.param.end.y.subject+'" AND page_num = "'+ now_page + '";';

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
								commands18 = [];


								command.type= "img";
								command.param.start.x = "save";
								storeCommand(command);
								socket.emit('now_page', page_move18);
								socket.emit('log_test',command);
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
		socket.emit('id_controle',command);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('leave', socket.id);
	});
});
