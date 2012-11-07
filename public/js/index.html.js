onAppReady(function(param) {

	var msg = modernizr([
		'canvas', 'websockets',
		'fontface', 'opacity', 'borderradius', 'boxshadow'
	]);
	if(msg.length > 0){ alert(msg.join('\n')); }


	clock();

	// show images
	var imgLoadTimer = setTimeout(function(){
		$('.fadeIn').fadeIn(8000);
		clearTimeout(imgLoadTimer);
		imgLoadTimer = null;
	}, 2000);

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

	//キャンバスの初期値を設定
	var drawing = false;
	var eracing = false;
	var prevX = 0;
	var prevY = 0;
	var lineWidth = 4;
	var color = "white";

	// 現在の日付を黒板に書く
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
	effects.play('chimes');

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
	//現在位置を相対的に設定
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
		//初期の状態
		clear: function(param, share) {
			canvas[0].width = canvas[0].width;
			if (share) {
				sendCommand({
					type: "clear",
					param: param
				});
			}
		},
		//マウスが移動した場合
		mouseMove : function(param, share) {
			if (!share) {
				return;
			}
			sendCommand({
				type : "mouseMove",
				param : param
			});
		},
		//黒板消し
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
		//線を引く
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
		}
	};
	// UIEvent handling ==========================

	//キャンバス上に筆が下された場合
	canvas.mousedown(function(e) {
		//描画フラグをtrueにする
		drawing = true;
		//キャンバス上の現在位置をposに格納
		var pos = posOnCanvas(e.pageX, e.pageY);
		//posの位置を処理の開始位置（before）として設定
		prevX = pos.x;
		prevY = pos.y;

		if(!eracing){ effects.play('chalkMouseDown'); }
	});
	canvas.mouseup(function(e) {
		drawing = false;
		e.stopPropagation();
	});
	canvas.mousemove(function(e) {
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
	});
	//キャンバス上から筆が上げられた場合
	$(document).mouseup(function(e) {
		//描画フラグをfalseにする
		drawing = false;
		$("#colorPalette .color").last().click();
	});
	//チョークをクリックされた場合
	$("#colorPalette .color").click(
			function(e) {
				//消しゴムフラグをfalseにする
				eracing = false;
				//今の色をcolorに格納
				color = $(this).data("color");
				canvas.css("cursor", "url(images/pointer_" + color
						+ ".cur), pointer");
			}).last().click();
	//黒板消しをクリックされた場合
	$("#eraser").click(function(e) {
		//黒板消しフラグをtrueにする
		eracing = true;
		canvas.css('cursor', 'url(images/pointer_eraser.cur), pointer');
	});

	/**
	 * ここより下はサーバにデータを送る処理
	 *
	 * @param {Object}
	 *            command
	 */
	var sendCommand;
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
		}
		socket.on('connect', function(commands) {
			$('#loadingMessage').hide();
		});
		socket.on('init', function(commands) {
			if (!(commands instanceof Array)) {
				return;
			}
			for ( var i = 0, n = commands.length; i < n; i++) {
				processCommand(commands[i]);
			}
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
		socket.on('command', function(command) {
			// render mouse pointer
			var param = command.param;
			var sessionId = command.sessionId;
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
			processCommand(command);
		});

		sendCommand = function(command) {
			socket.emit('command', command);
		}
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
