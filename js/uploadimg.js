/*
 * html5 会保存上次所传图片记录，防止连续上传相同图片
*/
var ET_UPLOAD_IMG = {
	imgInput:null,									//html file控件对象
	imgPreviewBox:null,								//图片预览对象容器
	imgType:['image/jpeg','image/gif','image/png','image/jpg'],	//允许上传类型
	imgMaxSize:2097152,								//上传最大值2M
	ajaxUrl:null,									//图片上传路径
	imgMaxWidth:500,								//新图默认宽
	imgMaxHeight:0,									//为0会等比生成
	imgPreMaxWidth:65,								//预览图最大宽度,不能为0
	imgPreMaxHeight:65,								//预览图最大高度,不能为0
	isCompressImg:true,								//是否重绘缩略图
	canvasImgType:"image/png",						//图片保存类型
	canvasImgQuality:0.5,							//如果为jpeg图片质量生效

	//初始化
	init : function(objImgInput,objImgPreview,valAjaxUrl){
		this.imgPreviewBox=objImgPreview;
		this.ajaxUrl=valAjaxUrl;
		this.imgPreMaxWidth=100;
		this.imgPreMaxHeight=100;
		this.imgInput = objImgInput;

		var self=this;
		if(this.imgInput){
			this.imgInput.change(function(e){self.funShowPreview(e)});
		};
	},

	//显示缩略图并上传图片
	funShowPreview : function(e){
		var self=this;
		var img=this.funGetImgs(e);
		if(window.FileReader){
			var reader=new FileReader();
			reader.onloadstart=function(){self.funOnStart()};
			reader.onload=function(e){self.funOnLoad(e.target.result,img)};
			reader.onprogress=function(){self.funOnProgress()};
			reader.readAsDataURL(img);
		}else{
			alert('\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6587\u4ef6\u4e0a\u4f20');//'您的浏览器不支持文件上传
		}
	},

	//创建预览框
	funOnStart : function(){
		var self = this;
		var post_with = parseInt($(window).width())*0.2;
		var post_with1 = post_with.toFixed(1);
		var first_thumb=this.imgPreviewBox.find('li').get(0);
		var html_data='<li class="added-pic"><div class="j-img" style="width:5rem;height:5rem; background-position:center;"></div></li>';
		$(html_data).insertBefore($(first_thumb));
		this.imgPreviewBox.find('li.added-pic').eq(1).remove();
		$(second_thumb).remove();
		this.funSetLoading('loading');
		$('.added-pic').unbind('click').click(function(e){
			self.funDelPreview(e);
			$('.post_list1').css({'display':'block'});
		});//先取消绑定，防止连续执行
	},

	funOnProgress : function(){
		this.funSetLoading('loading');
	},

	funOnLoad : function(dataurl,img){

		this.funResetFile();

		//读取文件提示
		this.funSetLoading('loading');

		//如果type为空 *百度手机浏览器
		if(!img.type){
			dataurl=this.funChangeDataurl(dataurl,img.imgType);
		}

		//前台显示预览图
		this.funCreatPreview(dataurl);

		//创建canvas、重新生成附件图并异步上传图片
		var self=this;
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var newimg=new Image;
		newimg.src=dataurl;
		if(newimg.width > this.imgMaxWidth){
			this.funNewUploadImg(canvas,context,newimg,img,dataurl);
		}else{
			var imgbase64=dataurl.substring(dataurl.indexOf(",") + 1);
			var imgdata={'name':img.name,'type':'image','size':img.size,'Filedata':imgbase64}
			this.funUploadImg(imgdata);
		}
	},

	//重新生成附件图并上传
	funNewUploadImg : function(canvas,context,newimg,img,dataurl){
		var canvasWH=this.funNewWH(newimg.width,newimg.height,this.imgMaxWidth,this.imgMaxHeight);
		canvas.width = canvasWH['width'];
		canvas.height = canvasWH['height'];
		var self = this;
		newimg.onload = function(){
			var natureWidth=newimg.width;
			var natureHeight=newimg.height;
			var newWH=self.funNewWH(natureWidth,natureHeight,self.imgMaxWidth,self.imgMaxHeight);
			context.drawImage(newimg,0,0,newWH['width'],newWH['height']);
			dataurl = canvas.toDataURL(self.canvasImgType,self.canvasTypeQuality);
			var imgbase64=dataurl.substring(dataurl.indexOf(",") + 1);
			var imgdata={'name':img.name,'type':'image','size':img.size,'Filedata':imgbase64}
			self.funUploadImg(imgdata);
		}
	},

	//上传图
	funUploadImg : function(imgdata){
		var self = this;
		$.ajax({
			type: 'post',
			url: self.ajaxUrl,
			data: imgdata,
			beforeSend:self.funSetLoading('loading'),
			error:function(a,b,c){},
			success:function(data){
				if(data.code > 0){
					self.funAddAttach(data.code);
					self.funSetLoading('succeed');
				} else {
					alert(data.error);
				}
			}
		});
	},

	//获取上传图片
	funGetImgs : function(e){
		var img = e.target.files[0];
		if(!img.type){
			for(var key in img){
				if(key!='imgType') img['imgType']=this.funChangeImgtype(img.name);
			}
		}
		return img;
	},

	//设置上传提示
	funSetLoading : function(type){
		var loading=$('.loading').get(0);
		if(type == 'loading'){
			$(loading).css('background','url(/Public/Mobile/image/loading.gif) no-repeat center');
			$('#send_reply').removeAttr('onclick');
			$('#send_reply').css('background','#ccc');
		}else if(type == 'succeed'){
			$(loading).css('background','');
			$('#send_reply').css('background','#00a0e9');
			$('#send_reply').attr('onclick','submit_reply()');
		}
	},

	//取消上传提示
	funDelLoading: function(){
		$('.loading').css('background','');
	},

	//检查文件大小和类型
	funCheckImg : function(img){
		if(this.imgType.indexOf(img.type) < 0 && this.imgType.indexOf(img.imgType)){
			alert('\u4e0d\u5141\u8bb8\u4e0a\u4f20\u8be5\u6587\u4ef6\u7c7b\u578b');//不允许上传该文件类型
			return false;
		}
		if(img.size > this.imgMaxSize ){
			alert('\u4e0a\u4f20\u6587\u4ef6\u8fc7\u5927');//上传文件过大
			return false;
		}
		return true;
	},

	//生成缩略图
	funCreatPreview : function(dataurl){
		if(this.isCompressImg){
			//重新绘图,生成较小的缩略图
			this.funCompressImg(this.imgPreMaxWidth,this.imgPreMaxHeight,dataurl);
			return;
		}

		this.funAddPreview(dataurl);
	},

	//添加缩略图
	funAddPreview : function(dataurl){
		$('.j-img').css('backgroundImage','url('+dataurl+')');
		$('.j-img').css('backgroundSize','cover');
		$('.j-img').css('backgroundRepeat','no-repeat');
		$('.j-img').attr('class','');
	},

	//删除缩略图
	funDelPreview : function(e){
		if(confirm('\u786e\u8ba4\u5220\u9664\uff1f')){
			$(e.target).parent('.added-pic').remove();
		}
	},

	//重新生成缩略图
	funCompressImg : function(imgPreMaxWidth,imgPreMaxHeight,dataurl){
		//创建canvas
		var self=this;
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		canvas.width = imgPreMaxWidth;
		canvas.height = imgPreMaxHeight;

		//绑定新图片
		var img=new Image;
		img.src=dataurl;
		img.onload = function(){
			var natureWidth=img.width;
			var natureHeight=img.height;
			var newWH=self.funPreNewWH(natureWidth,natureHeight,imgPreMaxWidth,imgPreMaxHeight);
			context.drawImage(img,0,0,newWH['width'],newWH['height']);
			self.funAddPreview(canvas.toDataURL(self.canvasImgType,self.canvasTypeQuality));
		}
	},

	//计算缩略图新宽高
	funPreNewWH : function(natureWidth,natureHeight,imgPreMaxWidth,imgPreMaxHeight){
		var ratio=natureWidth/natureHeight;
		if(natureWidth <= natureHeight){
			var w = imgPreMaxWidth;
			var h = imgPreMaxHeight / ratio;
		}else if(natureWidth > natureHeight){
			var w = imgPreMaxWidth * ratio;
			var h = imgPreMaxHeight;
		}
		return {'width':w,'height':h};
	},

	//计算新附件图宽高
	funNewWH : function(natureWidth,natureHeight,imgMaxWidth,imgMaxHeight){
		var ratio=natureWidth/natureHeight;
		if(imgMaxWidth && imgMaxHeight){
			var w = imgMaxWidth;
			var h = imgMaxHeight;
		}else if(imgMaxWidth && !imgMaxHeight){
			var w = imgMaxWidth;
			var h = imgMaxWidth / ratio;
		}else if(!imgMaxWidth && imgMaxHeight){
			var w = imgMaxHeight * ratio;
			var h = imgMaxHeight;
		}else{
			var w = natureWidth;
			var h = natureHeight;
		}
		return {'width':w,'height':h};
	},

	//百度浏览器无法获取image type
	funChangeImgtype : function(imgname){
		var imgtype;
		var suffix=imgname.split(".").pop();
		switch(suffix){
			case 'jpg':
			case 'jpeg':
				imgtype='image/jpeg';
				break;
			case 'png':imgtype='image/png';break;
			case 'gif':imgtype='image/gif';break;
			default:imgtype='image/png';break;

		}
		return imgtype;
	},

	//修改dataurl
	funChangeDataurl : function(dataurl,imgtype){
		dataurl=dataurl.replace('data:','data:'+imgtype+';');
		return dataurl;
	},

	//表单中添加attach(DZ)
	funAddAttach : function(data){
		var append_con='<input type="hidden" name="attachnew['+data+']" value="'+data+'" />\
						<input type="hidden" name="attachnew['+data+'][description]" />\
						<input type="hidden" name="attachnew['+data+'][readperm]" value="0">\
						<input type="hidden" name="attachnew['+data+'][isimage]" value="1">\
						<input type="hidden" name="attachnew['+data+'][price]" value="0">';
		var added_pic=$('.added-pic').get(0);
		$(added_pic).append(append_con);
	},

	//uc浏览器清空file
	funResetFile : function(){
		$('#Filedata').remove();
		var html = '<input id="Filedata" name="Filedata" class="s_picture" type="file" multiple="multiple"  accept="image/jpeg,image/png,image/gif,image/bmp"/>';
		$(html).insertBefore($('#Fileurl'));
		this.init($("#Filedata"),$(".upload_container"),$("#Fileurl").val());
	}
};
