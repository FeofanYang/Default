/**
 * Version - 1.0
 *
 * Copyright (c) 2017 Feofan Yang
 *
 * Update
 * [1.] 增加按钮倒计时函数
 * [2.] 快速添加Reg组件功能
 *
 */

var setFontSize = false;
var showPage = new Function();
var myUtil = {};

(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
			setFontSize = true;
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

function lazyLoad(isResize, $ele, callback) {
	var curNum = 0;
	var parent;
	var preLoadNum;
	if (arguments[1]) {
		parent = $ele.find('.preload');
		preLoadNum = $ele.find('.preload').length;
	} else {
		parent = $('body').find('.preload');
		preLoadNum = $('body').find('.preload').length;
	}
	parent.each(function () {
		var self = $(this);
		if (self.attr('data-src')) {
			var img = new Image();
			img.src = self.attr('data-src');
			img.onload = function () {
				curNum++;
				self.attr('src', self.attr('data-src'));
				if (isResize && !self.hasClass('noResize')) {
					self.css({ 'width': this.width / 100 + 'rem' });
				}
				if (self.hasClass('_sCenter')) {
					self.css({ 'left': '50%' });
					self.css({ 'margin-left': -this.width / 100 / 2 + 'rem' });
				}
				if (typeof callback == 'function') {
					if (curNum == preLoadNum) {
						callback();
					}
				} else {
					var percent = curNum / preLoadNum;
					loadEnd(percent);
				}
			};
			img.onerror = function (data) {
				var index = img.src.lastIndexOf('/');
				var imgname = img.src.substr(index + 1);
				pWidget.alert("图片加载错误：" + imgname);
			}
		}
	});
}

function loadEnd(percent) {
	$('.loading-percent').html(parseInt(percent * 100, 10) + '%');
	$('.loading-percent').animate({ 'opacity': 1 }, 100);
	if (percent == 1 && setFontSize) {
		$('#loading').animate({ 'opacity': 0 }, 500, function () {
			$('#loading').remove();
			showPage();
		});
	}
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r !== null) {
		return unescape(r[2]);
	}
	return null;
}

function btnTimer(btnId, btnCount, btnHint) { /* [1.] */
	var btnVal = $(btnId).val();
	$(btnId).attr("disabled", "disabled");
	typeof btnHint == 'string' ? $(btnId).attr("value", btnCount + "S" + btnHint) : $(btnId).attr("value", btnCount + "S");
	var btnInterval = setInterval(function () {
		btnCount--;
		typeof btnHint == 'string' ? $(btnId).attr("value", btnCount + "S" + btnHint) : $(btnId).attr("value", btnCount + "S");
		if (btnCount < 0) {
			$(btnId).removeAttr("disabled");
			clearInterval(btnInterval);
			$(btnId).attr("value", btnVal);
		}
	}, 1000);
}

myUtil.vertify = {
	isName: function (str) {
		var reg = /^[\u4E00-\u9FA5]{2,6}$/;
		return reg.test(str);
	},
	isTel: function (str) {
		var reg = /^1[34578][0-9]\d{8}$/;
		return reg.test(str);
	},
	isIDCard: function (str) {
		var reg = new RegExp("/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/");
		return reg.test(str);
	}
};

