(function(window,document){

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

		function getNotebooks(error, notebooks){
			if(error){
				console.log('error');
			}else{
				if(notebooks && notebooks.length >0){
				}else{
					console.log('no notebook');
					NotebookView.render($('#notebook'),null);
				}
			}
			util.checkNotebook();
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
	$('.inputAddNotebook').keyup(function(event){
		if(event.keyCode == 13){
			saveNotebook();
			$('.inputAddNotebook').hide();
		}
	})
	function saveNotebook(){
		console.log('save');
		var notebook = {};
		notebook.title = $('.inputAddNotebook').val();
		notebook.count = 0;
		util.assignId(global.notebooks,notebook);
		console.log(notebook);
	}
})(this,this.document);
