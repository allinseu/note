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

        var waitNotebook = util.setTimer(waitToRenderCatalogue,300);

		var waitCatalogue = util.setTimer(waitToRenderEssay,400);
        function waitToRenderCatalogue(){
            // console.log('运行中.....');
            var time = time || 4;
            if(time<0 || global.notebooks.length>0){
                if($('.notebook')[0]){
                    $($('.notebook')[0]).find('a').trigger("click");
                }
                util.clearTimer(waitNotebook);
            }else{
                time -- ;
            }
        }

		function waitToRenderEssay(){
			var time = time || 5;
			if(time<0 || global.catalogue.length>0){
				clickCatalogueAnalog();
				util.clearTimer(waitCatalogue);
			}else{
				time -- ;
			}
		}



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

        $('.create-essay').click(clickCreateEssay);

        $(document).on('keyup','.essay-title', function(){
            var title = $(this).val()||'标题';
            $('.catalogue.selected').find('h5').html(title);
        })

		$(document).on('keyup','.editor-area', function(){
			var content = $(this).text()||'令人虎躯一震的内容';
			if(content.length>80){
				content = content.slice(0,80)+'...';
			}
			$('.catalogue.selected').find('p').html(content);
		})

		$('.add-essay').click(clickAddEssay);

        function clickCreateEssay(){
            console.log($('.catalogue'));
            $('.catalogue').removeClass('selected');
            showEditor();
            CreatingCatalogue.render($('#catalogues'));
        }

		// 得到所有的notebook 通过view.js渲染
		function getNotebooks(error, notebooks){
			$notebooks = $('#notebooks');
			if(error){
				console.log('error');

			}else{
				if(notebooks && notebooks.length >0){
					global.notebooks = notebooks;
					// console.log(notebooks);
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
			$target = $(this);
			if(!$target.hasClass('selected')){
                $('.notebook').removeClass('selected');
                $target.addClass('selected');
				$('.deleteNotebook').addClass('g_pointer')
				var stringArray = $target.text().split('(');
				var title = stringArray.slice(0,stringArray.length-1).join('');
				console.log(global.notebooks);
				global.selectedNotebook = util.findSelectOne(title,global.notebooks);
				console.log('Select notebook: ' +global.selectedNotebook);

				if(stringArray[stringArray.length-1] === "0)"){
					CatalogueView.render($('#catalogues'),[]);
					return 'no essay';
				}
				EssayModel.loadAll(title,loadEssays);
				clickCatalogueAnalog();
			}
			console.log(global.catalogue);
			function loadEssays(error,essays){
				if(error) return console.log(error);
				global.catalogue = [];
				essays.forEach(function(item){
					global.catalogue.push(item);
				});

				CatalogueView.render($('#catalogues'),global.catalogue);
				util.checkCatalogue(clickCatalogue);
				// console.log('success get');
				// console.log(global.catalogue);
			}
		}


		// 单击catalogue,选中当前的目录   该事件在util.checkCatalogue中绑定
		function clickCatalogue(event){
			console.log('click catalogue');
			event.preventDefault();

			var $target = $(event.target);
			if(!$(this).hasClass('selected')){
				$('#catalogues').find('.catalogue').removeClass('selected');
				$(this).addClass('selected');

				global.selectedEssay = util.findSelectOne($(this).find('h5').text(), global.catalogue);

			}
			console.log(global.selectedEssay);
			EssayView.render($('.content'), global.selectedEssay);
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
				// console.log(newNotebook);
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

        // 显示编辑文章界面
        function showEditor(){
            CreatingEssayView.render();
        }

		// 点击保存笔记
		function clickAddEssay(){
			console.log('Add Essay...');
			var newEssay = {};
			newEssay.title = $('input.essay-title').val();
			newEssay.content = $('.editor-area').text();
			newEssay.alive = true;

			console.log('Add new Essay:')
			console.log(newEssay);
			EssayModel.add(global.selectedNotebook,newEssay, addEssay);
			function addEssay(error, essay){
				if(error) return console.log('some error occurred');
				// console.log('Add Essay success: ');

				 console.log(essay);
				updateNotebook('add')
			}

		}


		function updateNotebook(op){
			switch (op){
				case 'add':
					console.log('update notebook');
					if(notebookPlus()){
						// TODO 更新view
						NotebookView.update($('#notebooks').find('.selected'), global.selectedNotebook);
						console.log('Notebook update!');
					};
					break;
			}

			// 所有更新操作只会对选中的notebook进行
			function notebookPlus(){

				var notebook = global.selectedNotebook;
				console.log(notebook);
				if(notebook && notebook.id){
					notebook.numberOfNote ++;
					NotebookModel.update(notebook, function(error,notebook){
						if(error) console.log(error);
						console.log(notebook);
						global.selectedNotebook = notebook;
					})
					return true;
				}else{
					console.log("can't find seleted notebook!");
					return false;
				}
			}
		}

		function clickCatalogueAnalog(){
			if($('.catalogue').length > 0){
				$('.catalogue').first().trigger('click');
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