var pWidget = {
	params: {},
	config: function (params) {
		this.params = params;
		if (params.music) {
			this.addMusic();
		}
		if (params.arrow) {
			this.addArrow();
		}
	},
	addMusic: function () {
		var music = null;
		var openImgUrl = 'images/global/music-open.png';
		var closeImgUrl = 'images/global/music-close.png';
		if (typeof this.params.musicImgUrl == 'object') {
			openImgUrl = this.params.musicImgUrl[0];
			closeImgUrl = this.params.musicImgUrl[1];
		}
		if ($('#musicBtn').length > 0) {
			music = $('#music')[0];
		} else {
			$('body').prepend('<a href="javascript:;" class="musicBtn music_open" id="musicBtn"></a>');
			$('body').prepend('<audio src="mp3/music.mp3" id="music" autoplay loop></audio>');
			$('#musicBtn').css('background-image', 'url(' + openImgUrl + ')');
			music = $('#music')[0];
		}
		$('#musicBtn').bind('click', function () {
			if (music.paused) {
				music.play();
				$('#musicBtn').addClass('music_open');
				$('#musicBtn').css('background-image', 'url(' + openImgUrl + ')');
			} else {
				music.pause();
				$('#musicBtn').removeClass('music_open');
				$('#musicBtn').css('background-image', 'url(' + closeImgUrl + ')');
			}
		});
	},
	addArrow: function () {
		if ($('#arrow').length > 0) {
			$('#arrow').show();
		} else {
			if (typeof this.params.arrowImgUrl == 'string') {
				$('body').append('<img src="' + this.params.arrowImgUrl + '" class="arrow" id="arrow">');
			} else {
				$('body').append('<img src="images/global/arrow.png" class="arrow" id="arrow">');
			}
		}
	},
	addReg: function (selector, hasMsgCode) { /* [2.] */
		if (typeof hasMsgCode == 'boolean' && hasMsgCode == true) {
			$(selector).append("<div id='Rmask'><div class='regsiter'><p id='Rtitle'>登记您的资料<i class='iconfont icon-guanbi2' id='Rclose'></i> </p><div class='inputWrap'><input type='text' placeholder='姓名' id='Rname' class='name'><i class='name-icon iconfont'></i></div><div class='inputWrap'><input type='tel' placeholder='电话' id='Rtel' class='phone'><i class='tel-icon iconfont'></i></div><div class='inputWrap'><input type='tel' placeholder='验证码' id='Ryzm'><input type='button' value='发送验证码' id='Rsend'></div><p id='Rhint'>&nbsp;</p><input type='button' value='提交' id='Rsubmit'></div></div>");
		}
		else {
			$(selector).append("<div id='Rmask'><div class='regsiter'><p id='Rtitle'>登记您的资料<i class='iconfont icon-guanbi2' id='Rclose'></i> </p><div class='inputWrap'><input type='text' placeholder='姓名' id='Rname' class='name'><i class='name-icon iconfont'></i></div><div class='inputWrap'><input type='tel' placeholder='电话' id='Rtel' class='phone'><i class='tel-icon iconfont'></i></div><p id='Rhint'>&nbsp;</p><input type='button' value='提交' id='Rsubmit'></div></div>");
		}
	},
	showShare: function (canClose) {
		function addSwitch() {
			if (typeof canClose == 'boolean' && !canClose) {
				$('#fxzy').unbind('click')
			} else {
				$('#fxzy').bind('click', function () {
					$('#fxzy').hide();
				});
			}
		}
		if ($('#fxzy').length > 0) {
			$("#fxzy").show();
			addSwitch();
		} else {
			if (typeof this.params.shareImage == 'string') {
				$('body').prepend('<img id="fxzy" src="' + this.params.shareImage + '" style="position:fixed;top: 0;width:100%;height:100%;z-index:9999;">');
			} else {
				$('body').prepend('<img id="fxzy" src="images/global/fxzy.png" style="position:fixed;top: 0;width:100%;height:100%;z-index:9999;">');
			}
			addSwitch();
		}
	},
	hideShare: function () {
		$('#fxzy').hide();
	},
	showLoading: function () {
		if ($(".loadingPage").length > 0) {
			$(".loadingPage").show();
		} else {
			$("body").prepend("<div class='aMask loadingPage'><div class='ball_spread'></div><div class='ball_shrink'></div></div>");
		}
	},
	hideLoading: function () {
		$(".loadingPage").hide();
	},
	alert: function (res, callback, okres) {
		if ($('.myalert').length > 0) {
			$('.myalert').remove();
		}
		var ok = '确定';
		if (typeof okres == 'string') {
			ok = okres;
		}
		$('body').append('<div class="myalert"><div class="alert-mask"></div><div class="_alert"><div class="alert-title">' + res + '</div><div class="alert-ok">' + ok + '</div></div></div>');
		$('.alert-ok').bind('click', function () {
			$('.myalert').remove();
			if (typeof callback == 'function') {
				callback();
			}
		});
	},
};