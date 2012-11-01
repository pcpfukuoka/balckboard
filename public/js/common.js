function veil() {
	$('#veil').show();
}
function unveil() {
	$('#veil').hide();
}
function loadImage(url, onSuccess, onError) {
	var img = new Image();
	img.src = url;
	img.onload = function() {
		typeof onSuccess === 'function' && onSuccess(img);
	};
	img.onerror = function(e) {
		typeof onError === 'function' && onError(e)
	};
}

function loadImages(urls, onComplete, onProgress) {
	var loaded = 0;
	var imgCount = urls.length;
	var images = [];
	for ( var i = 0, n = imgCount; i < n; i++) {
		var callback = (function(index) {
			return function(img) {
				img = (img && img.src) ? img : null;
				loaded++;
				images[index] = img;
				typeof onProgress === 'function' && onProgress(img, index);
				if (loaded === imgCount) {
					typeof onComplete === 'function' && onComplete(images);
				}
			};
		})(i);
		loadImage(urls[i], callback, callback);
	}
}

function loadAudio(url, onSuccess, onError) {
	var audio = new Audio();
	audio.src = url;
	audio.onload = function() {
		typeof onSuccess === 'function' && onSuccess(audio);
	};
	audio.onerror = function(e) {
		typeof onError === 'function' && onError(e)
	};
}

function loadAudios(urls, onComplete, onProgress) {
	var loaded = 0;
	var audioCount = urls.length;
	var audios = [];
	for ( var i = 0, n = audioCount; i < n; i++) {
		var callback = (function(index) {
			return function(audio) {
				audio = (audio && audio.src) ? audio : null;
				loaded++;
				audios[index] = audio;
				typeof onProgress === 'function' && onProgress(audio, index);
				if (loaded === audioCount) {
					typeof onComplete === 'function' && onComplete(audios);
				}
			};
		})(i);
		audioImage(urls[i], callback, callback);
	}
}

/**
 * Execute callback when app is ready.
 * 
 * @param fn
 */
function onAppReady(fn, options) {
	var n = 0;
	var COUNT_OF_ASYNC_PROC = 3;

	function aboutThisExample() {
		$('#aboutThisExample').html(msg_aboutThisExample);
		$('#descriptionOfThisExample h1').html(msg_aboutThisExample);
		$('#descriptionOfThisExample .content').html(msg_descriptionOfThisExample);
		$(window).resize(function() {
			var description = $('#descriptionOfThisExample');
			if (description.is(':visible')) {
				description.css({
					left: ($(document).width() - description.width()) / 2,
					top: ($(document).height() - description.height()) / 2
				});
			}
		});
		$('#aboutThisExample').click(function() {
			veil();
			var description = $('#descriptionOfThisExample');
			description.css({
				left: ($(document).width() - description.width()) / 2,
				top: ($(document).height() - description.height()) / 2
			}).show();
			$('#closeDescriptionButton').click(function() {
				description.hide();
				unveil();
			});
		});
		setTimeout(function() {
			$('#aboutThisExample').addClass('visible');
		}, 1500);
	}
	// execute callback function
	var doWhenReady = function(params) {
		n++;
		if (n === COUNT_OF_ASYNC_PROC) {
			fn(params);
		}
	}

	var $ = jQuery;
	// Wait for DOM ready.
	$(document).ready(function() {
		doWhenReady();
	});
	// Wait for loading i18n messages.
	jQuery.i18n.properties({
		name : 'Messages',
		path : 'bundle/',
		mode : 'both',
		callback : function() {
			aboutThisExample();
			doWhenReady();
		}
	});
	if (options.preloadImages) {
		loadImages(options.preloadImages, function(images) {
			doWhenReady({
				loadedImages: images
			});
		});
	}
	if (options.preloadAudios) {
		loadAudios(options.preloadAudios, function(audios) {
			doWhenReady({
				loadedAudios: audios
			});
		});
	}
}

function rgb2hsl(r, g, b)
{
	var h = s = l = 0;
    var colMax = Math.max(r, g, b);
    var colMin = Math.min(r, g, b);
    l = (colMax + colMin) / 2;
    var c = colMax - colMin;
    if (c !== 0) {
        if (l <= 0.5) {
            s = c / (colMax + colMin);
        } else {
            s = c / (2 - (colMax + colMin));
        }
        if (colMax === r) {
            h = (g - b) / c;
        } else if (colMax === g) {
            h = 2 + (b - r) / c;
        } else {
            h = 4 + (r - g) / c;
        }
        h *= 60;
        if (h < 0)
            h += 360;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function modernizr(properties)
{
	var rtnArray = [];
	properties.forEach(function(property){
		if(!Modernizr[property]){
			rtnArray.push($.i18n.prop('msg_modernizr_' + property));
		}
	});
	if(rtnArray.length > 0){
		rtnArray.unshift($.i18n.prop('msg_modernizr_not_supported'));
	}
	return rtnArray;
}

