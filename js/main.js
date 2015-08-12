(function(window,document){
	// learn cloud初始化
	AV.initialize("x4wg7adtwqe58wyp20wfkiwflctzbgypi75kxwa14t7ivn7h", "b4t6fm6ej6zjwq1iemw7z3zypd2slava19va3xdxvci9wt21");



	//notebookObj.save({title: "设计",numberOfNote:"10"}, {
	//	success: function(object) {
	//		console.log(object);
	//	}
	//});



	/* for convient ,uses gloabl variable here */
	var global = {}
	global.notebooks = [];
	global.catalogue = [];
	global.notebook  = {};
	global.essay     = {};
	global.selectedNotebook = null;
	global.selectedEssay = null;

	/* Handles all the logic here */
	$(document).ready(function(){
		// NotebookModel.loadAll(callback)
		NotebookModel.loadAll(getNotebooks);

		CatalogueView.render($('#catalogues'),[]);

		// 添加笔记本的input失去焦点，如果里面没有内容则隐藏输入框，如果有内容，则保存
		$('.inputAddNotebook').blur(inputAddNotebookBlur);

		// 输入框改变事件
		$('.inputAddNotebook').keyup(function(event){
			if(event.keyCode == 13){
				inputAddNotebookBlur(event);
			}
		})

		// 点击删除按钮
		$('.deleteNotebook').click(deleteNotebook);


		// 得到所有的notebook 通过view.js渲染
		function getNotebooks(error, notebooks){
			$notebooks = $('#notebooks');
			if(error){
				console.log('error');
			}else{
				if(notebooks && notebooks.length >0){
					global.notebooks = notebooks;
					console.log(notebooks);
				}else{
					notebooks = [];
				}
				NotebookView.render($('#notebooks'),notebooks);
			}
			util.checkNotebook(clickNotebook);

		}

		// 增加笔记本回调事件，渲染新节点
		function addNotebook(error, notebook){
			if(error){
				console.debug(error);
			}else{
				console.log('add回调:', notebook);
				if(notebook.id){
					global.notebooks.push(notebook);
					NotebookView.render($('#notebooks'), notebook);
					util.checkNotebook(clickNotebook);
				}
			}
		}

		// 单击notebook,选中当前notebook  该事件在util.checkNotebook中绑定
		function clickNotebook(event){
			event.preventDefault();
			$target = $(event.target);
			if(!$target.hasClass('selected')){
				$target.parents('#notebooks').find('.notebook').removeClass('selected');
				$target.parents('.notebook').addClass('selected');
				var stringArray = $target.text().split('(');
				if(stringArray[stringArray.length-1] === "0)"){
					CatalogueView.render($('#catalogues'),[]);
					return 'no essay';
				}
				var title = stringArray.slice(0,stringArray.length-1).join('');
				EssayModel.loadAll(title,loadEssays);
			}
			function loadEssays(error,essays){
				if(error) return console.log(error);
				global.catalogue = [];
				essays.forEach(function(item){
					global.catalogue.push(item);
				});

				CatalogueView.render($('#catalogues'),global.catalogue);
				util.checkCatalogue(clickCatalogue);
				console.log('success get');
				console.log(global.catalogue);
			}
		}


		// 单击catalogue,选中当前的目录   该事件在util.checkCatalogue中绑定
		function clickCatalogue(event){
			console.log('click catalogue');
			event.preventDefault();
			var $target = $(event.target);
			console.log($target);
			if(!$target.hasClass('selected')){
				$target.parents('#catalogues').find('.catalogue').removeClass('selected');
				$target.parents('.catalogue').addClass('selected');
			}
		}


		// 添加目录对话框失去焦点事件；如果没有输入则隐藏输入框，有输入则保存
		function inputAddNotebookBlur(event){
			var $target = $(event.target);
			if(!$target.val()){
				$target.hide();
			}else{
				// TODO
				console.log($target.val())
				if(global.notebooks.some(function(item){
						return item.title === $target.val();
					})){
					alert('不能有一样名字的笔记本哦~');
					return false;
				}
				var newNotebook = {
					title: $target.val(),
					numberOfNote: 0,
					alive: true
				};
				console.log(newNotebook);
				NotebookModel.add(newNotebook,addNotebook);
				$target.val('');
				$target.hide();
			}
		}

		// 删除目录
		function deleteNotebook(event){
			console.log('deletenotebook click');
			$notebooksDeleted = $('#notebooks').find('.selected');
			console.log($notebooksDeleted);
			if($notebooksDeleted.length > 0){
				$notebooksDeleted.each(function(index,item){

					NotebookModel.remove($(item).data('id'),finishDeleteNotebook);
				})
			}
			function finishDeleteNotebook(error, notebook){
				if(error) return console.log(error);
				$('.notebook.selected').remove();
			}

		}




	})
	$('.editor-area').on('paste',function(){
		var $this=$(this);
		setTimeout(function(){
			$this.html($this.text());
		},3);
	})
	$('.addNotebook').click(function(event){
		$('.inputAddNotebook').show().focus();
	})
	$('a').click(function(event){
		event.preventDefault();
	})
})(this,this.document);
