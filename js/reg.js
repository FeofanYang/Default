let vertify = oConst.vertify;

// 失去焦点时验证输入框
$('body').on('focus', '.reg_input_name', function () {
	$(this).css("border", "1px solid #1AAD19");
});
$('body').on('blur', '.reg_input_name', function () {
	let name = $(".reg_input_name").val();
	$(this).removeAttr("style");
	if (!vertify.isName(name)) {
		$(".reg_error_name").fadeIn();
		return false;
	} else {
		$(".reg_error_name").fadeOut();
	}
});

$('body').on('focus', '.reg_input_tel', function () {
	$(this).css("border", "1px solid #1AAD19");
});
$('body').on('blur', '.reg_input_tel', function () {
	let tel = $(".reg_input_tel").val();
	$(this).removeAttr("style");
	if (!vertify.isTel(tel)) {
		$(".reg_error_tel").fadeIn();
		return false;
	} else {
		$(".reg_error_tel").fadeOut();
	}
});

$('body').on('focus', '.reg_input_code', function () {
	$(this).css("border", "1px solid #1AAD19");
});
$('body').on('blur', '.reg_input_code', function () {
	let code = $(".reg_input_code").val();
	$(this).removeAttr("style");
	if (code == "") {
		$(".reg_error_code").fadeIn();
		return false;
	} else {
		$(".reg_error_code").fadeOut();
	}
});

// 获取验证码
$('body').on('click', '.reg_btn_code', function () {
	oWidget.btnTimer($(".reg_btn_code"), 60, "重新获取");
});

// 登记框提交
$('body').on('click', '.reg_btn_submit', function () {
	let bSubmit = true;
	let name = $(".reg_input_name").val();
	let tel = $(".reg_input_tel").val();
	console.log('获取的姓名：' + name);
	console.log('获取的电话：' + tel);
	if (!vertify.isName(name)) {
		$(".reg_error_name").hide();
		$(".reg_error_name").fadeIn();
		bSubmit = false;
	}
	if (!vertify.isTel(tel)) {
		$(".reg_error_tel").hide();
		$(".reg_error_tel").fadeIn();
		bSubmit = false;
	}
	if ($(".reg_input_code")) {
		let code = $(".reg_input_code").val();
		if (code == "") {
			$(".reg_error_code").hide();
			$(".reg_error_code").fadeIn();
			bSubmit = false;
		}
	}
	if (bSubmit) {
		// 验证通过 显示loading
		oWidget.showLoading();
		$.ajax({
			url: 'dal/AddInfo.aspx',
			type: 'post',
			data: { name: name, tel: tel },
			success: function (res) {
				// 隐藏loading
				oWidget.hideLoading();
				if (res == 1) {
					alert("登记成功");
				} else if (res == -1) {
					alert("网络延迟，请稍后再试");
				}
			}
		});
	}
});

// 登记框关闭
$('body').on('click', '.reg_btn_close', function () {
	$(".page_reg").fadeOut();
});