
onAppReady(function(param) {

	/* 指定したcookieを取得する関数 */
	function GetCookie(name)
	{
	    var result = null;

	    var cookieName = name + '=';
	    var allcookies = document.cookie;

	    var position = allcookies.indexOf( cookieName );
	    if( position != -1 )
	    {
	        var startIndex = position + cookieName.length;

	        var endIndex = allcookies.indexOf( ';', startIndex );
	        if( endIndex == -1 )
	        {
	            endIndex = allcookies.length;
	        }

	        result = decodeURIComponent(
	            allcookies.substring( startIndex, endIndex ) );
	    }

	    return result;
	}
	/* cookieを特定の文字列に分割しそれぞれに格納 */
	var subject_seq=GetCookie('subject_seq');
	var user_seq=GetCookie('user_seq');
	var group_seq=GetCookie('group_seq');

	var seq_array={subject:user_seq,subject:subject_seq};
	$("body").append('<input type="hidden"value='+user_seq+' id="user">');

	/* 入室した際に作成者か閲覧者かのflag*/
	var flg=GetCookie('flg');

	/* 書き込みflagか書き込み不可flagを入れる */
	var draw_per=flg;

	/* flgがtrueの場合、buttonを表示させる */
	if(flg){
		var e='<input id="all" value="全クリア" type="button">'
		+'<input id="test" value="テスト(戻る)" type="button">'
 		+'<input id="test2" value="テスト（次へ）"type="button">'
 		+'<input id="test3" value="テスト（新規作成）"type="button">'
 		+'<input id="test4" value="テスト（div変更）"type="button">'
 		+'<br>'
 		+'<input id="end" value="授業終了"type="button">';
		$("#button").append(e);

		//クラステーブルを生成する処理
		$.post('http://49.212.201.99/pcp2012/lib/student_list.php', {
	        id : group_seq
	    },
	    //戻り値として、user_seq受け取る
	    function(rs) {

	    	var parsers = JSON.parse(rs);

	    	//縦と横の最大数を格納
	    	var row_max=Number(parsers["row_max"]);
	    	var col_max=Number(parsers["col_max"]);

	    	//一列ごとに配列に格納
	    	var seq_rows =parsers["seq"].split("r");
	    	var name_rows =parsers["name"].split("r");

	    	var seq_cols;
	    	var name_cols;

	    	var  e='<table border="4" align="center" bgcolor="#FFE7CE" bordercolor="#DC143C">';

	    	//１列目（教卓を追加するs処理）
	    	e=e +"<tr>"
	    		+"<td class='sample'width='100'></td>"
	    		+"<td class='sample'width='100'value='教卓'></td>"
	    		+"<td class='sample'width='100'></td>"
	    		+"</tr>";
	    	for(i =0;i<row_max;i++)
	    	{
	    		e=e+'<tr>';
	    		//識別子ごとに配列を分割
	    		seq_cols =seq_rows[i].split("n");
		    	name_cols =name_rows[i].split("n");

	    		for(j =0;j<col_max;j++)
	    		{
	    			if(seq_cols[j] == "null")
	    			{
	    				//空席の場合の処理
	    				e=e+"<td class='sample'width='100'></td>";
	    			}
	    			else
	    			{
	    				//通常の座席の処理
	    				e=e+'<td><input type="button" data-id="'+seq_cols[j]+'" id="Attendance_'+seq_cols[j]+'" class="white_par" value="'+name_cols[j]+'"></td>';
	    			}
	    		}
	    		e=e+'</tr>';
	    	}
	    	e=e+'</table>';

	    	$("#student_list").append(e);
	    });
	}



	$(function(){
		/* 半透明レイヤー（galyLayer）とモーダルウィンドーの追加*/
	    $("body").append("<div id='glayLayer'></div><div id='overLayer'></div>");


        $("#glayLayer").click(function(){
	        $(this).hide();
	        $("#overLayer").hide();
	    });


	    $("test4").click(function(){
	    	var url_num = use_div_url.lengh;
	    	$("#glayLayer").show();
	    	$("#overLayer").html("<ul>");
	    	for(i=0;i<url_num; i++){
	    		$("#overLayer").html("<li>");
	    		$("#overLayer").html("<img src='"+ ｄｂから持ってきた配列のＵＲＬ+" class='bg_img'/>");
	    		$("#overLayer").html("</li>");
	    	};
	    	$("#overLayer").show();
	    	$("#overLayer").html("</ul>");
	    });

	    if($.browser.msie && $.browser.version<7){
	        $(window).scroll(function(){
	            $("#glayLayer").css('top',$(document).scrollTop());
	            $("#overLayer").css('top',($(document).scrollTop()+$(window).height()/2) +"px");
	        });
	    }

	    $(".bg_img").click(function(){
	    	var divSrc = $(this).attr("src");
	        $("#overLayer").hide();
	        $("#glayLayer").hide();
	        use_div_url = divSrc;
	        var bg_div = document.getElementById("chalkboard");
	        bg_div.style.background = use_div_url;

	    });
	});


	var use_div_url = new Object();
	var now_moving = 0;
	var msg = modernizr([
		'canvas', 'websockets',
		'fontface', 'opacity', 'borderradius', 'boxshadow'
	]);
	if(msg.length > 0){ alert(msg.join('\n')); }
	//clock();


	// show images
	var imgLoadTimer = setTimeout(function(){
		$('.fadeIn').fadeIn(8000);
		clearTimeout(imgLoadTimer);
		imgLoadTimer = null;
	}, 2000);
	//var canvas = document.getElementById("canvas");
	//var ctx = canvas.getContext("2d");
	var canvas = $("#canvas");
	var ctx = canvas[0].getContext("2d");

	var loadedImages = param.loadedImages;
	var LINE_PATTERNS = {
		pink : ctx.createPattern(loadedImages[0], 'repeat'),
		blue : ctx.createPattern(loadedImages[1], 'repeat'),
		white : ctx.createPattern(loadedImages[2], 'repeat'),
		green : ctx.createPattern(loadedImages[3], 'repeat'),
		yellow : ctx.createPattern(loadedImages[4], 'repeat')
	};

	/*キャンバスの初期値を設定 */
	var drawing = false;
	var eracing = false;
	var prevX = 0;
	var prevY = 0;
	var lineWidth = 4;
	var color = "white";

	/* 現在の日付を黒板に書く*/
	$(function() {
		var now = new Date;
		var month = now.getMonth() + 1;
		var date = now.getDate();
		$('#monthOnBoard').text(month);
		$('#dateOnBoard').text(date);
	});

	var effects = {
		_audio: {},
		play: function(type){
			if(!this._audio[type]){ return; }
			if(this._audio[type].currentTime){ this._audio[type].currentTime = 0; }
			this._audio[type].play();
		},
		stop: function(type){
			if(!this._audio[type]){ return; }
			this._audio[type].pause();
		},
		_init: function(){
			this._audio.chalkMouseDown = new Audio();
			this._audio.chalkMouseDown.src = 'audios/chalk.mp3';
			this._audio.chimeStart = new Audio();
			this._audio.chimes = new Audio();
			this._audio.chimes.src = 'audios/chimes.mp3';
		}
	};
	effects._init();
	//effects.play('chimes');

	/*
	 * extra code
	 */
	$('#clock-hands').click(function(){
		var _self = this;
		var cnt = $(this).data('cnt') || 0;
		var play =  $(this).data('play') || null;
		if(play === 'true'){ return false; }
		$(this).data('cnt', ++cnt);
		if(cnt >= 10 && !play){
			$(this).data('play', 'true');
			secret1 = new Audio();
			secret2 = new Audio();
			secret3 = new Audio();
			secret1.src = 'audios/chime1.mp3';
			secret2.src = 'audios/cat.mp3';
			secret3.src = 'audios/chime2.mp3';
			$(secret1).on('ended', function(){
				var timer1 = setTimeout(function(){
					$(secret2).on('ended', function(){
						var timer2 = setTimeout(function(){
							$(secret3).on('ended', function(){
								$(_self).data('play', '').data('cnt', 0);
								$(secret1).off('ended');
								$(secret2).off('ended');
								$(secret3).off('ended');
								clearTimeout(timer2);
								clearTimeout(timer1);
								timer2 = timer1 = null;
							});
							secret3.play();
						}, 1000);
					});
					secret2.play();
				}, 1500);
			});
			secret1.play();
		}
	});


	/**
	 * Get the relative position on canvas from position on screen.
	 *
	 * @param {Number}
	 *            x position on screen
	 * @param {Number}
	 *            y position on screen
	 * @returns {Object} Position object which contains x, y properties.
	 */
	/* 現在位置を相対的に設定 */
	function posOnCanvas(x, y) {
		var canvasPos = canvas.offset();
		return {
			x : x - canvasPos.left,
			y : y - canvasPos.top
		};
	}

	/**
	 *ユーザーがイベントを発生させた場合の処理
	 *COMMAND_OPSはイベントごとに処理を格納する連想配列
	 */
	var COMMAND_OPS = {
		/* 初期の状態 */
		clear: function(param, share) {
			canvas[0].width = canvas[0].width;
			if (share) {
				sendCommand({
					type: "clear",
					param: param
				});
			}
		},
		/* マウスが移動した場合 */
		mouseMove : function(param, share) {
			if (!share) {
			/* falseの場合何もしない */
				return;
			}
			/* trueの場合 */
			sendCommand({
				type : "mouseMove",
				param : param
			});
		},
		/* 黒板消し */
		erase : function(param, share) {
			// Currently, start parameter is not used.
			var end = param.end;
			ctx.clearRect(end.x, end.y, 18, 32);
			if (share) {
				sendCommand({
					type : "erase",
					param : param
				});
			}
		},
		/* 線を引く */
		drawLine : function(param, share) {
			var start = param.start, end = param.end;
			ctx.strokeStyle = LINE_PATTERNS[param.color];
			ctx.lineWidth = lineWidth;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(start.x, start.y);
			ctx.lineTo(end.x, end.y);
			ctx.stroke();
			ctx.closePath();
			if (share) {
				sendCommand({
					type : "drawLine",
					param : param
				});
			}
		},
		/* 画面のリセット */
		reset : function(param,share)
		{
			ctx.clearRect(-1000, -1000, 10000, 10000);
			if(share)
			{
				sendCommand({
					type : "reset",
					param : param
				});
			}
		},
		/* 次へボタンを押した際の処理 */
		next : function(param,share)
		{
			if(share)
			{
				sendCommand({
					type : "next",
					param : param
				});
			}
		},
		/* 戻るボタンを押した際の処理 */
		turn : function(param,share)
		{

			if(share)
			{
				sendCommand({
					type : "turn",
					param : param
				});
			}
		},

		img :function(param,share)
		{
			if(share)
			{

				img({type : "img",param : param});

			}
			else if(param.start.x == "save")
			{

				var canvas = document.getElementById("canvas");
				var can = canvas.getContext('2d');


				/* divのＵＲＬの変更 */
				var div = document.getElementById("chalkboard");
				div.style.background = param.end.x;




				/* canvasに画像の描画 */
 				var img1 = new Image();
				img1.src = param.start.y;

				img1.onload = function() {
					can.drawImage(img1, 0, 0);
				};

			}
		},

		enter :function(param,share)
		{
			if(share)
			{
				enter({
					type : "page_move",
					param : param
				});
			}
		},
		/* ページの新規作成の処理 */
		new_page :function(param,share)
		{
			if(share)
			{
				sendCommand({
					type : "new_page",
					param : param
				});
			}
		},
		/* 授業終了の際の処理 */
		end_class :function(param,share)
		{
			if(share)
			{
				end_class({
					type : "end_class",
					param : param
				});
			}
		},
		white_par :function(param,share)
		{
			if(share)
			{
				white_par({
					type : "white_par",
					param : param.start.x
				});
			}
		}

	};
	// UIEvent handling ==========================

	///////////////////////////////////////////////////////////////////////////////////
	/** 				 キャンバス上に筆が下された場合の処理						**/
	///////////////////////////////////////////////////////////////////////////////////
	//各種端末からキャンバス上に筆が下された場合
	document.addEventListener("touchstart", function(e){
		if(draw_per){
			drawing = true;
			/* 筆を下した座標をprevに格納 */
			var pos = posOnCanvas(e.touches[0].pageX, e.touches[0].pageY);
			prevX = pos.x;
			prevY = pos.y;
		}
	}, false);

	//キャンバス上に筆が下された場合
	canvas.mousedown(function(e) {
		if(draw_per){
			//描画フラグをtrueにする
			drawing = true;
			//キャンバス上の現在位置をposに格納
			var pos = posOnCanvas(e.pageX, e.pageY);
			//posの位置を処理の開始位置（before）として設定
			prevX = pos.x;
			prevY = pos.y;
		}
	});

	///////////////////////////////////////////////////////////////////////////////////
	/** 				 キャンバス上から筆が離れた場合の処理						**/
	///////////////////////////////////////////////////////////////////////////////////

	//各種端末上がキャンバス上から筆を離した場合
	document.addEventListener("touchend", function(e){
		if(draw_per){
			drawing = false;
			e.stopPropagation();
		}
	}, false);

	//キャンバス上から筆が離れた場合
	canvas.mouseup(function(e) {
		if(draw_per){
			drawing = false;
			e.stopPropagation();
		}
	});

	///////////////////////////////////////////////////////////////////////////////////
	/** 				 キャンバス上で座標が動いた場合の処理						**/
	///////////////////////////////////////////////////////////////////////////////////

	//各種端末の座標が移動した場合の処理
	 document.addEventListener("touchmove", function(e){
		 if(draw_per){
		 	/* 画面をずらさないようにする */
		 	event.preventDefault();
		 	/* 動いた位置（現在位置）をcurPosに格納 */
		 	var curPos = posOnCanvas(e.touches[0].pageX, e.touches[0].pageY);
			//動いた位置を最新の位置であるcurrentに格納
			var currentX = curPos.x;
			var currentY = curPos.y;

			COMMAND_OPS.mouseMove({
				x : currentX,
				y : currentY,
				color : color,
				eracing : eracing
			}, true);
			if (!drawing) {
				//描画フラグがfalseの場合はなのもしない
				return;
			}
			//黒板消しの場合
			if (eracing) {

				COMMAND_OPS.erase({
					start : {
						x : prevX,
						y : prevY
					},
					end : {
						x : currentX,
						y : currentY
					}
				}, true);
			//線を引く場合
			} else {

				COMMAND_OPS.drawLine({
					color : color,
					start : {
						x : prevX,
						y : prevY
					},
					end : {
						x : currentX,
						y : currentY
					}
				}, true);
			}
			//beforeの座標の更新
			prevX = currentX;
			prevY = currentY;
		 }
		});

	//カーソルの現在地が変わった場合
	canvas.mousemove(function(e) {
		if(draw_per){
			//動いた位置をcurPosに格納
			var curPos = posOnCanvas(e.pageX, e.pageY);
			//動いた位置を最新の位置であるcurrentに格納
			var currentX = curPos.x;
			var currentY = curPos.y;

			COMMAND_OPS.mouseMove({
				x : currentX,
				y : currentY,
				color : color,
				eracing : eracing
			}, true);
			if (!drawing) {
				//描画フラグがfalseの場合はなのもしない
				return;
			}
			//黒板消しの場合
			if (eracing) {
				COMMAND_OPS.erase({
					start : {
						x : prevX,
						y : prevY
					},
					end : {
						x : currentX,
						y : currentY
					}
				}, true);
			//線を引く場合
			} else {
				COMMAND_OPS.drawLine({
					color : color,
					start : {
						x : prevX,
						y : prevY
					},
					end : {
						x : currentX,
						y : currentY
					}
				}, true)
			}
			prevX = currentX;
			prevY = currentY;
		}
	});


	//画面上から筆が上げられた場合
	$(document).mouseup(function(e) {
		if(draw_per){
			//描画フラグをfalseにする
			drawing = false;
			$("#colorPalette .color").last().click();
		}
	});
	///////////////////////////////////////////////////////////////////////////////////
	/** 				 ここから黒板の付随機能										**/
	///////////////////////////////////////////////////////////////////////////////////

	$("#colorPalette .color").bind('touchstart', function(e) {
		//黒板消しをfalseにする
		eracing = false;
		color = $(this).data("color");
		canvas.css("cursor", "url(images/pointer_" + color
				+ ".cur), pointer");
	}).last().click();

	//チョークをクリックされた場合
	$("#colorPalette .color").click(
			function(e) {
				//消しゴムをfalseにする
				eracing = false;
				//今の色をcolorに格納
				color = $(this).data("color");
				canvas.css("cursor", "url(images/pointer_" + color
						+ ".cur), pointer");
			}).last().click();

	$("#eraser").bind('touchstart', function(e) {
		//黒板消しフラグをtrueにする
		eracing = true;
		canvas.css('cursor', 'url(images/pointer_eraser.cur), pointer');
		});

	//黒板消しをクリックされた場合
	$("#eraser").click(function(e) {
		//黒板消しフラグをtrueにする
		eracing = true;
		canvas.css('cursor', 'url(images/pointer_eraser.cur), pointer');
	});


	$("#all").click(function(e){
		COMMAND_OPS.reset(	{
		start : {
			x : -1000,
			y : -1000
		},
		end : {
			x : 10000,
			y : 10000
		}},
		true);
	});

	$("#test").click(function(e){
		//戻る（テスト）をクリック
		/////////////////////////////////////////////////////////////////////////////////////
		//							現在の画像を保存する処理							   //
		////////////////////////////////////////////////////////////////////////////////////

		$("glayLayer").show();
        $("#overLayer").show();

		var canvas = document.getElementById("canvas");
		var  can = canvas.getContext('2d');


		//divに設定されている背景画像を保存する処理
		var back = document.getElementById("chalkboard");

		div_url = back.style.backgroundImage;

		COMMAND_OPS.turn({
			start : {
				x : now_moving,
				y : div_url
			},
			end : {
				x : canvas.toDataURL(),
				y : seq_array
			}},
			true);
	});

	$("#test2").click(function(e){
		//進む（テスト）をクリック
		/////////////////////////////////////////////////////////////////////////////////////
		//								現在の画像を保存する処理						   //
		////////////////////////////////////////////////////////////////////////////////////

		$("glayLayer").show();
        $("#overLayer").show();
		var canvas = document.getElementById("canvas");
		var  can = canvas.getContext('2d');


		//divに設定されている背景画像を保存する処理
		var back = document.getElementById("chalkboard");

		div_url = back.style.backgroundImage;


		COMMAND_OPS.next({
			start : {
				x : now_moving,
				y : div_url
			},
			end : {
				x : canvas.toDataURL(),
				y : seq_array
			}
		},true);
	});
	$("#test3").click(function(e){
		//新規作成（テスト）をクリック
		/////////////////////////////////////////////////////////////////////////////////////
		//								画像を保存する処理								   //
		////////////////////////////////////////////////////////////////////////////////////

		$("glayLayer").show();
        $("#overLayer").show();
		var canvas = document.getElementById("canvas");
		var  can = canvas.getContext('2d');


		//divに設定されている背景画像を保存する処理
		var back = document.getElementById("chalkboard");

		div_url = back.style.backgroundImage;

		COMMAND_OPS.new_page({
			color : color,
			start : {
				x : now_moving,
				y : div_url
			},
			end : {
				x : canvas.toDataURL("image/png"),
				y : seq_array
			}
		}, true);

	});
	$("#end").click(function(e){
		//授業終了ボタンをクリック

		COMMAND_OPS.end_class({
			color : color,
			start : {
				x : 1000,
				y : 1000
			},
			end : {
				x : 1000,
				y : -10000
			}
		}, true);
	});

    $(".white_par").click(function(){
    	$("glayLayer").show();
        $("#overLayer").show();
    	var user= $(this).data('id');
    	COMMAND_OPS.white_par({
			color : color,
			start : {
				x : user,
				y : 1000
			},
			end : {
				x : 1000,
				y : -10000
			}
		}, true);
    });

	/**
	 * ここより下はサーバにデータを送る処理
	 *
	 * @param {Object}
	 *            command
	 */
	var sendCommand;
	var img;
	var next;
	var save;
	var end_class;
	var white_par;

	// Interaction with server using Socket.IO
	(function() {
		var socket = io.connect(location.protocol + '//' + location.host
				+ '/chalkboard');
		function processCommand(command) {
			var fn = COMMAND_OPS[command.type];
			if (!fn) {
				console.error('Unknown command type:' + command.type);
				return;
			}
			fn(command.param);
			$("glayLayer").hide();
	        $("#overLayer").hide();

		}

		socket.on('page_jump',function(){
			document.location = "http://49.212.201.99/pcp2012/index.php";
		});
		socket.on('connect', function(commands) {
			$('#loadingMessage').hide();
		});
		socket.on('init', function(commands) {
			COMMAND_OPS.enter({
				seq_array : seq_array
			}, true);

			if (!(commands instanceof Array)) {
				return;
			}
			for ( var i = 0, n = commands.length; i < n; i++) {
				//server.jsに今まで格納してきた処理を実行し最新の状態にする
				processCommand(commands[i]);
			}

		});
		//入室した際に最新の背景を設定する
		socket.on('enter', function(send){
			now_moving = send['page_move'];
			var div = document.getElementById("chalkboard");
			div.style.background = send['div_url'];
		});

		//現在のページを格納する処理
		socket.on('now_page', function(send){
			now_moving = send;

		});
		// Holder for the mouse pointer of the other user.
		// Key:sessionId, Value:the div element which indicate the pointer's
		// position.
		var pointers = {};
		// Called when the other user is leaved from this web site.
		socket.on('leave', function(sessionId) {
			// Delete the pointer of the user.
			var pointer = pointers[sessionId];
			if (pointer) {
				pointer.remove();
			}
			delete pointers[sessionId];
		});
		socket.on('refresh', function(command){

			COMMAND_OPS.reset(	{
				start : {
					x : -1000,
					y : -1000
				},
				end : {
					x : 10000,
					y : 10000
				}
			},true);

		});

		socket.on('command', function(aaa) {

			// render mouse pointer
			var param = aaa.param;
			var sessionId = aaa.sessionId;
			var pointer = pointers[sessionId];


			if (!pointer) {
				pointer = $('<div class="userPointer"/>').appendTo(
						document.body);
				pointers[sessionId] = pointer;
			}
			if (param.erasing) {
				pointer.css('backgroundColor', 'transparent');
			} else {
				pointer.css('backgroundColor', param.color);
			}
			var canvasPos = canvas.offset();
			var cursorPos = {
				left : canvasPos.left + param.x,
				top : canvasPos.top + param.y
			};
			pointer.offset(cursorPos);
			processCommand(aaa);
		});

		socket.on('next', function(command){
			//画面のリセットをする
			command.type = "reset";
			processCommand(command);

			//背景画像の設定
			var div = document.getElementById("chalkboard");
			div.style.background = "url(../images/kokuban.jpg)";

		});

		socket.on('img', function(command){
			//現在の線をすべて消去
			command.type = "reset";
			processCommand(command);

			//画像を描画
			command.type = "img";
			command.param.start.x = "save";
			processCommand(command);


		});

		socket.on('white_par', function(par_user){
			if(user_seq==par_user && draw_par==true){
				//描けなくする
				draw_par=false;
			}else if(user_seq==par_user && draw_par==false){
				//描けるようにする
				draw_par=true;
			}
		});

		socket.on('log_test', function(command){
			console.log(command);
		});

		img = function(command){
			socket.emit('img', command);
		};

		enter = function(command){
			socket.emit('enter',command);
		};

		save = function(command){
			socket.emit('save', command);
		};

		sendCommand = function(command) {
			socket.emit('command', command);
		};
		end_class = function(command) {
			socket.emit('end_class', command);
		};
		white_par = function(command){
			socket.emit('white_par',command);
		};
	})();

	function clock(){
		var canvas = $('#clock-hands');
		var ctx = canvas[0].getContext('2d');
		var adjust = { x: 0, y: 0 }; // center-pos adjustment.
		var conf = {
			x: canvas.width() / 2 + adjust.x,
			y: canvas.height() / 2 + adjust.y,
			w: canvas.width(),
			h: canvas.height()
		};
		conf.r = Math.min(conf.x, conf.y) / 0.9;

		var interval = setInterval(display, 1000);

		function display(){
			// clear canvas
			ctx.clearRect(0, 0, conf.w, conf.h);

			var now = new Date();
			var time = {
				h: now.getHours() % 12,
				m: now.getMinutes(),
				s: now.getSeconds()
			}
			// hour-hand
			var hour = {
				angle: Math.PI * 2 * ( 3 - ( time.h + time.m / 60)) /12,
				height: conf.r * 0.35,
				width: 5,
				color: '#000000'
			};
			var minute = {
				angle: Math.PI * 2 * ( 15 - (  time.m + time.s / 60)) /60,
				height: conf.r * 0.6,
				width: 1.5,
				color: '#000000'
			};
			var second = {
				angle: Math.PI * 2 * ( 15 - time.s ) / 60,
				height: conf.r * 0.6,
				width: 1,
				color: '#666666'
			}

			drawHand(hour);
			drawHand(minute);
			drawHand(second);
		}

		function drawHand(hand){
			var x = conf.x + hand.height * Math.cos(hand.angle);
			var y = conf.y - hand.height * Math.sin(hand.angle);

			ctx.strokeStyle = hand.color;
			ctx.lineWidth = hand.width;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(conf.x, conf.y);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	}
}, {
	preloadImages : [
		'images/chalk_pt_pink.png', 'images/chalk_pt_blue.png',
		'images/chalk_pt_white.png', 'images/chalk_pt_green.png',
		'images/chalk_pt_yellow.png', 'images/pointer_pink.cur',
		'images/pointer_blue.cur', 'images/pointer_white.cur',
		'images/pointer_green.cur', 'images/pointer_yellow.cur'
	]
}, {
	preloadAudios : [
		'audios/chalk.mp3', 'chimes.mp3',
		'chime1.mp3', 'chime2.mp3', 'cat.mp3'
	]
});



