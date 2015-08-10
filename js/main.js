(function(window,document){
	// learn cloud初始化
	AV.initialize("x4wg7adtwqe58wyp20wfkiwflctzbgypi75kxwa14t7ivn7h", "mz8fu3avegzfzf8s6axqii5ujm8bef999b99ko9t5irg4mhy");



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

		// 为增加笔记本的输入框添加时间
		$('.inputAddNotebook').blur(inputAddNotebookBlur);
		$('.inputAddNotebook').keyup(function(event){
			if(event.keyCode == 13){
				inputAddNotebookBlur(event);
			}
		})

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

		// 添加笔记本的input失去焦点，如果里面没有内容则隐藏输入框，如果有内容，则保存


		function clickNotebook(event){
			event.preventDefault();
			$target = $(event.target);
			if(!$target.hasClass('selected')){
				$target.parents('#notebooks').find('.notebook').removeClass('selected');
				$target.parents('.notebook').addClass('selected');
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
				var newNotebook = {
					title: $target.val(),
					numberOfNote: '0'
				};
				console.log(newNotebook);
				NotebookModel.add(newNotebook,addNotebook);
				$target.val('');
				$target.hide();
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
})(this,this.document);
