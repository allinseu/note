(function(window,document){
	var util = {};

	// 检查notebook，如果为空隐藏删除按钮，并且为所有笔记本绑定点击时间
	util.checkNotebook = function(clickNotebook){
		if($('#notebooks').children('li').length === 0){
			$('.deleteNotebook').hide();
		}else{
			$('.notebook').find('a').unbind();
			$('.deleteNotebook').show();
			$('.notebook').find('a').click(clickNotebook);
		}
	}

	// 将从learnCloud得到的notebook对象拷贝成我们需要的对象
	util.cloneNotebook = function(fromObj,toObj) {
		toObj.id = fromObj.id;
		toObj.title = fromObj.attributes.title;
		toObj.numberOfNote = parseInt(fromObj.attributes.numberOfNote);
	}

	util.cloneEssay    = function(fromObj,toObj) {
		toObj.id = fromObj.id;
		toObj.title = fromObj.attributes.title;
		toObj.content = fromObj.attributes.content;
		toObj.date    = new Date(fromObj.createdAt);

	}
	window.util = util;
})(this,this.document)