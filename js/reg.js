//登记框
var vertify = {
    isName : function(str){
    var reg = /^[\u4E00-\u9FA5]{2,6}$/;
        return reg.test(str);
    },
    isTel : function(str){
        var reg = /^1[34578][0-9]\d{8}$/;
        return reg.test(str);
    },
    isIDCard : function(str){
        var reg = new RegExp("/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/");
        return reg.test(str);
    }
};
$('body').on('focus', '#Rname', function () {
    $('.name-icon').removeClass('icon-guanbi2fill icon-yuanxingxuanzhongfill');
    $(this).css("border","1px solid #333");
});
$('body').on('blur', '#Rname', function () {
    var name = $("#Rname").val();
    $(this).removeAttr("style");
    if (!vertify.isName(name)) {
        $('.name-icon').addClass('icon-guanbi2fill');
        $("#Rhint").text("*姓名请输入2-6位的中文");
        return false;
    } else {
        $('.name-icon').addClass('icon-yuanxingxuanzhongfill');
        $("#Rhint").text("")
    }
});
$('body').on('focus', '#Rtel', function () {
    $('.tel-icon').removeClass('icon-guanbi2fill icon-yuanxingxuanzhongfill');
    $(this).css("border","1px solid #333");
});
$('body').on('blur', '#Rtel', function () {
    var tel = $("#Rtel").val();
    $(this).removeAttr("style");
    if (!vertify.isTel(tel)) {
        $('.tel-icon').addClass('icon-guanbi2fill');
        $("#Rhint").text("*请输入正确的手机号码");
        return false;
    } else {
        $('.tel-icon').addClass('icon-yuanxingxuanzhongfill');
        $("#Rhint").text("")
    }
});
$('body').on('click', '#Rsend', function(){
    btnTimer($("#Rsend"),60,"再次获取");
});
//登记框提交
$('body').on('click', '#Rsubmit', function () {
    var name = $("#Rname").val();
    var tel = $("#Rtel").val();
    if (!vertify.isName(name)) {
        pWidget.alert("姓名请输入2-6位的中文");
        return false;
    }
    if (!vertify.isTel(tel)) {
        pWidget.alert("请输入正确的手机号码");
        return false;
    }
	if( $("#Ryzm") ){
		console.log('yzm!!!');
		var yzm = $("#Ryzm").val();
		if (yzm=="") {
			pWidget.alert("请输入验证码");
			return false;
		}
	}
    //验证通过 显示loading
    pWidget.showLoading();
    $.ajax({
        url:'dal/AddInfo.aspx',
        type:'post',
        data:{name:name, tel:tel},
        success:function(res){
            //ajax成功 隐藏loading
            pWidget.hideLoading();
            if(res == 1){
            alert("登记成功");
            }else if(res == -1){
            alert("网络延迟，请稍后再试");
            }
        }
    });
});
//登记框关闭
$('body').on('click', '#Rclose', function(){
    $("#Rmask").fadeOut();
});