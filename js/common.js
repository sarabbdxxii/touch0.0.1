
/*点赞*/
function likeit(self){
  $(self).toggleClass('liked');
}
/*帖子详情页点赞*/
function likeit2(self){
    $(self).toggleClass('liked');
}
/*'分享'弹出层*/
function close_black(){
  $(".black").fadeOut('400');
  $(".share_list").animate({bottom: '-48.7%'});
}
function show_share(type,id){
    $(".black").fadeIn('400');
    $(".share_list").animate({bottom: '0'});
    var forum_type = '';
    if(type==1){
        forum_type ="long_forum";
    }else{
        forum_type ="short_forum";
    }

    //百度分享代码
    window._bd_share_config = {
        "common": {
            "bdSnsKey": {},
            "bdText": "",
            "bdMini": "2",
            "bdMiniList": false,
            "bdPic": "",
            "bdStyle": "0",
            "bdSize": "16",
            "bdUrl" : "longyu.cc"+id+forum_type
        },
        "share": {},
        "selectShare": {
            "bdContainerClass": null,
            "bdSelectMiniList": ["sqq","qzone","tsina"]
        }
    };
    with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~ ( - new Date() / 36e5)];

}
/*加关注*/
function attention(self){
  $(self).fadeOut('400');
  $.toast("加关注成功");
}
/*帖子详情页加关注*/
function payAttention(self){
    if($(self).html()=="未关注"){
        $(self).html("已关注");
    }
}

//评论输入框
function commend_box(type,username){
    $('.close-popup').click(function() {
        $('#com_box').val('');
    });
    if(type==1){
        $('#com_box').val('@'+username+'：');
    }else{
        $('#com_box').attr('placeholder','说说你的看法');
    }

}
/*切换标题tab-消息/联系人页*/
function tabSwitch(self){
    var theid = $(self).attr('id');
    $('.tab-link').removeClass('active');
    $(self).addClass('active');
    $('.content').hide();
    $('#'+theid+'-content').show();
    //index-list-bar
    if(theid == 'msg'){
        $('.index-list-bar').hide();
    }else{
        $('.index-list-bar').show();
    }
}

$('.smile_icon').click(function(event) {
    $('.face_show').toggle();
});


//发布弹出按钮
$('.post_btn').click(function(){
    $('.post_index').fadeIn('fast', function() {
        _self = $(this);
        _self.addClass('animate');
        $('.close_btn').click(function() {
            _self.fadeOut('fast');
            _self.removeClass('animate');
        });
    });
})

//我的粉丝、我的关注页面 ：加/取消关注
function toggleConcerned(self){
    $(self).toggleClass('not_concerned');
        if($(self).hasClass('not_concerned')){
            $(self).html("+关注");
        }else{
            $(self).html("已关注");
        }
    }

//我的内容 页 订阅内容
function subscribe(self){
    $(self).toggleClass('on');
}

//首页 关闭提示下载层
function closeDownloadTip(){
    $(".download_tip").fadeOut();
    $(".buttons-tab1").css('top',0);
    $(".content").removeClass('on');
}

//打开微信分享
function wechat_share(){
    $('.wechat_share').fadeIn();
}
//关闭微信分享
function close_wechat_share(){
    $('.wechat_share').fadeOut();
}

//是否举报对话框
function show_login_dialog(){
    $('.modal-overlay').fadeIn();
    $('.modal-in').css('display','block');
}
function cancle_login(){
    $('.modal-overlay').fadeOut();
    $('.modal-in').css('display','none');
}
function confirm_login(){
    $('.modal-overlay').fadeOut();
    $('.modal-in').css('display','none');
}


function close_history(self){
    $(self).parent().remove();
    if($('.his_item').size() == 0){
        $('.delete_btn').hide();
    }
}

//清空历史记录
function empty_history(){
    $('.search_history').empty();
}

//显示清空搜索框按钮
function showClearBtn(self){
    if($(self).val() != ""){
        $(".clear_btn").show();
    }else{
        $(".clear_btn").hide();
    }
}
//清空搜索框
function clearInput(self){
    $("#search").val("");
    $(".clear_btn").hide();
}
//直播页送礼物
function send_gift(self){
    $(self).css('visibility','visible');
    $(self).addClass('move');
    setTimeout(function(){
      $(self).removeClass('move');
      setTimeout(function(){
        $(self).css('visibility','hidden');
      },700)
    }, 2000)
}

