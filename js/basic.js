var bSetRem = false;
var fnShowPage = new Function();
var oConst = {
	vertify: {
		isName: function (str) {
			var oReg = /^[\u4E00-\u9FA5]{2,6}$/;
			return oReg.test(str);
		},
		isTel: function (str) {
			var oReg = /^1[34578][0-9]\d{8}$/;
			return oReg.test(str);
		},
		isIDCard: function (str) {
			var oReg = new RegExp("/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/");
			return oReg.test(str);
		}
	},
};

(function (doc, win) {
	var docEl = doc.documentElement, resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
		bSetRem = true;
	}
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

function fnLazyLoad(argResize, argEl, argCallback) {
	var nCurCount = 0;
	var oImgs;
	var nLoadCount;
	if (arguments[1]) {
		oImgs = $(argEl).find('.preload');
		nLoadCount = $(argEl).find('.preload').length;
	} else {
		oImgs = $('body').find('.preload');
		nLoadCount = $('body').find('.preload').length;
	}
	oImgs.each(function () {
		var that = $(this);
		if (that.attr('data-src')) {
			var oImg = new Image();
			oImg.src = that.attr('data-src');
			oImg.onload = function () {
				nCurCount++;
				that.attr('src', that.attr('data-src'));
				if (argResize && !that.hasClass('el_noR')) {
					that.css({ 'width': this.width / 100 + 'rem' });
				}
				if (that.hasClass('img_C')) {
					that.css({ 'position': 'absolute', 'left': '50%', 'margin-left': -this.width / 100 / 2 + 'rem' });
				}
				if (that.hasClass('img_M')) {
					that.css({ 'position': 'absolute', 'top': '50%', 'margin-top': -this.height / 100 / 2 + 'rem' });
				}
				if (that.hasClass('img_O')) {
					that.css({ 'position': 'absolute', 'left': '50%', 'margin-left': -this.width / 100 / 2 + 'rem', 'top': '50%', 'margin-top': -this.height / 100 / 2 + 'rem' });
				}
				if (typeof argCallback == 'function') {
					if (nCurCount == nLoadCount) {
						argCallback();
					}
				} else {
					var nLoadPercent = nCurCount / nLoadCount;
					$('.page_preload .loader_text').html(parseInt(nLoadPercent * 100, 10) + '%');
					// preload end
					if (nLoadPercent == 1 && bSetRem) {
						$('.page_preload').animate({ 'opacity': 0 }, 500, function () {
							$('.page_preload').remove();
							fnShowPage();
						});
					}
				}
			}
			oImg.onerror = function (data) {
				var nImgIndex = oImg.src.lastIndexOf('/');
				var sImgName = oImg.src.substr(nImgIndex + 1);
				oWidget.alert("图片缓存错误：" + sImgName);
			}
		}
	});
}

var oWidget = {
	params: {},
	config: function (params) {
		this.params = params;
		if (params.arrow) {
			this.addArrow();
		}
		if (params.music) {
			this.addMusic();
		}
	},
	alert: function (argWords, argConfirm, argCallback) {
		if ($('.page_alert').length > 0) {
			$('.page_alert').remove();
		}
		var sConfirm = '确定';
		if (typeof argConfirm == 'string') {
			sConfirm = argConfirm;
		}
		$('body').append('<div class="mask_css page_alert"><div class="alert_container"><div class="alert_title">' + argWords + '</div><div class="alert_confirm">' + sConfirm + '</div></div></div>');
		$('.alert_confirm').bind('click', function () {
			$('.page_alert').remove();
			if (typeof argCallback == 'function') {
				argCallback();
			}
		});
	},
	addArrow: function () {
		if ($('._arrow').length > 0) {
			$('._arrow').show();
		} else {
			if (typeof this.params.arrowImgUrl == 'string') {
				$('body').append('<img src="' + this.params.arrowImgUrl + '" class="_arrow">');
			} else {
				$('body').append('<img src="images/global/arrow.png" class="_arrow">');
			}
		}
	},
	addMusic: function () {
		var oMusic = null;
		var sBGMOpen = 'images/global/music-open.png';
		var sBGMClose = 'images/global/music-close.png';
		if (typeof this.params.musicImgUrl == 'object') {
			sBGMOpen = this.params.musicImgUrl[0];
			sBGMClose = this.params.musicImgUrl[1];
		}
		if ($('.bgm_btn').length > 0) {
			oMusic = $('#music')[0];
		} else {
			$('body').prepend('<a href="javascript:;" class="bgm_btn am_bgm"</a>');
			$('.bgm_btn').css('background-image', 'url(' + sBGMOpen + ')');
			oMusic = $('#music')[0];
		}
		$('.bgm_btn').bind('click', function () {
			if (oMusic.paused) {
				oMusic.play();
				$('.bgm_btn').addClass('am_bgm');
				$('.bgm_btn').css('background-image', 'url(' + sBGMOpen + ')');
			} else {
				oMusic.pause();
				$('.bgm_btn').removeClass('am_bgm');
				$('.bgm_btn').css('background-image', 'url(' + sBGMClose + ')');
			}
		});
	},
	addReg: function (argEl, argMsgCode) {
		$('body').append();
		if (typeof argMsgCode == 'boolean' && argMsgCode == true) {
			$(argEl).append('<div class="mask_css page_reg"><div class="reg_container"><button class="reg_btn_close">×</button><div class="reg_title">登记您的资料</div><input class="reg_input_name" type="text" placeholder="姓名"><p class="reg_error_name">× 请输入2-6位的中文姓名</p><input class="reg_input_tel" type="tel" placeholder="电话"><p class="reg_error_tel">× 请输入正确的手机号码</p><input class="reg_input_code" type="text" placeholder="验证码"><button class="reg_btn_code">获取验证码</button><p class="reg_error_code">× 请输入验证码</p><button class="reg_btn_submit">提交</button></div></div>');
		}
		else {
			$(argEl).append('<div class="mask_css page_reg"><div class="reg_container"><button class="reg_btn_close">×</button><div class="reg_title">登记您的资料</div><input class="reg_input_name" type="text" placeholder="姓名"><p class="reg_error_name">× 请输入2-6位的中文姓名</p><input class="reg_input_tel" type="tel" placeholder="电话"><p class="reg_error_tel">× 请输入正确的手机号码</p><button class="reg_btn_submit">提交</button></div></div>');
		}
	},
	addShare: function (argClose) {
		function addSwitch() {
			if (typeof argClose == 'boolean' && !argClose) {
				$('.page_share').unbind('click')
			} else {
				$('.page_share').bind('click', function () {
					$('.page_share').fadeOut();
				});
			}
		}
		if ($('.page_share').length > 0) {
			$(".page_share").fadeIn();
			addSwitch();
		} else {
			if (typeof this.params.shareImgUrl == 'string') {
				$('body').prepend('<div class="mask_css page_share"><img class="shareImg" src="' + this.params.shareImgUrl + '"></div>');
			} else {
				$('body').prepend('<div class="mask_css page_share"><img class="shareImg" src="images/global/shareImg.png"></div>');
			}
			addSwitch();
		}
	},
	btnTimer: function (argId, argCount, argHint) {
		var sBtnVal = $(argId).val();
		$(argId).attr("disabled", "disabled");
		typeof argHint == 'string' ? $(argId).html(argCount + "秒后" + argHint) : $(argId).html(argCount + "秒");
		var nBtnInterval = setInterval(function () {
			argCount--;
			typeof argHint == 'string' ? $(argId).html(argCount + "秒后" + argHint) : $(argId).html(argCount + "秒");
			if (argCount < 0) {
				$(argId).removeAttr("disabled");
				clearInterval(nBtnInterval);
				$(argId).html(sBtnVal);
			}
		}, 1000);
	},
	showLoading: function (argText) {
		if ($(".page_loading").length > 0) {
			$(".page_loading").fadeIn();
		} else {
			if (typeof argText == 'string') {
				$("body").prepend('<div class="mask_css page_loading"><div class="loader"></div><p class="loader_text el_text">' + argText + '</p></div>');
			} else {
				$("body").prepend('<div class="mask_css page_loading"><div class="loader"></div></div>');
			}
		}
	},
	hideLoading: function () {
		$(".page_loading").fadeOut();
	},
}