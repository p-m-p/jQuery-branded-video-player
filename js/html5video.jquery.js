(function ($) {

	var _videoMethods = {

			showLoading: function (obj) {
				var controls = obj;
				if (!controls.loading) { // manually passed in controls
					var controls = _videoMethods.getControls(obj.currentTarget)
				}
				if (controls && controls.loading)
					controls.loading.fadeIn(150);
			}

		,	hideLoading: function (obj) {
				var controls = obj;
					if (!controls.loading) { // manually passed in controls
						var controls = _videoMethods.getControls(obj.currentTarget)
					}
					if (controls && controls.loading)
						controls.loading.fadeOut(150);
			}

		,	showBuffering: function (ev) {
				var video = ev.currentTarget
					,	buffered = ev.target.buffered
					,	controls = _videoMethods.getControls(video);
				for (var i = 0; i < buffered.length; ++i) {
					percentLoaded = Math.round((buffered.end(i) / video.duration) * 100);
					controls.buffered.css('width', percentLoaded + "%");
				}
			}

		,	showRunTime: function (ev) {
				var video = ev.currentTarget
					, controls = 
							$("." + _settings.identity + "controls[bvjquery=" + 
							$(video).attr("bvjquery") + "]")
								.data(_settings.identity + "controls")
					,	runTime = Math.round(video.currentTime)
					,	seconds = Math.round(runTime % 60)
					,	minutes = Math.floor(runTime / 60)
					,	clockDisplay
					,	progress = (video.currentTime / video.duration) * 100;                
				if (video.readyState >= 3) {
					seconds = seconds < 10 ? "0" + seconds : seconds;
					minutes = minutes < 10 ? "0" + minutes : minutes;
					clockDisplay = seconds ? minutes + ":" + seconds : minutes + ":00";
					controls.runTime.text(clockDisplay);
					controls.progressIn.animate({width: progress + "%"}, 50);
					controls.progressHandle.animate({left: progress + "%"}, 50);
				} else _videoMethods.showLoading(controls);
			}

		,	getControls: function (v) {
				$video = $(v);
				return $("." + _settings.identity + "controls[bvjquery=" + 
						$video.attr("bvjquery") + "]")
					.data(_settings.identity + "controls");
			}

		,	setDuration: function (v) {
				var video = v;
				if (!v.duration)
					video = v.currentTarget;
				var controls = _videoMethods.getControls(video)
					,	duration = video.duration
					,	minutes = Math.floor(duration / 60)
					,	seconds = Math.round(duration % 60);
				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;
				controls.duration.text("/" + minutes + ":" + seconds);
			}

		,	ended: function (ev) {
				console.log(ev);
				
			}

	};

	var _settings = {
			identity: "mybrand-video-"
		,	hidePlayer: true
	}
	
	var methods = {
		
			init: function (opts) {
				
				$.extend(_settings, opts);
				
				return this.each(function (i, el) {
					
					var $this = $(el)
						,	video = el;
					
					// create video control elements
					var controls = {
						wrapper: $(document.createElement('div'))
					,	controlBar: $(document.createElement('div'))
					,	playPause: $(document.createElement('button'))
					,	mute: $(document.createElement('button'))
					,	progressIn: $(document.createElement('div'))
					,	progressOut: $(document.createElement('div'))
					,	progressHandle: $(document.createElement('div'))
					,	runTime: $(document.createElement('span'))
					,	duration: $(document.createElement('span'))
					,	loading: $(document.createElement('div'))
					,	branding: $(document.createElement('a'))
					,	buffered: $(document.createElement('div'))
					,	video: video
					};

					// set classes for styling
					controls.wrapper.addClass(_settings.identity + 'controls');
					controls.controlBar.addClass(_settings.identity + 'control-bar');
					controls.playPause.addClass(_settings.identity + 'play-pause');
					controls.mute.addClass(_settings.identity + 'volume');
					controls.progressOut.addClass(_settings.identity + 'progress-outer');
					controls.progressIn.addClass(_settings.identity + 'progress-inner');
					controls.progressHandle.addClass(_settings.identity + 'progress-handle');
					controls.loading.addClass(_settings.identity + 'loading');
					controls.runTime.addClass(_settings.identity + 'runtime');
					controls.duration.addClass(_settings.identity + 'duration');
					controls.branding.addClass(_settings.identity + 'branding');
					controls.buffered.addClass(_settings.identity + 'buffered');

					// put the elements together
					controls.wrapper
						.append(controls.loading) //loading overlay
						.append(controls.controlBar) //controls
						.attr("bvjquery", "bvcontrols" + i);
					controls.progressOut
						.append(controls.buffered) //buffered data bar
						.append(controls.progressIn) //progress indicator
						.append(controls.progressHandle); //progress bar handle
					controls.controlBar
						.append(controls.playPause) // play button
						.append(controls.progressOut) // progress wrapper
						.append(controls.runTime) // current time
						.append(controls.duration) // total time
						.append(controls.mute) // volume button
						.append(controls.branding); // custom brand icon
					controls.wrapper.appendTo('body');

					// default display
					controls.runTime.text('00:00');
					controls.duration.text('/00:00');

					// event listeners for controls
					controls.playPause.click(methods.playPause);
					controls.mute.click(methods.mute);
					controls.progressOut.click(methods.skipTo);
					controls.progressHandle.mousedown(methods._setProgressSlider);

					if (_settings.hidePlayer) {
						controls.wrapper.hover(methods.showControls, methods.hideControls);
					}

					// event listeners for video
					video.addEventListener("seeking", _videoMethods.showLoading, false);
					video.addEventListener("seeked", _videoMethods.hideLoading, false);
					video.addEventListener("progress", _videoMethods.showBuffering, false);
					video.addEventListener("timeupdate", _videoMethods.showRunTime, false);
					video.addEventListener("ended", _videoMethods.ended, false);
					// event doesn't fire in chrome if already cached //------------------------------check this is true still
					if (video.readyState) _videMethods.setDurationTime(video);
					else video.addEventListener("loadedmetadata", _videoMethods.setDuration, false);

					$this.attr("bvjquery", "bvcontrols" + i); // -------------------------------------this needs to be changed to a uid

					controls.wrapper.data(_settings.identity + 'controls', controls);
					methods.positionControls(controls.wrapper);

				});

			}

		,	playPause: function (ev) {
				var $btn = $(this)
					,	controls = methods._getVideoControls($btn);
				if (controls && controls.video) {
					if (controls.video.paused) {
						controls.video.play();
						$btn.addClass(_settings.identity + "playing")
					}	else {
						controls.video.pause()
						$btn.removeClass(_settings.identity + "playing")
					}
				}
			}

		,	stop: function () {
				
			}

		,	mute: function (ev) {
				var controls = methods._getVideoControls($(this));
				if (controls.video.muted) {
					controls.video.muted = false;
					controls.mute.removeClass(_settings.identity + "muted");
				}
				else {
					controls.video.muted = true;
					controls.mute.addClass(_settings.identity + "muted");
				}
			}

		,	skipTo: function (ev) {
				var cr = this.getBoundingClientRect()
					,	leftPos = Math.round(ev.clientX - cr.left) - 2
					,	runTime = (leftPos / cr.width) * 100
					,	controls = methods._getVideoControls($(this));
				if (controls) {
					controls.video.currentTime = (controls.video.duration / 100) * runTime;
					controls.progressHandle.css('left', leftPos + "px");
					controls.progressIn.css('width', leftPos + "px");
				}
			}

		,	positionControls: function ($v) {

				var $this = $v || this;

				return $this.each(function () {

					var controls = $(this).data(_settings.identity + 'controls');

					if (controls) {

						var $video = $(controls.video)
							,	vidOffs = $video.offset();

						// position the loading indicator over the video element
						controls.loading.css('width', $video.width() + "px");
						controls.loading.css('height', $video.height() + "px");

						// position over the video
						controls.wrapper.css('width', $video.width() + "px");
						controls.wrapper.css('height', $video.height() + "px");
						controls.wrapper.css('left', vidOffs.left + "px");
						controls.wrapper.css('top', vidOffs.top + "px");

						// set the individual control positions and sizes
						controls.progressOut.css('width',
							parseInt(controls.wrapper.css('width')) -
							(
								((controls.playPause.width() + 12) * 3) +
									controls.runTime.width() + 12 +
									controls.duration.width() + 12 +
									controls.branding.width()
								) + "px"
							);
					}

				});
	
			}

		,	showControls: function (ev) {
				var $wrapper = $(this)
					,	controls = $wrapper.data(_settings.identity + "controls");
				if (controls)
					var timer = $wrapper.data(_settings.indentity + "controls-timer");
					if (timer) clearTimeout(timer);
					controls.controlBar.fadeIn(150);
			}

		,	hideControls: function (ev) {
				var $wrapper = $(this)
					,	controls = $wrapper.data(_settings.identity + "controls");
				if (controls)
					$wrapper.data(
							_settings.indentity + "controls-timer"
						,	setTimeout(function () {
								controls.controlBar.fadeOut(500);
							}, 2000)
					);
			}

		,	_getVideoControls: function ($el) {
				return $el.closest("." + _settings.identity + "controls")
					.data(_settings.identity + "controls");
			}

		,	_setProgressSlider: function (ev) {
				ev.preventDefault();
				ev.stopPropagation();
				var controls = methods._getVideoControls($(this));
				if (!controls.video.paused) {
					controls.video.pause();
					controls.wasPlaying = true;
				} else controls.wasPlaying = false;
				$(document)
					.bind("mousemove", controls, methods._updateProgressSlider)
					.bind("mouseup", controls, methods._destroyProgressSlider);
			}

		,	_updateProgressSlider: function (ev) {
				var controls = ev.data
					,	pos = methods._getProgressPositions(
							controls.progressHandle, ev.clientX
						);
				if (ev.clientY < pos.cr.top - 5 || ev.clientY > pos.cr.bottom + 5)
					methods._destroyProgressSlider(controls);
				else if (ev.clientX > pos.cr.left && ev.clientX < pos.cr.right)
					controls.progressHandle.css('left', pos.leftPos + "px");
			}

		,	_destroyProgressSlider: function (obj) {
				var controls = obj;
				if (!controls.video)
					controls = obj.data;
				if (controls.wasPlaying)
					controls.video.play();
				$(document)
					.unbind("mousemove", methods._updateProgressSlider)
					.unbind("mouseup", methods._destroyProgressSlider);
			}

		,	_getProgressPositions: function (obj, fromLeft) {
				var cr = obj.parent().get(0).getBoundingClientRect()
					,	leftPos = Math.round(fromLeft - cr.left) - (obj.width() / 2);
				return {
					cr: cr,
					leftPos : leftPos
				}
			}

	};
	
	$.fn.html5video = function (method) {
		
		if (methods[method]) {
			return methods[method].apply(
					this
				,	Array.prototype.slice.call(arguments, 1)
			);
		} else if (!method || typeof method == "object") {
			return methods.init.apply(this, arguments);
		}
		
	}
	
})(jQuery);